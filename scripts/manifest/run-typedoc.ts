/* eslint-disable max-depth */

/* eslint-disable complexity */
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import {
  Application,
  ArrayType,
  Comment,
  DeclarationReflection,
  IntrinsicType,
  LiteralType,
  MappedType,
  ParameterReflection,
  ProjectReflection,
  ReferenceType,
  Reflection,
  ReflectionKind,
  ReflectionType,
  SomeType,
  TypeOperatorType,
  UnionType,
} from 'typedoc';

import { getProjects } from './get-projects';
import {
  SkyManifestClassDefinition,
  SkyManifestClassMethodDefinition,
  SkyManifestClassPropertyDefinition,
  SkyManifestDirectiveDefinition,
  SkyManifestDirectiveInputDefinition,
  SkyManifestEnumerationDefinition,
  SkyManifestEnumerationMemberDefinition,
  SkyManifestFunctionDefinition,
  SkyManifestIndexSignatureDefinition,
  SkyManifestInterfaceDefinition,
  SkyManifestInterfacePropertyDefinition,
  SkyManifestPackageSection,
  SkyManifestParameterDefinition,
  SkyManifestPipeDefinition,
  SkyManifestTypeAliasDefinition,
  SkyManifestVariableDefinition,
} from './types';

interface DeclarationReflectionWithDecorators extends DeclarationReflection {
  decorators?: { name: string; arguments?: Record<string, string> }[];
}

const pluginPath = path.join(__dirname, './typedoc-plugin.mjs');

type CodeExampleLanguage = 'markup' | 'typescript';

function getCommentMeta(comment: Comment | undefined): {
  codeExample: string;
  codeExampleLanguage: CodeExampleLanguage;
  deprecationReason: string;
  defaultValue: string;
  description: string;
  isDeprecated: boolean;
  isPreview: boolean;
  isRequired: boolean;
} {
  let codeExample = '';
  let codeExampleLanguage: CodeExampleLanguage = 'markup';
  let deprecationReason = '';
  let defaultValue = '';
  let description = '';
  let isDeprecated = false;
  let isPreview = false;
  let isRequired = false;

  if (comment) {
    if (comment.blockTags) {
      comment.blockTags.forEach((tag) => {
        switch (tag.tag) {
          case '@default':
          case '@defaultValue': {
            defaultValue = tag.content
              .map((item) => item.text)
              .join('')
              .trim();

            break;
          }

          case '@deprecated': {
            isDeprecated = true;
            deprecationReason = tag.content
              .map((item) => item.text)
              .join('')
              .trim();
            break;
          }

          case '@example': {
            codeExample = tag.content
              .map((item) => item.text)
              .join('')
              .trim()
              .split('```')[1]
              .trim();

            const exampleLanguage = codeExample.split('\n')[0];

            if (
              exampleLanguage === 'markup' ||
              exampleLanguage === 'typescript'
            ) {
              codeExample = codeExample.slice(exampleLanguage.length).trim();
              codeExampleLanguage = exampleLanguage;
            }

            break;
          }

          case '@preview':
            isPreview = true;
            break;

          case '@required':
            isRequired = true;
            break;

          default:
            break;
        }
      });
    }

    description = comment.summary
      ?.map((item) => item.text)
      .join('')
      .trim()
      .replace(/(\r\n|\n|\r)/gm, ' ');
  }

  return {
    codeExample,
    codeExampleLanguage,
    defaultValue,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
    isRequired,
  };
}

function getTypeParameters(params: SomeType[] | undefined): string {
  if (!params || params.length === 0) {
    return '';
  }

  let name = `<`;

  const typeParams: string[] = [];
  for (const param of params) {
    typeParams.push(getType(param));
  }

  if (typeParams.length === 0) {
    return '';
  }

  name += typeParams.join(', ') + '>';

  return name;
}

