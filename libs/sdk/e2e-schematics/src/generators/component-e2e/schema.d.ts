import { AngularApplicationOptionsSchema } from '@angular/cli/lib/config/workspace-schema';

export interface Schema {
  name: string;
  tags?: string;
}

export interface NormalizedSchema
  extends Schema,
    AngularApplicationOptionsSchema {
  storybookAppName: string;
  tags: string;
  parsedTags: string[];
}
