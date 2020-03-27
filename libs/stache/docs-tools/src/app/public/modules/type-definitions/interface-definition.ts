import {
  SkyDocsInterfacePropertyDefinition
} from './interface-property-definition';

export interface SkyDocsInterfaceDefinition {

  name: string;

  properties: SkyDocsInterfacePropertyDefinition[];

  anchorId?: string;

  description?: string;

  typeParameters?: string[];

}
