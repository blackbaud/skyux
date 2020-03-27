export interface SkyDocsEnumerationDefinition {

  name: string;

  members: {
    name: string;
    description?: string;
  }[];

  anchorId?: string;

  description?: string;
}
