import { Comment, CommentDisplayPart } from 'typedoc';

export type CodeExampleLanguage = 'markup' | 'typescript';

function getCommentTagText(parts: CommentDisplayPart[]): string {
  return parts
    .map((item) => item.text)
    .join('')
    .trim();
}

export function getComment(comment: Comment | undefined): {
  codeExample: string | undefined;
  codeExampleLanguage: CodeExampleLanguage | undefined;
  deprecationReason: string | undefined;
  defaultValue: string;
  description: string;
  isDeprecated: boolean | undefined;
  isInternal: boolean;
  isPreview: boolean | undefined;
  isRequired: boolean;
} {
  let codeExample: string | undefined;
  let codeExampleLanguage: CodeExampleLanguage | undefined;
  let deprecationReason: string | undefined;
  let defaultValue = '';
  let description = '';
  let isDeprecated: boolean | undefined;
  let isInternal = false;
  let isPreview: boolean | undefined;
  let isRequired = false;

  if (comment) {
    isInternal = comment.modifierTags.has('@internal');

    if (comment.blockTags) {
      comment.blockTags.forEach((tag) => {
        switch (tag.tag) {
          case '@default':
          case '@defaultValue': {
            defaultValue = getCommentTagText(tag.content);
            break;
          }

          case '@deprecated': {
            isDeprecated = true;
            deprecationReason = getCommentTagText(tag.content) || undefined;
            break;
          }

          case '@example': {
            codeExample = getCommentTagText(tag.content).split('```')[1].trim();

            const exampleLanguage = codeExample.split('\n')[0];

            if (
              exampleLanguage === 'markup' ||
              exampleLanguage === 'typescript'
            ) {
              codeExample = codeExample.slice(exampleLanguage.length).trim();
              codeExampleLanguage = exampleLanguage;
            } else {
              codeExampleLanguage = 'markup';
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
    isInternal,
    isPreview,
    isRequired,
  };
}
