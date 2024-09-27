import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';

function traverseChildNodes(
  el: TmplAstElement,
  childNodeName: string,
): TmplAstElement | undefined {
  return el.children.find((child) => {
    if (child instanceof TmplAstElement) {
      if (child.name === childNodeName) {
        return true;
      }

      return false;

      // return traverseChildNodes(child, childNodeName);
    }

    return false;
  }) as TmplAstElement | undefined;
}

export function getChildNodeOf(
  el: TmplAstElement,
  childNodeName: string,
): TmplAstElement | undefined {
  return traverseChildNodes(el, childNodeName);
}
