import {
  TmplAstBoundText,
  TmplAstElement,
  TmplAstNode,
  TmplAstTemplate,
  TmplAstText,
} from '@angular-eslint/bundled-angular-compiler';

/**
 * Gets a child node of the provided element with the specified name.
 */
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
 * Gets the structural directive of the provided template element.
 */
export function getStructuralDirective(el: TmplAstTemplate): string {
  const structuralDirective = el.startSourceSpan.toString().split('*')[1];
  const fragments = structuralDirective.split('"');

  return `*${fragments[0]}"${fragments[1]}"`;
}

/**
 * Gets the text content of the provided element.
 */
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
