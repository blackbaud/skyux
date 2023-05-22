export interface EsLintConfig {
  extends?: string | string[];
  parser?: string;
  parserOptions?: {
    project: string[];
    tsconfigRootDir: string;
  };
  overrides?: [
    {
      extends?: string | string[];
      files: string[];
    }
  ];
}