function getType(type: SomeType | undefined): string {
  if (type) {
    if (type instanceof IntrinsicType) {
      return type.name;
    }

    if (type instanceof LiteralType) {
      if (typeof type.value === 'string') {
        return `'${type.value}'`;
      }

      return `${type.value}`;
    }

    // Type parameters.
    if (type instanceof ReferenceType) {
      let name = type.name;

      if (type.typeArguments) {
        name += getTypeParameters(type.typeArguments);
      }

      return name;
    }

    if (type instanceof ReflectionType) {
      const typeDecl = type.declaration;

      // Closures.
      if (typeDecl.signatures) {
        const params = getParameters(typeDecl.signatures[0].parameters);
        const returnType = getType(typeDecl.signatures[0].type);

        const paramsStr = params
          .map((p) => {
            return `${p.name}${p.isOptional ? '?' : ''}: ${p.type}`;
          })
          .join(', ');

        return `(${paramsStr}) => ${returnType}`;
      }

      // Inline interfaces.
      if (typeDecl.children) {
        const props = ['{'];

        for (const child of typeDecl.children) {
          props.push(
            `${child.name}${child.flags?.isOptional ? '?' : ''}: ${getType(child.type)};`,
          );
        }

        props.push('}');

        return props.join(' ');
      }

      // Index signatures.
      if (typeDecl.indexSignatures) {
        const sigs = getIndexSignatures(typeDecl);

        return `{ ${sigs[0].name}: ${sigs[0].type}; }`;
      }
    }

    if (type instanceof ArrayType) {
      const elementType = getType(type.elementType);

      if (type.elementType instanceof ReflectionType) {
        return `(${elementType})[]`;
      }

      return `${elementType}[]`;
    }

    if (type instanceof UnionType) {
      return type.types.map((t) => getType(t)).join(' | ');
    }

    if (type instanceof TypeOperatorType) {
      if (type.target instanceof ReferenceType) {
        return `${type.operator} ${type.target.name}`;
      }
    }

    if (type instanceof MappedType) {
      // console.error('\nUnhandled MappedType!', type, type.parameterType);
      // return '______MappedType______';
      return type.parameter;
    }

    console.error(type);
    throw new Error('^^^^ UNHANDLED TYPE!');
  }

  return 'unknown';
}

function getDefaultValue(
  refl: Reflection & { defaultValue?: string },
  defaultValue?: string,
): string {
  defaultValue = (defaultValue || refl.defaultValue) ?? '';

  // TypeDoc sometimes wraps default values in code blocks.
  if (defaultValue.includes('```')) {
    defaultValue = defaultValue.split('\n')[1];
  }

  // TypeDoc version 0.20.x stopped auto-generating initializers for the default value
  // (and replaced them with "...") due to the complicated logic it required.
  // See: https://github.com/TypeStrong/typedoc/issues/1552
  if (defaultValue === '...') {
    defaultValue = '';
  }

  return defaultValue;
}

function getParameters(
  refl: ParameterReflection[] | undefined,
): SkyManifestParameterDefinition[] {
  const parameters: SkyManifestParameterDefinition[] = [];

  if (refl) {
    for (const param of refl) {
      const { defaultValue, description } = getCommentMeta(param.comment);

      parameters.push({
        defaultValue: getDefaultValue(param, defaultValue),
        description,
        isOptional: !!param.flags?.isOptional,
        name: param.name,
        type: getType(param.type),
      });
    }
  }

  return parameters;
}

function getMethods(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestClassMethodDefinition[] {
  const methods: SkyManifestClassMethodDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      if (
        child.kind === ReflectionKind.Method &&
        !child.name.startsWith('ng')
      ) {
        methods.push(getMethod(child));
      }
    }
  }

  return methods;
}

function getMethod(
  decl: DeclarationReflection,
): SkyManifestClassMethodDefinition {
  const signature = decl.signatures?.[0];

  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
  } = getCommentMeta(signature?.comment);

  const method: SkyManifestClassMethodDefinition = {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
    isStatic: !!decl.flags.isStatic,
    name: decl.name,
    parameters: getParameters(signature?.parameters),
    returnType: getType(signature?.type),
  };

  return method;
}

