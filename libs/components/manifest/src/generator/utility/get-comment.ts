import { Comment, CommentDisplayPart, CommentTag } from 'typedoc';

export type CodeExampleLanguage = 'markup' | 'typescript';

function getCommentTagText(parts: CommentDisplayPart[]): string | undefined {
  return (
    parts
      .map((item) => item.text)
      .join('')
      .trim() || undefined
  );
}

function getCodeExample(comment: CommentTag): {
  codeExample: string | undefined;
  codeExampleLanguage: CodeExampleLanguage | undefined;
} {
  let codeExample = getCommentTagText(comment.content)?.split('```')[1].trim();
  let codeExampleLanguage: CodeExampleLanguage | undefined;

  if (codeExample) {
    const exampleLanguage = codeExample?.split('\n')[0];

    if (exampleLanguage === 'markup' || exampleLanguage === 'typescript') {
      codeExample = codeExample.slice(exampleLanguage.length).trim();
      codeExampleLanguage = exampleLanguage;
    } else {
      codeExampleLanguage = 'markup';
    }
  }

  return { codeExample, codeExampleLanguage };
}

export function getComment(comment: Comment | undefined): {
  codeExample: string | undefined;
  codeExampleLanguage: CodeExampleLanguage | undefined;
  deprecationReason: string | undefined;
  defaultValue: string | undefined;
  description: string | undefined;
  isDeprecated: boolean | undefined;
  isInternal: boolean | undefined;
  isPreview: boolean | undefined;
  isRequired: boolean;
} {
  let codeExample: string | undefined;
  let codeExampleLanguage: CodeExampleLanguage | undefined;
  let deprecationReason: string | undefined;
  let defaultValue: string | undefined;
  let description: string | undefined;
  let isDeprecated: boolean | undefined;
  let isInternal: boolean | undefined;
  let isPreview: boolean | undefined;
  let isRequired = false;

  if (comment) {
    isInternal = comment.modifierTags.has('@internal') ? true : undefined;

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
            deprecationReason = getCommentTagText(tag.content);
            break;
          }

          case '@example': {
            const example = getCodeExample(tag);
            codeExample = example.codeExample;
            codeExampleLanguage = example.codeExampleLanguage;
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

    description =
      comment.summary
        .map((item) => item.text)
        .join('')
        .trim()
        .replace(/(\r\n|\n|\r)/gm, ' ') || undefined;
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
