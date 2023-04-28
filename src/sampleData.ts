const multiVitaminSample = {"active_ingredients": [
        {
          "ingredient": "Omega-3 EPA & DHA",
          "claims": [
            {
              "claim": "EPA & DHA support brain, eye, and overall health",
              "correctness": "Found potential supporting evidence",
              "supporting_evidence": [
                {
                  "source": "Study on the cytotoxic effect of DHA against cancer cells",
                  "url": "",
                  "summary": "DHA has demonstrated cytotoxic effects in tumor and nontumor cell lines, showing potential applicability in the pharmaceutical area of oncological therapies."
                },
                {
                  "source": "Analysis of Omega-3 LC-PUFAs intake and RBC membrane LC-PUFAs during pregnancy",
                  "url": "",
                  "summary": "Higher dietary intakes of Omega-3 LC-PUFAs have been linked to lower rates of preterm birth and preeclampsia in a cohort of Indigenous Australian women."
                },
                {
                  "source": "Investigation of the effect of glyphosate and temperature on the lipid content and fatty acid profile of the Mediterranean mussel",
                  "url": "",
                  "summary": "Mussels are an important source of essential omega-3 PUFAs, which play a critical role in human health and preventing a variety of diseases."
                }
              ],
              "conflicting_evidence": []
            }
          ],
          "reported_benefits": [
            "Potential applicability in cancer therapy",
            "Lower rates of preterm birth and preeclampsia in pregnant women",
            "Plays a critical role in human health and preventing a variety of diseases"
          ],
          "reported_cons": []
        },
        {
          "ingredient": "Vitamin D3",
          "claims": [
            {
              "claim": "Vitamin D3 supports bone and immune health",
              "correctness": "Found potential supporting evidence",
              "supporting_evidence": [
                {
                  "source": "Systematic review and meta-analysis of the effect of moderate- to high-dose vitamin D supplementation in pregnancy on offspring bone mineralisation",
                  "url": "",
                  "summary": "Meta-analysis of three trials suggests moderate- to high-dose vitamin D supplementation in pregnancy might increase offspring BMD in early childhood."
                },
                {
                  "source": "Role of adjunctive vitamin D on bone regeneration - A systematic review",
                  "url": "",
                  "summary": "Vitamin D enhances bone defect regeneration and osseointegration. In vitro application of vitamin D to stem cells and osteoblasts enhances osteogenic differentiation."
                },
                {
                  "source": "A higher concentration of vitamin D3 during anti-PD-1 immunotherapy in advanced melanoma patients is associated with longer progression-free survival",
                  "url": "",
                  "summary": "Maintaining the vitamin D level within the normal range during anti-PD-1 immunotherapy in advanced melanoma patients may improve treatment outcomes."
                }
              ],
              "conflicting_evidence": []
            }
          ],
          "reported_benefits": [
            "Increases offspring bone mineral density in early childhood",
            "Enhances bone defect regeneration and osseointegration",
            "Enhances osteogenic differentiation of stem cells and osteoblasts",
            "Improves treatment outcomes during anti-PD-1 immunotherapy in advanced melanoma patients"
          ],
          "reported_cons": [
            "Inconsistency in methodology and findings among trials",
            "Further trials are required to confirm findings"
          ]
        },
        {
          "ingredient": "Folate",
          "claims": [
            {
              "claim": "Folate supports healthy development and growth",
              "correctness": "Found potential supporting evidence",
              "supporting_evidence": [
                {
                  "source": "Narrative review on the use of high-dose folic acid supplements in women with pre-existing diabetes",
                  "url": "",
                  "summary": "Robust evidence supports the additional use of a low-dose folic acid supplement (0.4 mg/day) in all women from 2-3 months preconception until the end of the 12th week of gestation."
                },
                {
                  "source": "Micronutrient deficiencies in long-term users of proton pump inhibitors",
                  "url": "",
                  "summary": "No significant difference in blood iron, ferritin, vitamin B12, and folate. Vitamin D deficit was observed more frequently in the PPI group (100%) than in controls (30%, p < 0.001)"
                },
                {
                  "source": "Duration and quality of sleep and risk for gestational diabetes mellitus: a prospective study",
                  "url": "",
                  "summary": "Folic acid supplementation may reduce GDM risk associated with short sleep duration."
                },
                {
                  "source": "Imbalances in the diet quality and nutrient deficiency among celiac disease patients in Lebanon",
                  "url": "",
                  "summary": "Gluten-free diets may cause certain deficiencies such as calcium and vitamin D, but adequate intake of folate and other micronutrients is possible with appropriate education and maintenance of a healthy gluten-free diet."
                },
                {
                  "source": "An analysis of micronutrient supplement intake in Collegiate and Masters Athletes",
                  "url": "",
                  "summary": "Micronutrient supplementation, including folate, is commonly consumed among athletes, indicating its importance in supporting overall health and performance."
                }
              ],
              "conflicting_evidence": []
            }
          ],
          "reported_benefits": [
            "Supports healthy development and growth",
            "Prevents neural tube defects",
            "May reduce gestational diabetes mellitus risk"
          ],
          "reported_cons": [
            "High-dose folic acid may be harmful to mothers and offspring (controversial)"
          ]
        }
      ]
    }

const ollyStressVitaminSample = {"active_ingredients": [
    {
    "ingredient": "GABA",
    "claims": [
        {
            "claim": "promotes relaxation",
            "correctness": "Found potential supporting evidence",
            "supporting_evidence": [
                {
                    "source": "Psychobiotics",
                    "url": "",
                    "summary": "Probiotic treatment with Lactobacillus helveticus R0052 and Bifidobacterium longum R0175 increased the secretion of anti-inflammatory cytokines and decreased pro-inflammatory cytokines, which may promote relaxation through the gut-brain axis."
                }
            ],
            "conflicting_evidence": []
        },
        {
            "claim": "helps combat stress",
            "correctness": "Found potential supporting evidence",
            "supporting_evidence": [
                {
                    "source": "Probiotics",
                    "url": "",
                    "summary": "TLP (a combination of Lactobacillus caseiS1, Enterococcus faeciumS4, and L. harbinensisS6) showed an increase in GABA production, a neurotransmitter linked to stress reduction."
                },
                {
                    "source": "Prebiotics",
                    "url": "",
                    "summary": "HMO (human milk oligosaccharides) treatment increased GABA levels in both children and adults, which is linked to the gut-brain axis and may help combat stress."
                }
            ],
            "conflicting_evidence": []
        }
    ],
    "reported_benefits": [
        "promotes relaxation",
        "helps combat stress",
        "reduces inflammation",
        "improves gastrointestinal activity",
        "enhances anti-anxiety homeostasis"
    ],
    "reported_cons": [
        "survival rates of some probiotic strains decrease during gastric phase"
    ]
    }]};

export { ollyStressVitaminSample, multiVitaminSample };