const STRING_DASHERIZE_REGEXP = /[ _.]/g;
const STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;

function decamelize(str: string): string {
  return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}

export function dasherize(str: string): string {
  return decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}

function getAnchorId(decl: DeclarationReflection): string {
  const letters = decl.name.match(/[a-zA-Z0-1]/g)?.join('');

  if (letters) {
    const anchorId = `${dasherize(ReflectionKind[decl.kind])}-${dasherize(letters)}`;

    return anchorId;
  }

  return `skyux_${Date.now().toString()}`;
}

function getFunction(
  decl: DeclarationReflection,
): SkyManifestFunctionDefinition {
  const signature = decl.signatures?.[0];

  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
  } = getCommentMeta(signature?.comment);

  const fn: SkyManifestFunctionDefinition = {
    anchorId: getAnchorId(decl),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
    name: decl.name,
    parameters: getParameters(signature?.parameters),
    returnType: getType(signature?.type),
  };

  return fn;
}

function getPipeTransformMethod(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestClassMethodDefinition {
  if (decl.children) {
    for (const child of decl.children) {
      if (child.kind === ReflectionKind.Method && child.name === 'transform') {
        return getMethod(child);
      }
    }
  }

  throw new Error(`Failed to find transform method for pipe: ${decl.name}`);
}

function getInput(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestDirectiveInputDefinition | undefined {
  const property = getProperty(decl);

  if (property) {
    const { isRequired } = getCommentMeta(
      decl.comment ?? decl.getSignature?.comment ?? decl.setSignature?.comment,
    );

    const input: SkyManifestDirectiveInputDefinition = {
      ...property,
      isRequired,
    };

    return input;
  }
}

function getProperty(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestClassPropertyDefinition | undefined {
  if (decl.kind === ReflectionKind.Accessor) {
    const {
      codeExample,
      codeExampleLanguage,
      defaultValue,
      deprecationReason,
      description,
      isDeprecated,
      isPreview,
    } = getCommentMeta(
      decl.getSignature?.comment ?? decl.setSignature?.comment,
    );

    const property: SkyManifestClassPropertyDefinition = {
      codeExample,
      codeExampleLanguage,
      deprecationReason,
      description,
      defaultValue: getDefaultValue(decl, defaultValue),
      isDeprecated,
      isPreview,
      name: decl.name,
      type: getType(decl.getSignature?.type),
    };

    return property;
  }

  if (decl.kind === ReflectionKind.Property) {
    const {
      codeExample,
      codeExampleLanguage,
      defaultValue,
      deprecationReason,
      description,
      isDeprecated,
      isPreview,
    } = getCommentMeta(decl.comment);

    const property: SkyManifestClassPropertyDefinition = {
      codeExample,
      codeExampleLanguage,
      deprecationReason,
      description,
      defaultValue: getDefaultValue(decl, defaultValue),
      isDeprecated,
      isPreview,
      name: decl.name,
      type: getType(decl.type),
    };

    return property;
  }
}

function getProperties(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestClassPropertyDefinition[] {
  const properties: SkyManifestClassPropertyDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      if (isInput(child) || isOutput(child)) {
        continue;
      }

      const property = getProperty(child);
      if (property) {
        properties.push(property);
      }
    }
  }

  return properties;
}

function getIndexSignatures(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestIndexSignatureDefinition[] {
  const formatted: SkyManifestIndexSignatureDefinition[] = [];

  if (decl.indexSignatures) {
    for (const signature of decl.indexSignatures) {
      const param = signature.parameters?.[0];

      if (param) {
        const {
          codeExample,
          codeExampleLanguage,
          deprecationReason,
          description,
          isDeprecated,
          isPreview,
        } = getCommentMeta(signature.comment);

        formatted.push({
          codeExample,
          codeExampleLanguage,
          deprecationReason,
          description,
          isDeprecated,
          isPreview,
          name: `[${param.name}: ${getType(param.type)}]`,
          type: getType(signature.type),
          parameters: getParameters(signature.parameters),
        });
      }
    }
  }

  return formatted;
}

function getInterfaceProperties(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestInterfacePropertyDefinition[] {
  const properties: SkyManifestInterfacePropertyDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      const {
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isPreview,
        isRequired,
      } = getCommentMeta(child.comment);

      properties.push({
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isOptional: !isRequired && !!child.flags?.isOptional,
        isPreview,
        name: child.name,
        type: getType(child.type),
      });
    }
  }

  return properties;
}

function isInput(decl: DeclarationReflectionWithDecorators): boolean {
  return (
    getDecorator(decl) === 'Input' ||
    (decl.type instanceof ReferenceType && decl.type?.name === 'InputSignal')
  );
}

function isOutput(decl: DeclarationReflectionWithDecorators): boolean {
  return (
    getDecorator(decl) === 'Output' ||
    (decl.type instanceof ReferenceType &&
      decl.type?.name === 'OutputEmitterRef')
  );
}

function getInputs(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestDirectiveInputDefinition[] {
  const inputs: SkyManifestDirectiveInputDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      if (isInput(child)) {
        const input = getInput(child);

        if (input) {
          inputs.push(input);
        }
      }
    }
  }

  return inputs;
}

function getOutputs(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestClassPropertyDefinition[] {
  const outputs: SkyManifestClassPropertyDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      if (isOutput(child)) {
        const output = getProperty(child);

        if (output) {
          outputs.push(output);
        }
      }
    }
  }

  return outputs;
}

