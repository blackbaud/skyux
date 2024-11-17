/* eslint-disable max-depth */

/* eslint-disable complexity */
import crossSpawn from 'cross-spawn';
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
  ParameterReflection,
  ReferenceType,
  ReflectionKind,
  ReflectionType,
  SomeType,
  UnionType,
} from 'typedoc';

import {
  SkyManifestClassDefinition,
  SkyManifestClassMethodDefinition,
  SkyManifestClassPropertyDefinition,
  SkyManifestDirectiveDefinition,
  SkyManifestPackage,
  SkyManifestParameterDefinition,
} from './types';

interface DeclarationReflectionWithDecorators extends DeclarationReflection {
  decorators?: { name: string; arguments?: Record<string, string> }[];
}

const pluginPath = path.join(__dirname, './typedoc-plugin.mjs');

function _exec(command: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = crossSpawn(command, args, { stdio: 'pipe' });

    let stdout = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('exit', () => {
      resolve(stdout);
    });
  });
}

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

function getTypeArguments(typeArguments: SomeType[]): string {
  if (typeArguments.length === 0) {
    return '';
  }

  let name = `<`;

  for (const arg of typeArguments) {
    name += getType(arg);
  }

  name += '>';

  return name;
}

function getType(type: SomeType | undefined): string {
  if (type) {
    if (type instanceof IntrinsicType) {
      return type.name;
    }

    if (type instanceof LiteralType) {
      return `${type.value}`;
    }

    // Type arguments.
    if (type instanceof ReferenceType) {
      let name = type.name;

      if (type.typeArguments) {
        name += getTypeArguments(type.typeArguments);
      }

      return name;
    }

    // Inline interfaces.
    if (type instanceof ReflectionType) {
      const props = ['{'];

      const children = type.declaration.children ?? [];

      for (const child of children) {
        props.push(
          `${child.name}${child.flags?.isOptional ? '?' : ''}: ${getType(child.type)};`,
        );
      }

      props.push('}');

      return props.join(' ');
    }

    if (type instanceof ArrayType) {
      return `${getType(type.elementType)}[]`;
    }

    if (type instanceof UnionType) {
      return type.types.map((t) => getType(t)).join(' | ');
    }

    console.error('UNHANDLED TYPE:', type);
  }

  return 'unknown';
}

// function getTypeParameterDefinitions(
//   typeParameters: SomeType[] | undefined,
// ): SkyManifestTypeParameterDefinition[] {
//   if (!typeParameters) {
//     return [];
//   }

//   return typeParameters.map((typeParam) => {
//     return getTypeDefinition(typeParam);
//   });
// }

function getParameters(
  refl: ParameterReflection[] | undefined,
): SkyManifestParameterDefinition[] {
  if (!refl) {
    return [];
  }

  const parameters: SkyManifestParameterDefinition[] = [];

  for (const param of refl) {
    const { defaultValue, description } = getCommentMeta(param.comment);

    parameters.push({
      defaultValue,
      description,
      isOptional: !!param.flags?.isOptional,
      name: param.name,
      type: getType(param.type),
    });
  }

  return parameters;
}

function getMethods(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestClassMethodDefinition[] {
  if (!decl.children) {
    return [];
  }

  const methods: SkyManifestClassMethodDefinition[] = [];

  for (const child of decl.children) {
    if (child.kind === ReflectionKind.Method && !child.name.startsWith('ng')) {
      const signature = child.signatures?.[0];

      const {
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isPreview,
      } = getCommentMeta(signature?.comment);

      methods.push({
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isPreview,
        isStatic: !!child.flags?.isStatic,
        name: child.name,
        parameters: getParameters(signature?.parameters),
        returnType: getType(signature?.type),
      });
    }
  }

  return methods;
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
      isRequired,
    } = getCommentMeta(
      decl.getSignature?.comment ?? decl.setSignature?.comment,
    );

    const property: SkyManifestClassPropertyDefinition = {
      codeExample,
      codeExampleLanguage,
      deprecationReason,
      description,
      defaultValue,
      isDeprecated,
      isPreview,
      isOptional: !isRequired,
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
      isRequired,
    } = getCommentMeta(decl.comment);

    const property: SkyManifestClassPropertyDefinition = {
      codeExample,
      codeExampleLanguage,
      deprecationReason,
      description,
      defaultValue: decl.defaultValue ?? defaultValue,
      isDeprecated,
      isPreview,
      isOptional: !isRequired && decl.defaultValue === undefined,
      name: decl.name,
      type: getType(decl.type),
    };

    return property;
  }
}

