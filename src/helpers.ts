function preprocessInput(input: string): string {
    const targetSnippet = "See questions and answers";
    return input.split(targetSnippet)[0];
  }

export { preprocessInput };