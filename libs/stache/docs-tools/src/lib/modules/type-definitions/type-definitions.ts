import { SkyDocsClassDefinition } from './class-definition';

import { SkyDocsDirectiveDefinition } from './directive-definition';

import { SkyDocsEnumerationDefinition } from './enumeration-definition';

import { SkyDocsInterfaceDefinition } from './interface-definition';

import { SkyDocsPipeDefinition } from './pipe-definition';

import { SkyDocsTypeAliasDefinition } from './type-alias-definition';

/**
 * @internal
 */
export interface SkyDocsTypeDefinitions {
  classes: SkyDocsClassDefinition[];

  components: SkyDocsDirectiveDefinition[];

  directives: SkyDocsDirectiveDefinition[];

  enumerations: SkyDocsEnumerationDefinition[];

  interfaces: SkyDocsInterfaceDefinition[];

  pipes: SkyDocsPipeDefinition[];

  services: SkyDocsClassDefinition[];

  typeAliases: SkyDocsTypeAliasDefinition[];
}
