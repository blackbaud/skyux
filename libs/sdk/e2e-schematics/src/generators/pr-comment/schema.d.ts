export interface PrCommentGeneratorSchema {
  pr: string;
  storybooks: string;
  apps?: string;
  repository?: string;
}

export interface PrCommentGeneratorOptions {
  pr: string;
  prNumber: number;
  storybooks: string[];
  apps: string[];
  repository: string;
}
