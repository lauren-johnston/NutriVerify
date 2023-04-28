import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import { webpageExtractionPrompt, healthAPISummarizationPrompt} from './prompt';
import { Configuration, OpenAIApi } from 'openai';
import cheerio from 'cheerio';
import { multiVitaminSample } from './sampleData';
import { ActiveIngredient, WebpageExtraction, HealthAPISummarization } from './interfaces';
import { preprocessInput } from './helpers';
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const app = express();

// TODO(Lauren): for security, only allow CORS for chrome extension. Don't need
// to worry about this yet as it is only running locally.
app.use(cors());
app.use(express.json());

async function callGPT4(input: string, prompt: string): Promise<string | undefined> {
  /**
 * Calls the GPT-4 model to generate a response to a prompt and a given input string.
 *
 * @param {string} input - The input string to generate a response for.
 * @param {string} prompt - The prompt to use for generating the response.
 * @returns {Promise<string|undefined>} A Promise that resolves to the generated response string,
 * or `undefined` if the response could not be generated.
 */
  // TODO(Lauren): This is a temporary optimization to reduce the number 
  // of tokens sent to GPT4. Need to add a more robust preprocessing algorithm.
  const trimmedString = preprocessInput(input);
  const response = await openai.createChatCompletion({
    model: 'gpt-4-0314',
    messages: [
      {
        "role": "user",
        "content": prompt + " " + trimmedString
      }
    ],
  });

  return response.data.choices[0].message?.content;
}


async function getTopCitedAbstracts(supplement: string, limit: number): Promise<string[] | null> {
  /**
 * Retrieve the top cited abstracts for a given supplement using PubMed API.
 *
 * @param supplement A string representing the supplement to search for.
 * @param limit A number specifying the maximum number of abstracts to retrieve.
 * @returns A Promise that resolves to an array of strings representing the abstract texts, or null if an error occurs.
 */
  const query = `${supplement}+supplement`;

  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&sort=citations&retmax=${limit}&retmode=json`;

  try {
    const searchResponse = await axios.get(searchUrl);
    const pmids: string[] = searchResponse.data.esearchresult.idlist;

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmids.join()}&retmode=xml`;
    console.log("Fetching articles from the following URL..." + fetchUrl);
  
    try {
      const fetchResponse = await axios.get(fetchUrl);
      const $ = cheerio.load(fetchResponse.data, { xmlMode: true });
      const abstracts: string[] = [];
  
      $('PubmedArticle').each((_, article) => {
        const abstractText = $(article).find('AbstractText').text();
        abstracts.push(abstractText);
      });
  
      return abstracts;
    } catch (error) {
      console.error(error);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function evaluateClaims(activeIngredient: ActiveIngredient): Promise<any> {
/**
 * Evaluate claims for a given active ingredient using GPT-4 summarization.
 * 
 * @param activeIngredient - The active ingredient to evaluate claims for.
 * @returns A promise that resolves to the GPT-4 summary of the claims.
 * @throws If the API call to get top-cited abstracts or GPT-4 summarization fails.
 */
  // Get the top-cited abstracts for the active ingredient
  const topCitedAbstracts = await getTopCitedAbstracts(activeIngredient.ingredient, 5);

  // Use the abstracts to populate the claims
  const inputData = JSON.stringify({activeIngredient, topCitedAbstracts});

  // Call GPT-4 to generate a summary of the claims
  const gpt4Summary = await callGPT4(inputData, healthAPISummarizationPrompt);

  return gpt4Summary;
}

async function generateOutput(gpt4ParsedData: string | undefined): Promise<HealthAPISummarization | {}> {
  /**
 * Generate a HealthAPISummarization from a string of GPT-4 parsed data.
 * 
 * @param gpt4ParsedData - The string of GPT-4 parsed data to generate the summary from.
 * @returns A Promise that resolves to a HealthAPISummarization object, or an empty object if no data is provided.
 */
  if (!gpt4ParsedData) {
    return {};
  }

  const parsedGpt4Data: WebpageExtraction = JSON.parse(gpt4ParsedData);
  const ingredientEvaluations = [];

  for (const ingredient of parsedGpt4Data.active_ingredients) {
    // TODO(Lauren): new to Typescript. What's the best way to do this kind of
    // type conversion?
    const evaluation = await evaluateClaims(ingredient as unknown as ActiveIngredient);
    ingredientEvaluations.push(evaluation);
  }

  const output: HealthAPISummarization = {
    product_name: parsedGpt4Data.product_name,
    active_ingredients: ingredientEvaluations
  };
  console.log(output);
  console.log("Parsed the ingredients...");
  return output;
}

app.get('/', (req, res) => {
  res.send('Hello from the NutriVerify API!');
})

app.post('/process-webpage-data', async (req, res) => {
  // TODO(Lauren): This is for a demo only: to be removed 
  // const sample = multiVitaminSample; 
  // res.json(sample);

  const webpageData = req.body.data;
  console.log(webpageData);
  console.log("Got a request to process the webpage data!");
  const gpt4ParsedData = await callGPT4(webpageData, webpageExtractionPrompt);
  console.log("Parsed the webpage data...", gpt4ParsedData);
  // Generate final JSON output
  const output = await generateOutput(gpt4ParsedData);
  const jsonOutput = JSON.stringify(output);
  
  console.log("Here is the final output of the supplement factcheck:" + jsonOutput);
  res.json(jsonOutput);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});