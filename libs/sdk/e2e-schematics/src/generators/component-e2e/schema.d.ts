export interface Schema {
  name: string;
  tags?: string;
  ansiColor?: boolean;
  skipFormat?: boolean;
}

export interface NormalizedSchema {
  name: string;
  storybookAppName: string;
  parsedTags: string[];
  tags?: string;
  ansiColor: boolean;
  skipFormat?: boolean;
}
