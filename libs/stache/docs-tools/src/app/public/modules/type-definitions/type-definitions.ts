import {
  TemplateRef
} from '@angular/core';

export interface SkyDocsPropertyDefinition {
  name: string;
  type: string;
  decorator?: 'Input' | 'Output';
  defaultValue?: string;
  deprecationWarning?: string;
  description?: string;
  isOptional?: boolean;
  templateRef?: TemplateRef<any>;
}

export interface SkyDocsDirectivePropertyDefinition extends SkyDocsPropertyDefinition {
  decorator: 'Input' | 'Output';
  defaultValue: string;
  deprecationWarning: string;
  isOptional: boolean;
}

export interface SkyDocsInterfacePropertyDefinition extends SkyDocsPropertyDefinition {
  isOptional: boolean;
}

export interface SkyDocsParameterDefinition extends SkyDocsPropertyDefinition {
  defaultValue: string;
  isOptional: boolean;
}

export interface SkyDocsMethodDefinition {
  deprecationWarning: string;
  name: string;
  returnType: string;
  codeExample: string;
  codeExampleLanguage: string;
  description: string;
  parameters: SkyDocsParameterDefinition[];
}

export interface SkyDocsDirectiveDefinition {
  anchorId: string;
  name: string;
  selector: string;
  description: string;
  properties: SkyDocsDirectivePropertyDefinition[];
  codeExample?: string;
  codeExampleLanguage?: string;
}

export interface SkyDocsInterfaceDefinition {
  anchorId: string;
  name: string;
  properties: SkyDocsInterfacePropertyDefinition[];
  sourceCode: string;
  description?: string;
}

export interface SkyDocsEnumerationDefinition {
  anchorId: string;
  name: string;
  description?: string;
  members: {
    name: string;
    description?: string;
  }[];
}

export interface SkyDocsServiceDefinition {
  anchorId: string;
  name: string;
  description: string;
  methods: SkyDocsMethodDefinition[];
  properties: SkyDocsPropertyDefinition[];
}

export interface SkyDocsTypeAliasDefinition {
  anchorId: string;
  name: string;
  sourceCode: string;
  description: string;
  parameters?: SkyDocsParameterDefinition[];
  returnType?: string;
}

export interface SkyDocsPipeDefinition {
  anchorId: string;
  codeExample: string;
  codeExampleLanguage: string;
  description: string;
  inputValue: {
    description: string;
    name: string;
    type: string;
  };
  name: string;
  parameters: SkyDocsParameterDefinition[];
}

export interface SkyDocsTypeDefinitions {
  components: SkyDocsDirectiveDefinition[];
  directives: SkyDocsDirectiveDefinition[];
  enumerations: SkyDocsEnumerationDefinition[];
  interfaces: SkyDocsInterfaceDefinition[];
  pipes: SkyDocsPipeDefinition[];
  services: SkyDocsServiceDefinition[];
  typeAliases: SkyDocsTypeAliasDefinition[];
}
