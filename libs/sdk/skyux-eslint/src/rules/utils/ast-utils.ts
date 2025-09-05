import type { TmplAstNode } from '@angular-eslint/bundled-angular-compiler';
import {
  TmplAstBoundText,
  TmplAstElement,
  TmplAstTemplate,
  TmplAstText,
} from '@angular-eslint/bundled-angular-compiler';

/**
 * Gets a child node of the provided element with the specified name.
 */
export function getChildNodeOf(
  el: TmplAstElement,
  childNodeNames: string[],
): TmplAstElement | undefined {
  return el.children.find((child) => {
    if (child instanceof TmplAstElement) {
      if (childNodeNames.includes(child.name)) {
        return true;
      }

      /* istanbul ignore next: safety check */
      return getChildNodeOf(child, childNodeNames);
    }

    return false;
  }) as TmplAstElement | undefined;
}

type TmplAstNodeWithChildren = TmplAstNode & { children?: TmplAstNode[] };

/**
 * Gets all children nodes of the provided element with the specified name.
 */
export function getChildrenNodesOf(
  el: TmplAstNodeWithChildren,
  childNodeName: string,
): (TmplAstElement | TmplAstTemplate)[] {
  const found: TmplAstNodeWithChildren[] = [];

  if (el.children) {
    for (const child of el.children) {
      if (child instanceof TmplAstElement) {
        if (child.name === childNodeName) {
          found.push(child);
        }
      } else if (child instanceof TmplAstTemplate) {
        if (child.tagName === childNodeName) {
          found.push(child);
        }
      } else {
        found.push(...getChildrenNodesOf(child, childNodeName));
      }
    }
  }

  return found as (TmplAstElement | TmplAstTemplate)[];
}

/**
 * Gets the *ngFor structural directive of the provided template element.
 */
export function getNgFor(el: TmplAstTemplate): string {
  if (el.templateAttrs[0].name !== 'ngFor') {
    return '';
  }

  const ngFor = el.startSourceSpan.toString().split('*ngFor')[1];
  const fragments = ngFor.split('"');

  return `*ngFor${fragments[0]}"${fragments[1]}"`;
}

/**
 * Gets the text content of the provided element, preserving HTML entities.
 */
export function getTextContent(el: TmplAstElement): string {
  let text = '';

  el.children.forEach((child) => {
    if (child instanceof TmplAstText) {
      // Use sourceSpan to get original source text with entities preserved (e.g. `&#64;`).
      text += child.sourceSpan.toString().trim();
    } else if (child instanceof TmplAstBoundText) {
      text += child.sourceSpan.toString().trim();
    }
  });

  return text;
}
