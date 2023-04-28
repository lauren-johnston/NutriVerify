import { json } from "body-parser";

const webpageExtractionPrompt = `
Please extract the following information from the provided product description or website, and return the data in JSON format using the schema below:

{
  "product_name": "<string>",
  "brand": "<string>",
  "price": "<string>",
  "size": "<string>",
  "flavor": "<string>",
  "diet_type": "<string>",
  "age_range": "<string>",
  "item_form": "<string>",
  "product_description": "<string>",
  "product_features": [
    "<string>",
    ...
  ],
  "rating": "<string>",
  "total_ratings": <integer>,
  "active_ingredients": [
    {
      "ingredient": "<string>",
      "claims": [
        "<string>",
        ...
      ]
    },
    ...
  ]
}

Make sure to be true to the source and only include factual information. Be sure to follow the exact JSON schema.`;

const healthAPISummarizationPrompt = `
Given an active ingredient for a supplement and an array of claims that were made about it by the seller, use the
top abstracts studying this active ingredient to populate the JSON output below:

{
"ingredient": "<ingredient_1>",
"claims": [
    {
    "claim": "<claim_1>",
    "correctness": "<Found potential supporting evidence/Found potential conflicting evidence/Unable to assess claim correctness
    >",
    "supporting_evidence": [
        {
        "source": "<source_name>",
        "url": "<source_url>",
        "summary": "<source_summary>"
        },
        ...
    ],
    "conflicting_evidence": [
        {
        "source": "<source_name>",
        "url": "<source_url>",
        "summary": "<source_summary>"
        },
        ...
    ]
    },
    ...
],
"reported_benefits": [
    "<benefit_1>",
    ...
],
"reported_cons": [
    "<con_1>",
    ...
]
}
`
export { webpageExtractionPrompt, healthAPISummarizationPrompt };