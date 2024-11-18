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
  SkyManifestClassPropertyDefinition,
  SkyManifestDirectiveDefinition,
  SkyManifestDirectiveInputDefinition,
  SkyManifestEnumerationDefinition,
  SkyManifestEnumerationMemberDefinition,
  SkyManifestFunctionOrMethodDefinition,
  SkyManifestIndexSignatureDefinition,
  SkyManifestInterfaceDefinition,
  SkyManifestInterfacePropertyDefinition,
  SkyManifestPackage,
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

  // let parameters: {
  //   name: string;
  //   description: string;
  // }[] = [];

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

          // case '@param': {
          //   parameters = parameters || [];
          //   parameters.push({
          //     name: tag.param,
          //     description: tag.content
          //       .map((item) => item.text)
          //       .join('')
          //       .trim(),
          //   });
          //   break;
          // }

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
      // Closures.
      if (type.declaration.signatures) {
        const params = getParameters(type.declaration.signatures[0].parameters);
        const returnType = getType(type.declaration.signatures[0].type);
        console.log('eh?', type);
        const paramsStr = params
          .map((p) => {
            return `${p.name}${p.isOptional ? '?' : ''}: ${p.type}`;
          })
          .join(', ');

        return `(${paramsStr}) => ${returnType}`;
      }

      // Inline interfaces.
      if (type.declaration.children) {
        const props = ['{'];
        for (const child of type.declaration.children) {
          props.push(
            `${child.name}${child.flags?.isOptional ? '?' : ''}: ${getType(child.type)};`,
          );
        }
        props.push('}');
        return props.join(' ');
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
): SkyManifestFunctionOrMethodDefinition[] {
  const methods: SkyManifestFunctionOrMethodDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      if (
        child.kind === ReflectionKind.Method &&
        !child.name.startsWith('ng')
      ) {
        methods.push(getFunctionOrMethod(child));
      }
    }
  }

  return methods;
}

function getFunctionOrMethod(
  decl: DeclarationReflection,
): SkyManifestFunctionOrMethodDefinition {
  const signature = decl.signatures?.[0];

  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
  } = getCommentMeta(signature?.comment);

  const method: SkyManifestFunctionOrMethodDefinition = {
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

  return method;
}

function getPipeTransformMethod(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestFunctionOrMethodDefinition {
  if (decl.children) {
    for (const child of decl.children) {
      if (child.kind === ReflectionKind.Method && child.name === 'transform') {
        return getFunctionOrMethod(child);
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

async function runTypeDoc(): Promise<void> {
  const nxProjects = await getProjects();

  if (fs.existsSync('manifests')) {
    await fsPromises.rm('manifests', { recursive: true });
  }

  await fsPromises.mkdir('manifests');

  const packages = new Map<string, SkyManifestPackage>();

  for (const {
    entryPoints,
    packageName,
    projectName,
    projectRoot,
  } of nxProjects) {
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

    if (projectRefl) {
      console.log(`Creating manifest for ${projectName}...`);

      const hasTestingEntryPoint = fs.existsSync(
        path.normalize(entryPoints[1]),
      );

      let children: DeclarationReflectionWithDecorators[] | undefined;

      if (hasTestingEntryPoint) {
        children = projectRefl.children?.[0].children;
      } else {
        children = projectRefl.children;
      }

      // const testingEntry = project.children?.[1];

      if (children) {
        for (const child of children) {
          const fileName = child.sources?.[0].fullFileName;

          if (fileName && !fileName.endsWith('/index.ts')) {
            // Derive the group name from its directory.
            const groupName =
              fileName
                .split(`${projectName}/src/lib/modules/`)[1]
                ?.split('/')[0] ?? 'root';

            const pack =
              packages.get(`${packageName}:${groupName}`) ??
              ({
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
              } satisfies SkyManifestPackage);

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

                    pack.services.push(svc);
                    break;
                  }

                  case 'Component':
                  case 'Directive': {
                    const directive: SkyManifestDirectiveDefinition = {
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

                    pack.directives.push(directive);
                    break;
                  }

                  case 'NgModule': {
                    const module: SkyManifestClassDefinition = {
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

                    pack.modules.push(module);
                    break;
                  }

                  case 'Pipe': {
                    const pipe: SkyManifestPipeDefinition = {
                      codeExample,
                      codeExampleLanguage,
                      deprecationReason,
                      description,
                      isDeprecated,
                      isPreview,
                      name: child.name,
                      transformMethod: getPipeTransformMethod(child),
                    };

                    pack.pipes.push(pipe);
                    break;
                  }

                  default: {
                    const cls: SkyManifestClassDefinition = {
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

                    pack.classes.push(cls);
                    break;
                  }
                }

                break;
              }

              case ReflectionKind.TypeAlias: {
                const alias: SkyManifestTypeAliasDefinition = {
                  codeExample,
                  codeExampleLanguage,
                  deprecationReason,
                  description,
                  isDeprecated,
                  isPreview,
                  name: child.name,
                  type: getType(child.type),
                };

                pack.typeAliases.push(alias);
                break;
              }

              case ReflectionKind.Enum: {
                const enumeration: SkyManifestEnumerationDefinition = {
                  codeExample,
                  codeExampleLanguage,
                  deprecationReason,
                  description,
                  isDeprecated,
                  isPreview,
                  members: getEnumMembers(child),
                  name: child.name,
                };

                pack.enumerations.push(enumeration);
                break;
              }

              case ReflectionKind.Function: {
                const func = getFunctionOrMethod(child);

                pack.functions.push(func);
                break;
              }

              case ReflectionKind.Interface: {
                const def: SkyManifestInterfaceDefinition = {
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

                pack.interfaces.push(def);
                break;
              }

              case ReflectionKind.Variable: {
                const def: SkyManifestVariableDefinition = {
                  codeExample,
                  codeExampleLanguage,
                  deprecationReason,
                  description,
                  isDeprecated,
                  isPreview,
                  name: child.name,
                  type: getType(child.type),
                };

                pack.variables.push(def);
                break;
              }

              default: {
                console.error(child);
                throw new Error(`The type of '${child.name}' is not handled!`);
              }
            }

            packages.set(`${packageName}:${groupName}`, pack);
            await fsPromises.writeFile(
              `manifests/${projectName}.json`,
              JSON.stringify(pack, undefined, 2),
            );
          }
        }
      }

      // console.error(`Created manifest for ${projectName}.`);
      // await app.generateJson(pack, `manifests/${projectName}.json`);
      // if (testingEntry?.children) {
      //   packages[`@skyux/${projectName}/testing`] = {};
      // }
      // Fix lambda names
      // Assign anchorIds
    } else {
      throw new Error(`Failed to create a TypeDoc project for ${projectName}.`);
    }
  }

  // console.log('packages:', JSON.stringify([...packages], undefined, 2));
}

runTypeDoc();
