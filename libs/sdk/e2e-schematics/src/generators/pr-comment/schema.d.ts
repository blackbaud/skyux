export interface PrCommentGeneratorSchema {
  url: string;
  repoUrl: string;
  pr: string | number;
  storybooks: string;
  skipCompositeStorybook?: boolean;
  apps?: string;
}

export interface PrCommentGeneratorOptions {
  url: string;
  repoUrl: string;
  pr: string;
  prNumber: number;
  storybooks: string[];
  skipCompositeStorybook: boolean;
  apps: string[];
}
