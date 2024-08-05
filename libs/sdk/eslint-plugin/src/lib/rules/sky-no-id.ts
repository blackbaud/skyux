import type {
  TmplAstBoundAttribute,
  TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import { createESLintRule } from '@angular-eslint/eslint-plugin-template/dist/utils/create-eslint-rule';
import { getDomElements } from '@angular-eslint/eslint-plugin-template/dist/utils/get-dom-elements';
import { toPattern } from '@angular-eslint/eslint-plugin-template/dist/utils/to-pattern';
import { getTemplateParserServices } from '@angular-eslint/utils';

export type Options = [];
export type MessageIds = 'skyNoId';
export const RULE_NAME = 'sky-no-id';

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        '[Accessibility] Ensures that the `id` attribute is not used',
    },
    fixable: 'code',
    schema: [],
    messages: {
      skyNoId:
        'The `id` attribute should not be used because it could create collisions with other elements with the same `id` attribute. Use `skyId` instead.',
    },
  },
  defaultOptions: [],
  create(context: any) {
    const parserServices = getTemplateParserServices(context);
    const elementNamePattern = toPattern([...getDomElements()]);

    return {
      [`Element$1[name=${elementNamePattern}] > :matches(BoundAttribute, TextAttribute)[name="id"]`]({
        sourceSpan,
      }: TmplAstBoundAttribute | TmplAstTextAttribute) {
        const loc = parserServices.convertNodeSourceSpanToLoc(sourceSpan);

        context.report({
          loc,
          messageId: 'skyNoId',
          fix: (fixer: any) =>
            fixer.removeRange([
              sourceSpan.start.offset - 1,
              sourceSpan.end.offset,
            ]),
        });
      },
    };
  },
});
