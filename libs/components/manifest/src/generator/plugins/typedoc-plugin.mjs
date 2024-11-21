import { Converter, TypeScript as ts } from 'typedoc';

function addDecoratorInfo(context, decl) {
  const symbol = context.project.getSymbolFromReflection(decl);

  if (!symbol) {
    return;
  }

  const declaration = symbol.valueDeclaration;

  if (!declaration) {
    return;
  }

  if (
    !ts.isPropertyDeclaration(declaration) &&
    !ts.isMethodDeclaration(declaration) &&
    !ts.isClassDeclaration(declaration) &&
    !ts.isAccessor(declaration)
  ) {
    return;
  }

  let decorators = [];

  // if (ts.isClassDeclaration(declaration)) {
  const modifiers = declaration.modifiers ?? [];

  for (const modifier of modifiers) {
    const expression = modifier.expression?.expression;

    if (expression) {
      const decoratorName = expression.escapedText;

      if (
        ![
          'Component',
          'Directive',
          'Injectable',
          'Input',
          'NgModule',
          'Output',
          'Pipe',
        ].includes(decoratorName)
      ) {
        continue;
      }

      const decorator = {
        name: decoratorName,
      };

      const args = modifier.expression?.arguments[0];

      if (args) {
        switch (decorator.name) {
          case 'Component':
          case 'Directive':
            decorator.arguments = {
              selector:
                args.symbol.members.get('selector')?.valueDeclaration
                  .initializer.text ?? '',
            };

            break;

          case 'Pipe':
            decorator.arguments = {
              name: args.symbol.members.get('name').valueDeclaration.initializer
                .text,
            };
            break;

          case 'Input':
            if (args.text) {
              decorator.arguments = {
                bindingPropertyName: args.text,
              };
            }
            break;
        }
      }

      decorators.push(decorator);
    }
  }

  decl.decorators = decorators;
}

/**
 * This plugin is based on a suggestion from a Typedoc maintainer at https://github.com/TypeStrong/typedoc/issues/2346#issuecomment-1656806051.
 * Modifications were made to support accessors and to fix issues that were present in his suggestion (which he admitted hadn't been tested).
 */
export function load(app) {
  // Add decorator info to reflections
  app.converter.on(Converter.EVENT_CREATE_DECLARATION, addDecoratorInfo);

  // Add decorator info to serialized json
  app.serializer.addSerializer({
    priority: 0,
    supports() {
      return true;
    },
    toObject(item, obj) {
      if (item.decorators) {
        obj.decorators = item.decorators;
      }

      return obj;
    },
  });
}
