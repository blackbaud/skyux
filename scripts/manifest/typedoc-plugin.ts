import {
  Application,
  Context,
  Converter,
  DeclarationReflection,
  TypeScript as ts,
} from 'typedoc';

export abstract class DeclarationReflectionWithDecorators extends DeclarationReflection {
  public decorators?: unknown[];
}

function addDecoratorInfo(context: Context, decl: DeclarationReflection) {
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

  const modifiers = declaration.modifiers;
  let decorators: DecoratorMetadata[] | undefined;

  if (ts.isClassDeclaration(declaration)) {
    decorators = modifiers
      ?.filter((m) =>
        m.getText().match(/@Component|@Directive|@Injectable|@Pipe|@NgModule/),
      )
      .map((m) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        name: m
          .getText()
          .match(/(?<=@)Component|Directive|Injectable|Pipe|NgModule/)![0],
        arguments: {
          obj: m.getText(),
        },
      }));
  } else {
    decorators = modifiers
      ?.filter((m) => m.getText().match(/(?<=@)Input|Output(?=\(\))/))
      .map((m: any) => {
        const decoratorObject: {
          name: string;
          arguments?: { [key: string]: unknown };
        } = {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          name: m.getText().match(/(?<=@)Input|Output(?=\(\))/)![0],
        };

        if (m.expression) {
          if (m.expression.arguments && m.expression.arguments[0]) {
            if (m.expression.arguments[0].text) {
              decoratorObject.arguments = {
                bindingPropertyName: m.expression.arguments[0].text,
              };
            } else if (
              m.expression.arguments[0].properties &&
              m.expression.arguments[0].properties.length > 0
            ) {
              decoratorObject.arguments = {};
              for (const property of m.expression.arguments[0].properties) {
                const value = property.initializer.getText();
                if (property.name.getText() === 'alias') {
                  decoratorObject.arguments.bindingPropertyName = value;
                } else {
                  decoratorObject.arguments[property.name.getText()] = value;
                }
              }
            }
          }
        }

        return decoratorObject;
      });
  }

  (decl as DeclarationReflectionWithDecorators).decorators = decorators;
}

/**
 * This plugin is based on a suggestion from a Typedoc maintainer at https://github.com/TypeStrong/typedoc/issues/2346#issuecomment-1656806051.
 * Modifications were made to support accessors and to fix issues that were present in his suggestion (which he admitted hadn't been tested).
 */
export function load(app: Application) {
  // Add decorator info to reflections
  app.converter.on(Converter.EVENT_CREATE_DECLARATION, addDecoratorInfo);

  // Add decorator info to serialized json
  app.serializer.addSerializer({
    priority: 0,
    supports() {
      return true;
    },
    toObject(item: any, obj: any) {
      if (item.decorators) {
        obj.decorators = item.decorators;
      }

      return obj;
    },
  });
}
