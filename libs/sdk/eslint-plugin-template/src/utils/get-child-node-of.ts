import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';

export function getChildNodeOf(
  el: TmplAstElement,
  childNodeName: string,
): TmplAstElement | undefined {
  return el.children.find((child) => {
    if (child instanceof TmplAstElement) {
      if (child.name === childNodeName) {
        return true;
      }

      return getChildNodeOf(child, childNodeName);
    }

    return false;
  }) as TmplAstElement | undefined;
}
