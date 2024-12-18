import {
  TmplAstElement,
  TmplAstTemplate,
} from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';
import { RuleFix } from '@typescript-eslint/utils/dist/ts-eslint';

import { getChildrenNodesOf } from '../utils/ast-utils';
import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'no-radio-group-with-nested-list';
export const messageId = 'noRadioGroupWithNestedList';

// type TmplAstNodeWithParent = TmplAstNode & { parent?: TmplAstNode };

// function getNextElementOrTemplateParent(
//   node: TmplAstNodeWithParent,
// ): AST | undefined {
//   const parent = node.parent;
//   if (parent) {
//     return getNextElementOrTemplateParent(
//       parent as unknown as TmplAstNodeWithParent,
//     );
//   }
//   return parent;
// }

// export const rule = createESLintTemplateRule({
//   create(context) {
//     const parserServices = getTemplateParserServices(context);

//     return {
//       [`Element$1[name="sky-radio"]`](el: TmplAstElement): void {
//         console.log('el:', el);
//         // console.log('el:', el.sourceSpan.toString());
//         // console.log('el2', el.references);
//         // const parent = getNextElementOrTemplateParent(el);
//         // console.log('parent', parent);
//         context.report({
//           loc: parserServices.convertNodeSourceSpanToLoc(el.sourceSpan),
//           messageId,
//           data: {},
//         });
//       },
//     };
//   },
//   defaultOptions: [],
//   meta: {
//     docs: {
//       description: '',
//     },
//     messages: {
//       [messageId]: 'Do not nest lists within a sky-radio-group.',
//     },
//     schema: [],
//     type: 'problem',
//     fixable: 'code',
//   },
//   name: RULE_NAME,
// });

function getStructuralDirective(el: TmplAstTemplate): string {
  const structuralDirective = el.startSourceSpan.toString().split('*')[1];
  const fragments = structuralDirective.split('"');

  return `*${fragments[0]}"${fragments[1]}"`;
}

// function removeStartTag(el: TmplAstElement): RuleFix {
//   return {range:[
//     el.startSourceSpan.start.offset,
//     el.startSourceSpan.end.offset,
//   ],
//   text: ''};

// }

export const rule = createESLintTemplateRule({
  create(context) {
    const parserServices = getTemplateParserServices(context);

    return {
      [`Element$1[name=/^(sky-radio-group)$/]`](el: TmplAstElement): void {
        el.children.forEach((child) => {
          if (
            child instanceof TmplAstElement &&
            (child.name === 'ul' || child.name === 'ol')
          ) {
            context.report({
              loc: parserServices.convertNodeSourceSpanToLoc(child.sourceSpan),
              messageId,
              data: {},
              fix: (fixer) => {
                const fixers: RuleFix[] = [];

                fixers.push(
                  fixer.replaceTextRange(
                    [
                      child.startSourceSpan.start.offset,
                      child.startSourceSpan.end.offset,
                    ],
                    '',
                  ),
                );

                // for (const c of child.children) {
                //   console.log('CHILD', c);

                //   if (c instanceof TmplAstText) {
                //     console.log('TEXT', c.value);
                //   }
                // }

                const listItems = getChildrenNodesOf(child, 'li') as (
                  | TmplAstElement
                  | TmplAstTemplate
                )[];

                for (const listItem of listItems) {
                  if (listItem instanceof TmplAstTemplate) {
                    const structuralDirective =
                      getStructuralDirective(listItem);

                    if (structuralDirective) {
                      fixers.push(
                        fixer.replaceTextRange(
                          [
                            listItem.startSourceSpan.start.offset,
                            listItem.startSourceSpan.end.offset,
                          ],
                          `<ng-container ${structuralDirective}>`,
                        ),
                      );

                      if (listItem.endSourceSpan) {
                        fixers.push(
                          fixer.replaceTextRange(
                            [
                              listItem.endSourceSpan.start.offset,
                              listItem.endSourceSpan.end.offset,
                            ],
                            '</ng-container>',
                          ),
                        );
                      }
                    }
                  } else {
                    fixers.push(
                      fixer.replaceTextRange(
                        [
                          listItem.startSourceSpan.start.offset,
                          listItem.startSourceSpan.end.offset,
                        ],
                        '',
                      ),
                    );

                    if (listItem.endSourceSpan) {
                      fixers.push(
                        fixer.replaceTextRange(
                          [
                            listItem.endSourceSpan.start.offset,
                            listItem.endSourceSpan.end.offset,
                          ],
                          '',
                        ),
                      );
                    }
                  }
                }

                if (child.endSourceSpan) {
                  fixers.push(
                    fixer.replaceTextRange(
                      [
                        child.endSourceSpan.start.offset,
                        child.endSourceSpan.end.offset,
                      ],
                      '',
                    ),
                  );
                }

                return fixers;
              },
            });
          }
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: '',
    },
    messages: {
      [messageId]: 'Do not nest lists within a sky-radio-group.',
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