function getEnumMembers(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestEnumerationMemberDefinition[] {
  const members: SkyManifestEnumerationMemberDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      const {
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isPreview,
      } = getCommentMeta(child.comment);

      members.push({
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isPreview,
        name: child.name,
        type: getType(child.type),
      });
    }
  }

  return members;
}

function getDecorator(
  decl: DeclarationReflectionWithDecorators,
): string | undefined {
  return decl.decorators?.[0]?.name;
}

function getSelector(
  decl: DeclarationReflectionWithDecorators,
): string | undefined {
  return decl.decorators?.[0]?.arguments?.['selector'];
}

function getDirectiveName(decl: DeclarationReflectionWithDecorators): string {
  if (decl.name.startsWith('λ')) {
    return decl.escapedName as string;
  }

  return decl.name;
}

type PackagesMap = Map<string, PackageSectionsMap>;
type PackageSectionsMap = Map<string, SkyManifestPackageSection>;

async function getTypeDocProjectReflection(
  entryPoints: string[],
  projectRoot: string,
): Promise<ProjectReflection> {
  const app = await Application.bootstrapWithPlugins({
    entryPoints,
    emit: 'docs',
    excludeExternals: true,
    excludeInternal: true,
    excludePrivate: true,
    excludeProtected: true,
    logLevel: 'Error',
    plugin: [pluginPath],
    tsconfig: `${projectRoot}/tsconfig.lib.prod.json`,
    exclude: [
      `!**/${projectRoot}/**`,
      '**/(fixtures|node_modules)/**',
      '**/*+(.fixture|.spec).ts',
    ],
    externalPattern: [`!**/${projectRoot}/**`],
  });

  const projectRefl = await app.convert();

  if (!projectRefl) {
    throw new Error(
      `Failed to create TypeDoc project reflection for '${projectRoot}'.`,
    );
  }

  return projectRefl;
}

/**
 * Gets the section name from the file path.
 */
function getPackageSectionName(filePath: string): string {
  return filePath.split('/src/lib/modules/')[1]?.split('/')[0] ?? 'root';
}

/**
 * If multiple entry points are provided, TypeDoc creates an array of project
 * reflections. If it's just one, TypeDoc skips the array, and exports the
 * children as one object. This function always returns an array.
 */
