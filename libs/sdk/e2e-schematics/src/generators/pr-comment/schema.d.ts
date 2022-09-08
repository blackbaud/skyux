export interface PrCommentGeneratorSchema {
  pr: string;
  storybooks: string;
  apps?: string;
  baseUrl?: string;
}

export interface PrCommentGeneratorOptions {
  pr: string;
  storybooks: string[];
  apps: string[];
  baseUrl: string;
}
