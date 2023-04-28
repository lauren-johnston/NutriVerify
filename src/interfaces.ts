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

  export { WebpageExtraction, Claim, ActiveIngredient, HealthAPISummarization }