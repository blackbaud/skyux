/**
 * Describes all entry-level types such as classes, directives, enumerations, etc.
 * @internal
 */
export interface SkyDocsEntryDefinition {

  anchorId: string;

  codeExample?: string;

  codeExampleLanguage?: string;

  deprecationWarning?: string;

  description?: string;

  name: string;

}
