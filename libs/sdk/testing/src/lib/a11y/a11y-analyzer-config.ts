export interface SkyA11yAnalyzerConfig {
  rules: Record<
    string,
    {
      enabled: boolean;
    }
  >;
}