function getEntryPointReflections({
  entryPoints,
  packageName,
  projectRefl,
}: {
  entryPoints: string[];
  packageName: string;
  projectRefl: ProjectReflection;
}): { entryName: string; children?: DeclarationReflectionWithDecorators[] }[] {
  const reflections: {
    entryName: string;
    children?: DeclarationReflectionWithDecorators[];
  }[] = [];

  const hasTestingEntryPoint = fs.existsSync(path.normalize(entryPoints[1]));

  if (hasTestingEntryPoint) {
    reflections.push(
      {
        entryName: packageName,
        children: projectRefl.children?.[0].children,
      },
      {
        entryName: `${packageName}/testing`,
        children: projectRefl.children?.[1].children,
      },
    );
  } else {
    reflections.push({
      entryName: packageName,
      children: projectRefl.children,
    });
  }

  return reflections;
}

function toObject(map: Map<string, unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {};

  for (const [key, value] of map.entries()) {
    if (value instanceof Map) {
      obj[key] = toObject(value);
    } else {
      obj[key] = value;
    }
  }

  return obj;
}

function sortMapByKey<T = unknown>(value: Map<string, T>): Map<string, T> {
  return new Map([...value.entries()].sort());
}

async function writeJsonFiles(packagesMap: PackagesMap): Promise<void> {
  await fsPromises.writeFile(
    `manifests/public-api.json`,
    JSON.stringify(toObject(sortMapByKey(packagesMap)), undefined, 2),
  );
}

