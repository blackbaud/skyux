/* istanbul ignore file */
import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';

export function getChildrenNodesOf(
  el: TmplAstElement,
  childNodeName: string,
): TmplAstElement[] {
  const found: TmplAstElement[] = [];

  for (const child of el.children) {
    if (child instanceof TmplAstElement) {
      if (child.name === childNodeName) {
        found.push(child);
      } else {
        found.push(...getChildrenNodesOf(child, childNodeName));
      }
    }
  }

  // return el.children.map((child) => {
  //   if (child instanceof TmplAstElement) {
  //     if (child.name === childNodeName) {
  //       return child;
  //     }

  //     getChildrenNodesOf(child, childNodeName);
  //   }
  // });

  return found;
}
