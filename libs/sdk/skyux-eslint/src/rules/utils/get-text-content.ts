import {
  TmplAstBoundText,
  TmplAstElement,
  TmplAstText,
} from '@angular-eslint/bundled-angular-compiler';

export function getTextContent(el: TmplAstElement): string {
  let text = '';

  el.children.forEach((child) => {
    if (child instanceof TmplAstText) {
      text += child.value.trim();
    } else if (child instanceof TmplAstBoundText) {
      text += child.sourceSpan.toString().trim();
    } else if (child instanceof TmplAstElement) {
      text += getTextContent(child);
    }
  });

  return text;
}
