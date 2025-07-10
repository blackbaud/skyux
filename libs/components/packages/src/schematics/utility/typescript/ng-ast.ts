import {
  getDecoratorMetadata,
  getMetadataField,
  isImported,
} from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export function getInlineTemplates(
  sourceFile: ts.SourceFile,
): { start: number; end: number }[] {
  if (isImported(sourceFile, 'Component', '@angular/core')) {
    const components = getDecoratorMetadata(
      sourceFile,
      'Component',
      '@angular/core',
    );
    const templates = components
      .filter((component) => ts.isObjectLiteralExpression(component))
      .flatMap((component) => getMetadataField(component, 'template'))
      .filter((template) => ts.isPropertyAssignment(template));
    if (templates.length > 0) {
      return templates
        .map((template) => {
          if (
            ts.isStringLiteralLike(template.initializer) ||
            ts.isNoSubstitutionTemplateLiteral(template.initializer)
          ) {
            return {
              start: template.initializer.getStart() + 1,
              end: template.initializer.getEnd() - 1, // Exclude quotes
            };
          }
          return undefined;
        })
        .filter(Boolean) as { start: number; end: number }[];
    }
  }
  return [];
}
