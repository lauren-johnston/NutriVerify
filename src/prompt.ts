
const prompt = `
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
      "daily_value_percentage": "<string>",
      "claims": [
        "<string>",
        ...
      ]
    },
    ...
  ],
  "general_claims": [
    "<string>",
    ...
  ]
}

Make sure to include all available information in the JSON output, ensuring accuracy and consistency across different sources.`;

export default prompt;