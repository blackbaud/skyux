export interface SkyDocsCommentTags {
  codeExample: string;

  codeExampleLanguage: string;

  defaultValue: string;

  deprecationWarning: string;

  description: string;

  extras?: {
    [key: string]: any;
  };

  parameters?: {
    name: string;
    description: string;
  }[];
}