function getProperties(
  decl: DeclarationReflectionWithDecorators,
  // withDecorator?: 'Input' | 'Output',
): SkyManifestClassPropertyDefinition[] {
  if (!decl.children) {
    return [];
  }

  const properties: SkyManifestClassPropertyDefinition[] = [];
  const children = decl.children as DeclarationReflectionWithDecorators[];

  if (getSelector(decl) === 'sky-link-list-recently-accessed') {
    console.log(children);
  }

  for (const child of children) {
    // TODO: How to handle 'input' signals?
    // if (withDecorator !== getDecorator(child)) {
    //   continue;
    // }

    if (isInput(child) || isOutput(child)) {
      continue;
    }

    const property = getProperty(child);

    if (property) {
      properties.push(property);
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
    (decl.type instanceof ReferenceType && decl.type?.name === 'OutputSignal')
  );
}

function getInputs(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestClassPropertyDefinition[] {
  if (!decl.children) {
    return [];
  }

  const inputs: SkyManifestClassPropertyDefinition[] = [];

  for (const child of decl.children) {
    if (isInput(child)) {
      const input = getProperty(child);

      if (input) {
        inputs.push(input);
      }
    }
  }

  return inputs;
}

function getOutputs(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestClassPropertyDefinition[] {
  if (!decl.children) {
    return [];
  }

  const outputs: SkyManifestClassPropertyDefinition[] = [];

  for (const child of decl.children) {
    if (isOutput(child)) {
      const output = getProperty(child);

      if (output) {
        outputs.push(output);
      }
    }
  }

  return outputs;
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

async function runTypeDoc(): Promise<void> {
  // const output = await _exec('npx', [
  //   'nx',
  //   'show',
  //   'projects',
  //   '--projects',
  //   'tag:component', // maybe add new tag named 'docs'?
  //   '--json',
  // ]);

  // const projectNames = JSON.parse(output);
  const projectNames = ['pages'];

  if (fs.existsSync('manifests')) {
    await fsPromises.rm('manifests', { recursive: true });
  }

  await fsPromises.mkdir('manifests');

  const packages = new Map<string, SkyManifestPackage>();

  for (const projectName of projectNames) {
    const projectRoot = `libs/components/${projectName}`;

    const app = await Application.bootstrapWithPlugins({
      entryPoints: [
        `${projectRoot}/src/index.ts`,
        `${projectRoot}/testing/src/public-api.ts`,
      ],
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

    const project = await app.convert();

    if (project) {
      const mainEntry = project.children?.[0];
      // const testingEntry = project.children?.[1];

      const children = mainEntry?.children as
        | DeclarationReflectionWithDecorators[]
        | undefined;

      if (children) {
        for (const child of children) {
          const packageName = `@skyux/${projectName}`;
          const fileName = child.sources?.[0].fullFileName;

          if (fileName && !fileName.endsWith('/index.ts')) {
            // Derive the group name from its directory.
            const groupName =
              fileName
                .split(`${projectName}/src/lib/modules/`)[1]
                ?.split('/')[0] ?? 'root';

            const pack = packages.get(`${packageName}:${groupName}`) ?? {
              classes: [],
              components: [],
              directives: [],
              enumerations: [],
              interfaces: [],
              modules: [],
              pipes: [],
              services: [],
              typeAliases: [],
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
                      selector: getSelector(child) ?? '',
                      inputs: getInputs(child),
                      outputs: getOutputs(child),
                    };

                    console.log('directive', directive);

                    pack.directives.push(directive);
                    break;
                  }
                }

                break;
              }
            }

            packages.set(`${packageName}:${groupName}`, pack);
          }
        }
      }

      // if (testingEntry?.children) {
      //   packages[`@skyux/${projectName}/testing`] = {};
      // }
      // await app.generateJson(project, `manifests/${projectName}.json`);
      // Fix lambda names
      // Assign anchorIds
    }
  }

  // console.log('packages:', JSON.stringify([...packages], undefined, 2));
}

runTypeDoc();