async function runTypeDoc(): Promise<void> {
  const nxProjects = await getProjects();

  if (fs.existsSync('manifests')) {
    await fsPromises.rm('manifests', { recursive: true });
  }

  await fsPromises.mkdir('manifests');

  const packagesMap: PackagesMap = new Map<string, PackageSectionsMap>();

  for (const {
    entryPoints,
    packageName,
    projectName,
    projectRoot,
  } of nxProjects) {
    const projectRefl = await getTypeDocProjectReflection(
      entryPoints,
      projectRoot,
    );

    console.log(`Creating manifest for ${projectName}...`);

    const entryPointReflections = getEntryPointReflections({
      entryPoints,
      packageName,
      projectRefl,
    });

    for (const refl of entryPointReflections) {
      if (refl.children) {
        const sectionsMap: PackageSectionsMap =
          packagesMap.get(refl.entryName) ??
          new Map<string, SkyManifestPackageSection>();

        for (const child of refl.children) {
          const filePath = child.sources?.[0].fullFileName;

          if (!filePath || filePath.endsWith('/index.ts')) {
            continue;
          }

          const section: SkyManifestPackageSection = {
            classes: [],
            components: [],
            directives: [],
            enumerations: [],
            functions: [],
            interfaces: [],
            modules: [],
            pipes: [],
            services: [],
            typeAliases: [],
            variables: [],
          };

          const {
            codeExample,
            codeExampleLanguage,
            deprecationReason,
            description,
            isDeprecated,
            isPreview,
          } = getCommentMeta(child.comment);

          switch (child.kind) {
            case ReflectionKind.Class: {
              const decoratorName = getDecorator(child);

              switch (decoratorName) {
                case 'Injectable': {
                  const svc: SkyManifestClassDefinition = {
                    anchorId: getAnchorId(child),
                    codeExample,
                    codeExampleLanguage,
                    deprecationReason,
                    description,
                    isDeprecated,
                    isPreview,
                    methods: getMethods(child),
                    name: child.name,
                    properties: getProperties(child),
                  };

                  section.services.push(svc);
                  break;
                }

                case 'Component':
                case 'Directive': {
                  const directive: SkyManifestDirectiveDefinition = {
                    anchorId: getAnchorId(child),
                    codeExample,
                    codeExampleLanguage,
                    deprecationReason,
                    description,
                    isDeprecated,
                    isPreview,
                    name: getDirectiveName(child),
                    selector: getSelector(child) ?? '',
                    inputs: getInputs(child),
                    outputs: getOutputs(child),
                  };

                  section.directives.push(directive);
                  break;
                }

                case 'NgModule': {
                  const module: SkyManifestClassDefinition = {
                    anchorId: getAnchorId(child),
                    codeExample,
                    codeExampleLanguage,
                    deprecationReason,
                    description,
                    isDeprecated,
                    isPreview,
                    methods: getMethods(child),
                    name: child.name,
                    properties: getProperties(child),
                  };

                  section.modules.push(module);
                  break;
                }

                case 'Pipe': {
                  const pipe: SkyManifestPipeDefinition = {
                    anchorId: getAnchorId(child),
                    codeExample,
                    codeExampleLanguage,
                    deprecationReason,
                    description,
                    isDeprecated,
                    isPreview,
                    name: child.name,
                    transformMethod: getPipeTransformMethod(child),
                  };

                  section.pipes.push(pipe);
                  break;
                }

                default: {
                  const cls: SkyManifestClassDefinition = {
                    anchorId: getAnchorId(child),
                    codeExample,
                    codeExampleLanguage,
                    deprecationReason,
                    description,
                    isDeprecated,
                    isPreview,
                    methods: getMethods(child),
                    name: child.name,
                    properties: getProperties(child),
                  };

                  section.classes.push(cls);
                  break;
                }
              }

              break;
            }

            case ReflectionKind.TypeAlias: {
              const alias: SkyManifestTypeAliasDefinition = {
                anchorId: getAnchorId(child),
                codeExample,
                codeExampleLanguage,
                deprecationReason,
                description,
                isDeprecated,
                isPreview,
                name: child.name,
                type: getType(child.type),
              };

              section.typeAliases.push(alias);
              break;
            }

            case ReflectionKind.Enum: {
              const enumeration: SkyManifestEnumerationDefinition = {
                anchorId: getAnchorId(child),
                codeExample,
                codeExampleLanguage,
                deprecationReason,
                description,
                isDeprecated,
                isPreview,
                members: getEnumMembers(child),
                name: child.name,
              };

              section.enumerations.push(enumeration);
              break;
            }

            case ReflectionKind.Function: {
              const func = getFunction(child);

              section.functions.push(func);
              break;
            }

            case ReflectionKind.Interface: {
              const def: SkyManifestInterfaceDefinition = {
                anchorId: getAnchorId(child),
                codeExample,
                codeExampleLanguage,
                deprecationReason,
                description,
                indexSignatures: getIndexSignatures(child),
                isDeprecated,
                isPreview,
                name: child.name,
                properties: getInterfaceProperties(child),
              };

              section.interfaces.push(def);
              break;
            }

            case ReflectionKind.Variable: {
              const def: SkyManifestVariableDefinition = {
                anchorId: getAnchorId(child),
                codeExample,
                codeExampleLanguage,
                deprecationReason,
                description,
                isDeprecated,
                isPreview,
                name: child.name,
                type: getType(child.type),
              };

              section.variables.push(def);
              break;
            }

            default: {
              console.error(child);
              throw new Error(`Unhandled type encountered.`);
            }
          }

          const sectionName = getPackageSectionName(filePath);
          sectionsMap.set(sectionName, section);
        }

        packagesMap.set(refl.entryName, sortMapByKey(sectionsMap));
      }
    }
  }

  await writeJsonFiles(packagesMap);
}

runTypeDoc();

/**
 * TODO:
 * - Uniform structure to testing directory.
 * - Where to put JSON files, and where to put the generator?
 * - Unit tests.
 * - Simplify shape? Allow undefined values?
 * 1. Run typedoc to determine the public API.  @skyux/metadata/public-api.json
 * 2. Filter deprecated items.                  @skyux/metadata/deprecated.json
 * 3. Filter template items.                    @skyux/metadata/template-features.json
 */
