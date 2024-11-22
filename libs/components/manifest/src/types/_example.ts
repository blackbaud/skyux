import {
  SkyManifestClassDefinition,
  SkyManifestClassMethodDefinition,
  SkyManifestClassPropertyDefinition,
} from './class-def';
import {
  SkyManifestDirectiveDefinition,
  SkyManifestDirectiveInputDefinition,
  SkyManifestDirectiveOutputDefinition,
} from './directive-def';
import {
  SkyManifestEnumerationDefinition,
  SkyManifestEnumerationMemberDefinition,
} from './enumeration-def';
import {
  SkyManifestFunctionDefinition,
  SkyManifestParameterDefinition,
} from './function-def';
import { SkyManifestInterfaceDefinition } from './interface-def';
import { SkyManifestPublicApi } from './manifest';
import { SkyManifestPipeDefinition } from './pipe-def';
import { SkyManifestTypeAliasDefinition } from './type-alias-def';
import { SkyManifestVariableDefinition } from './variable-def';

const classProperty: SkyManifestClassPropertyDefinition = {
  codeExample: '',
  codeExampleLanguage: 'typescript',
  defaultValue: 'baz',
  deprecationReason: '',
  description: 'This is a description.',
  isDeprecated: false,
  isPreview: false,
  kind: 'class-property',
  name: 'bar',
  type: 'string',
};

const classMethod: SkyManifestClassMethodDefinition = {
  codeExample: '',
  codeExampleLanguage: 'typescript',
  deprecationReason: '',
  description: 'This is a description.',
  isDeprecated: false,
  isPreview: false,
  isStatic: false,
  kind: 'class-method',
  name: 'doSomething',
  parameters: [
    {
      defaultValue: '',
      description: '',
      isOptional: false,
      name: 'foo',
      type: 'string',
    },
  ],
  type: 'void',
};

const fooClass: SkyManifestClassDefinition = {
  anchorId: 'sky-foo',
  children: [classProperty, classMethod],
  codeExample: '',
  codeExampleLanguage: 'typescript',
  deprecationReason: '',
  description: 'This is a description.',
  filePath: 'libs/foobar/src/lib/foo.ts',
  isDeprecated: false,
  isInternal: false,
  isPreview: false,
  kind: 'class',
  name: 'SkyFoo',
};

const directiveInput: SkyManifestDirectiveInputDefinition = {
  codeExample: '',
  codeExampleLanguage: 'typescript',
  defaultValue: 'baz',
  deprecationReason: '',
  description: 'This is a description.',
  isDeprecated: false,
  isPreview: false,
  isRequired: false,
  kind: 'directive-input',
  name: 'bar',
  type: 'string',
};

const directiveOutput: SkyManifestDirectiveOutputDefinition = {
  codeExample: '',
  codeExampleLanguage: 'typescript',
  deprecationReason: '',
  description: 'This is a description.',
  isDeprecated: false,
  isPreview: false,
  kind: 'directive-output',
  name: 'barChange',
  type: 'EventEmitter<string>',
};

const directive: SkyManifestDirectiveDefinition = {
  anchorId: 'sky-foo',
  children: [directiveInput, directiveOutput],
  codeExample: '',
  codeExampleLanguage: 'typescript',
  deprecationReason: '',
  description: 'This is a description.',
  filePath: 'libs/foobar/src/lib/foo.ts',
  isDeprecated: false,
  isInternal: false,
  isPreview: false,
  kind: 'directive',
  name: 'SkyFoo',
  selector: '[skyFoo]',
};

const enumMember: SkyManifestEnumerationMemberDefinition = {
  codeExample: '',
  codeExampleLanguage: 'typescript',
  deprecationReason: '',
  description: 'This is a description.',
  isDeprecated: false,
  isPreview: false,
  name: 'bar',
  kind: 'enum-member',
  type: '0',
};

const enumeration: SkyManifestEnumerationDefinition = {
  anchorId: 'sky-foo',
  codeExample: '',
  codeExampleLanguage: 'typescript',
  deprecationReason: '',
  description: 'This is a description.',
  filePath: 'libs/foobar/src/lib/foo.ts',
  isDeprecated: false,
  isInternal: false,
  isPreview: false,
  kind: 'enumeration',
  name: 'SkyFoo',
  children: [enumMember],
};

const fun: SkyManifestFunctionDefinition = {
  anchorId: 'sky-foo',
  codeExample: '',
  codeExampleLanguage: 'typescript',
  deprecationReason: '',
  description: 'This is a description.',
  filePath: 'libs/foobar/src/lib/foo.ts',
  isDeprecated: false,
  isInternal: false,
  isPreview: false,
  kind: 'function',
  name: 'skyFoo',
  parameters: [
    {
      defaultValue: '',
      description: '',
      isOptional: false,
      name: 'foo',
      type: 'string',
    } satisfies SkyManifestParameterDefinition,
  ],
  type: 'void',
};

const int: SkyManifestInterfaceDefinition = {
  anchorId: 'sky-foo',
  codeExample: '',
  codeExampleLanguage: 'typescript',
  deprecationReason: '',
  description: 'This is a description.',
  filePath: 'libs/foobar/src/lib/foo.ts',
  isDeprecated: false,
  isInternal: false,
  isPreview: false,
  kind: 'interface',
  name: 'SkyFoo',
  children: [
    {
      codeExample: '',
      codeExampleLanguage: 'typescript',
      deprecationReason: '',
      description: 'This is a description.',
      isDeprecated: false,
      isPreview: false,
      isOptional: false,
      kind: 'interface-property',
      name: 'bar',
      type: 'string',
    },
  ],
};

const pipe: SkyManifestPipeDefinition = {
  anchorId: 'sky-foo',
  codeExample: '',
  codeExampleLanguage: 'typescript',
  deprecationReason: '',
  description: 'This is a description.',
  filePath: 'libs/foobar/src/lib/foo.ts',
  isDeprecated: false,
  isInternal: false,
  isPreview: false,
  kind: 'pipe',
  name: 'SkyFoo',
  templateBindingName: 'foo',
  children: [classMethod],
};

const typeAlias: SkyManifestTypeAliasDefinition = {
  anchorId: 'sky-foo',
  codeExample: '',
  codeExampleLanguage: 'typescript',
  deprecationReason: '',
  description: 'This is a description.',
  filePath: 'libs/foobar/src/lib/foo.ts',
  isDeprecated: false,
  isInternal: false,
  isPreview: false,
  kind: 'type-alias',
  name: 'SkyFoo',
  type: 'string',
};

const variable: SkyManifestVariableDefinition = {
  anchorId: 'sky-foo',
  codeExample: '',
  codeExampleLanguage: 'typescript',
  deprecationReason: '',
  description: 'This is a description.',
  filePath: 'libs/foobar/src/lib/foo.ts',
  isDeprecated: false,
  isInternal: false,
  isPreview: false,
  kind: 'variable',
  name: 'skyFoo',
  type: 'string',
};

export const publicApi: SkyManifestPublicApi = {
  packages: {
    '@skyux/foobar': [
      fooClass,
      directive,
      enumeration,
      fun,
      int,
      pipe,
      typeAlias,
      variable,
    ],
  },
};
