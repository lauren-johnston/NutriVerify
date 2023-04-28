import { ActiveIngredient } from "./interfaces";

function preprocessInput(input: string): string {
    const targetSnippet = "See questions and answers";
    return input.split(targetSnippet)[0];
  }

function parseOriginalData(data: string | undefined): ActiveIngredient | {} {
if (!data) return {};
const parsedData = data
    .replace(/'/g, '"')
    .replace(/\\n/g, '')
    .replace(/\+ /g, '');

return JSON.parse(parsedData);
}
export { preprocessInput, parseOriginalData };