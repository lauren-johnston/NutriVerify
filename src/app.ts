import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

import { Configuration, OpenAIApi } from 'openai';
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const app = express();

// TODO(Lauren): This is unsafe--only for local testing. In future, use:
// app.use(cors({ origin: "chrome-extension://pkdhegdbignijifaofblgpoibmdkkakm" }));
app.use(cors());
app.use(express.json());

async function callGPT4(input: string): Promise<string | undefined> {
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      {
        "role": "user",
        "content": prompt + input
      }
    ],
  });

  return response.data.choices[0].message?.content;
}

async function callOpenFDAAPI(query: string | undefined): Promise<any> {
  if (!query) {
    return;
  }
  // TODO(Lauren): get OpenFDA API working
  // return a fake data from the Open FDA API
  return {
    "data": [
      {
        "id": "1",
        "name": "Acetaminophen",
        "category": "medicine",
        "synonyms": [
          "acetaminophen"
        ]
      }
    ]
  }

  const response = await axios.get(`https://api.fda.gov/drug/label.json?search="${query}"`);
  return response.data;
}
app.get('/', (req, res) => {
  res.send('Hello from the server!');
})

app.post('/process-webpage-data', async (req, res) => {
  // TODO(Lauren): enable error handling after doing more debugging
  // try {
    const webpageData = req.body.data;
    const gpt4ParsedData = await callGPT4(webpageData);
    const openFDAResult = await callOpenFDAAPI(gpt4ParsedData);
    res.json(openFDAResult);
  // } catch (error) {
  //   const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  //   res.status(500).json({ error: errorMessage });  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
