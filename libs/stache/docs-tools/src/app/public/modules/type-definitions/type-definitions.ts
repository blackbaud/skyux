export interface SkyDocsPropertyDefinition {
  name: string;
  type: string;
  description: string;
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
  name: string;
  selector: string;
  description: string;
  properties: SkyDocsDirectivePropertyDefinition[];
  codeExample?: string;
  codeExampleLanguage?: string;
}

export interface SkyDocsInterfaceDefinition {
  name: string;
  properties: SkyDocsInterfacePropertyDefinition[];
  sourceCode: string;
  description?: string;
}

export interface SkyDocsEnumerationDefinition {
  name: string;
  description?: string;
  members: {
    name: string;
    description?: string;
  }[];
}

export interface SkyDocsServiceDefinition {
  name: string;
  description: string;
  methods: SkyDocsMethodDefinition[];
  properties: SkyDocsPropertyDefinition[];
}

export interface SkyDocsTypeAliasDefinition {
  name: string;
  sourceCode: string;
  description: string;
  parameters: SkyDocsParameterDefinition[];
}

export interface SkyDocsPipeDefinition {
  codeExample: string;
  codeExampleLanguage: string;
  description: string;
  inputValue: {
    description: string;
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
