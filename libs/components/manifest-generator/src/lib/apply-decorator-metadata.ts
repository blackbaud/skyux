import {
  Context,
  type DeclarationReflection,
  ReflectionKind,
  TypeScript as ts,
} from 'typedoc';

import type {
  DeclarationReflectionDecorator,
  DeclarationReflectionWithDecorators,
} from './types/declaration-reflection-with-decorators.js';

interface CallExpressionArgs {
  text?: string;
  symbol?: {
    members: Map<
      string,
      { valueDeclaration: { initializer: { text: string } } }
    >;
  };
}

function getInputName(args: CallExpressionArgs): string | undefined {
  return (
    args.text ??
    args.symbol?.members.get('alias')?.valueDeclaration.initializer.text
  );
}

function getPipeName(args: CallExpressionArgs): string {
  /* v8 ignore start: pipes will always have a name */
  return (
    args.symbol?.members.get('name')?.valueDeclaration.initializer.text ?? ''
  );
  /* v8 ignore stop */
}

function getSelector(args: CallExpressionArgs): string {
  return (
    args.symbol?.members.get('selector')?.valueDeclaration.initializer.text ??
    ''
  );
}

function getDecoratorInfo(
  decoratorName: string,
  callExpression: ts.CallExpression,
): DeclarationReflectionDecorator {
  const decorator: DeclarationReflectionDecorator = {
    name: decoratorName,
  };

  const args = callExpression?.arguments[0] as CallExpressionArgs;

  if (args) {
    switch (decorator.name) {
      case 'Component':
      case 'Directive':
        decorator.arguments = {
          selector: getSelector(args),
        };
        break;

      case 'Pipe':
        decorator.arguments = {
          name: getPipeName(args),
        };
        break;

      case 'Input': {
        const inputName = getInputName(args);

        if (inputName) {
          decorator.arguments = {
            bindingPropertyName: inputName,
          };
        }

        break;
      }
    }
  }

  return decorator;
}

export function applyDecoratorMetadata(
  context: Context,
  reflection: DeclarationReflection,
): void {
  const kind = ReflectionKind[reflection.kind];
  const kindsWithDecorators = [
    'Accessor',
    'Class',
    'Method',
    'Module',
    'Property',
  ];

  if (!kindsWithDecorators.includes(kind)) {
    return;
  }

  const symbol = context.getSymbolFromReflection(reflection);
  const declaration = symbol?.valueDeclaration as undefined | ts.HasModifiers;

  if (!declaration || !declaration.modifiers) {
    return;
  }

  const modifiers = declaration.modifiers as unknown as ts.Decorator[];
  const decorators: DeclarationReflectionDecorator[] = [];

  for (const modifier of modifiers) {
    const callExpression = modifier.expression as undefined | ts.CallExpression;
    const identifier = callExpression?.expression as undefined | ts.Identifier;

    if (identifier) {
      const decoratorName = identifier.escapedText as string;

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

      decorators.push(
        getDecoratorInfo(decoratorName, callExpression as ts.CallExpression),
      );
    }
  }

  (reflection as DeclarationReflectionWithDecorators).decorators = decorators;
}
