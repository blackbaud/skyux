export interface SkyA11yAnalyzerConfig {
  skyTheme: 'default' | 'modern';
  rules: {
    [key: string]: {
      enabled: boolean;
    };
  };
}
