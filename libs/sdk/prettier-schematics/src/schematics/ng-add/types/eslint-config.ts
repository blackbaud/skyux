export interface ESLintConfig {
  extends?: string | string[];
  overrides?: [
    {
      extends?: string | string[];
    }
  ];
}
