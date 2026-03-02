import { AngularApplicationOptionsSchema } from '@angular/cli/lib/config/workspace-schema';

export interface Schema {
  name: string;
  tags?: string;
  ansiColor?: boolean;
  includeTests?: boolean;
  skipFormat?: boolean;
}

export interface NormalizedSchema
  extends Schema, AngularApplicationOptionsSchema {
  storybookAppName: string;
  tags: string;
  parsedTags: string[];
}
