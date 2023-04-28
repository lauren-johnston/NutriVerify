import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import { webpageExtractionPrompt, healthAPISummarizationPrompt} from './prompt';
import { Configuration, OpenAIApi } from 'openai';
import cheerio from 'cheerio';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const app = express();

app.use(cors());
app.use(express.json());

interface WebpageExtraction {
  product_name: string;
  brand: string;
  price: string;
  size: string;
  flavor: string;
  diet_type: string;
  age_range: string;
  item_form: string;
  product_description: string;
  product_features: string[];
  rating: string;
  total_ratings: number;
  active_ingredients: {
    ingredient: string;
    claims: string[];
  }[];
}

interface Claim {
    claim: string;
    correctness: string;
    supporting_evidence: {
      source: string;
      url: string;
      summary: string;
    }[];
    conflicting_evidence: {
      source: string;
      url: string;
      summary: string;
    }[];
};

interface ActiveIngredient {
  ingredient: string;
  claims: Claim[];
  reported_benefits?: string[];
  reported_cons?: string[];
}

interface HealthAPISummarization {
  product_name: string;
  active_ingredients: ActiveIngredient[];
}

async function callGPT4(input: string, prompt: string): Promise<string | undefined> {
  // TODO(Lauren): This is a temporary optimization to reduce the number 
  // of tokens sent to GPT4. Need to add a more robust preprocessing algorithm.
  const targetSnippet = "See questions and answers";
  const [trimmedString] = input.split(targetSnippet);
  console
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
  const topCitedAbstracts = await getTopCitedAbstracts(activeIngredient.ingredient, 5);
  // Use the abstracts to populate the claims
  const inputData = JSON.stringify({activeIngredient, topCitedAbstracts});
  const gpt4Summary = await callGPT4(inputData, healthAPISummarizationPrompt);
  return gpt4Summary;
}

async function generateOutput(gpt4ParsedData: string | undefined): Promise<HealthAPISummarization | {}> {
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
  // TODO(Lauren): This is a demo only: to be removed 
  // const sample = {"results": [
  //   {
  //   "ingredient": "GABA",
  //   "claims": [
  //       {
  //           "claim": "promotes relaxation",
  //           "correctness": "Found potential supporting evidence",
  //           "supporting_evidence": [
  //               {
  //                   "source": "Psychobiotics",
  //                   "url": "",
  //                   "summary": "Probiotic treatment with Lactobacillus helveticus R0052 and Bifidobacterium longum R0175 increased the secretion of anti-inflammatory cytokines and decreased pro-inflammatory cytokines, which may promote relaxation through the gut-brain axis."
  //               }
  //           ],
  //           "conflicting_evidence": []
  //       },
  //       {
  //           "claim": "helps combat stress",
  //           "correctness": "Found potential supporting evidence",
  //           "supporting_evidence": [
  //               {
  //                   "source": "Probiotics",
  //                   "url": "",
  //                   "summary": "TLP (a combination of Lactobacillus caseiS1, Enterococcus faeciumS4, and L. harbinensisS6) showed an increase in GABA production, a neurotransmitter linked to stress reduction."
  //               },
  //               {
  //                   "source": "Prebiotics",
  //                   "url": "",
  //                   "summary": "HMO (human milk oligosaccharides) treatment increased GABA levels in both children and adults, which is linked to the gut-brain axis and may help combat stress."
  //               }
  //           ],
  //           "conflicting_evidence": []
  //       }
  //   ],
  //   "reported_benefits": [
  //       "promotes relaxation",
  //       "helps combat stress",
  //       "reduces inflammation",
  //       "improves gastrointestinal activity",
  //       "enhances anti-anxiety homeostasis"
  //   ],
  //   "reported_cons": [
  //       "survival rates of some probiotic strains decrease during gastric phase"
  //   ]
  //   }]}
    
  // res.json(sample);
  const webpageData = req.body.data;
  console.log(webpageData);
  console.log("Got a request to process the webpage data!");
  const gpt4ParsedData = await callGPT4(webpageData, webpageExtractionPrompt);
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