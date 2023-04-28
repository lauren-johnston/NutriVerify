# NutriVerify
Fact check information about supplements

## How to run this repo

1. Clone the repo locally

2. Start the backend server
```
npm start
```

Navigate to localhost:3000/

3. Run the chrome extension

- Go to chrome://extensions
- Toggle "Developer mode" on
- Select load unpacked and open the extension folder from your local copy of this repo
- See your extension now running from the browser toolbar 

## Next Steps
[ ] Handle outstanding TODOs
[ ] Add more robust error handling
[ ] Add tests for API and Chrome extension
[ ] Convert Chrome extension to React to better handle state management, UI component organization

## Project System Design
### Problem Statement
The value of the global supplement industry is over 159 billion USD. Finding reputable information about supplements, meanwhile, is difficult and time-consuming. What if you could see fact-checked supplement info without leaving an online shopping web page?

With this question in mind, we propose creating a tool that solves for the following requirements:

#### Functional requirements:
- Users can view an overall confidence score based on:
  - Claim correctness by ingredient
  - Found potential supporting evidence
  - Found potential conflicting evidence
  - Unable to assess claim correctness

- Users can use the tool without copying any information from the online shopping page
- Users can view the sources used to generate the confidence score and the claims that were matched against them
- Users can input an OpenAI API key in order to generate GPT4

#### Non-functional requirements:
- Low latency: users need to get results quickly
- Reliability: the system should not give unexpected errors to give the best user experience
- Availability: the system should be highly available to give the best user experience
- Consistency: the system should provide consistent feedback about a given supplement provided the model is shown the same context window

### Proposed Design (MVP)
Given the desire to provide easily accessible supplement information, a Chrome extension is the best way to provide this tool.

The flow is:
1. User goes to Chrome extension store and downloads extension
2. User inputs OpenAI API key with GPT4 access
3. User navigates to online shopping page for a supplement e.g. Amazon.com: Nature's Bounty Hair, Skin & Nails Rapid Release Softgels
4. Chrome extension reads the information on the page and sends it to a server running on localhost:3000

#### Server
- Decides whether or not information is pertaining to a supplement
- If yes, pulls supplement name and ingredients
- GPT4 determines what information constitutes “supplement claims”
- Sends supplement name and claims to GPT4
- Use axios to connect to external API for research articles
- Retrieves:
  - A claim-by-claim analysis of accuracy
  - A general safety review
  - [P2] A review of manufacturing claims
  - [Optional] Stores retrieved info in DB
- Returns retrieved to UI
- UI displays confidence score

### Alternatives Considered
- Standalone webapp with no Chrome extension -> Did not go this route as it would introduce friction into users getting the information they need
- 
### Out of Scope
- Page cache
- Supporting languages other than English
- Validating supplement facts in images and/or videos
- In-line validations (include if have time)
- User rating of response quality
- User feedback submission
- Monitoring and logging
- Support for GPT3

