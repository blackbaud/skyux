export interface EsLintConfig {
  extends?: string | string[];
  overrides?: [
    {
      extends?: string | string[];
      files: string[];
      parser?: string;
      parserOptions?: {
        project: string[];
        tsconfigRootDir: string;
      };
    },
  ];
}
