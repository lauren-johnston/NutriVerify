const extractionSchema = `{
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
  }`
const webpageExtractionPrompt = `
Pretend you are an expert ETL Analyst. Please extract the following information from the provided product description or website, and return the data in JSON format using the schema below:

${extractionSchema}

Make sure to be true to the source and only include information that is actually in the provided text. Be sure to follow the exact JSON schema. Do your best to populate the claims for each ingredient but make sure that they are based on the source material.`;

const healthAPISummarizationPrompt = `
Pretend you are an expert ETL Analyst. Given an active ingredient for a supplement and an array of claims that were made about it by the seller, use the
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

Do not deviate from the expected format.
`
export { webpageExtractionPrompt, healthAPISummarizationPrompt };