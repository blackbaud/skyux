import { UpdateRecorder } from '@angular-devkit/schematics';

import { parseFragment } from 'parse5';
import type { DefaultTreeAdapterTypes, Token } from 'parse5';

export type ElementWithLocation = DefaultTreeAdapterTypes.Element & {
  sourceCodeLocation: Required<Token.ElementLocation>;
};
export type ParentNode = DefaultTreeAdapterTypes.ParentNode & {
  sourceCodeLocation: Required<Token.ElementLocation>;
};
export type SwapTagCallback<T extends string> = (
  position: 'open' | 'close',
  tag: T,
  node: ElementWithLocation,
  content: string,
) => string;
export type SwapAttributeCallback<T extends string, U extends string> = (
  oldAttribute: T,
  newAttribute: U,
  node: ElementWithLocation,
  content: string,
) => string | null;

function isElement(node: unknown): node is ElementWithLocation {
  return !!node && typeof node === 'object' && 'tagName' in node;
}

export function isParentNode(node: unknown): node is ParentNode {
  return !!node && typeof node === 'object' && 'childNodes' in node;
}

export function getElementsByTagName(
  tagName: string,
  node: Element | ParentNode,
): ElementWithLocation[] {
  const elements: ElementWithLocation[] = [];
  const nodeQueue: (Element | ParentNode)[] = [node];

  while (nodeQueue.length) {
    const currentNode = nodeQueue.shift();
    if (
      isElement(currentNode) &&
      currentNode.tagName.toLowerCase() === tagName.toLowerCase()
    ) {
      elements.push(currentNode);
    }
    if (isParentNode(currentNode)) {
      nodeQueue.push(
        ...currentNode.childNodes.filter(
          (node: any): node is ElementWithLocation => isElement(node),
        ),
      );
    }
  }

  return elements;
}

export function parseTemplate(template: string): ParentNode {
  const document = parseFragment(template, {
    sourceCodeLocationInfo: true,
  });
  if (isParentNode(document)) {
    return document;
  }
  return parseFragment('', {
    sourceCodeLocationInfo: true,
  }) as ParentNode;
}

type SwapTagsOptions = {
  expectNestedSelfClosingTags?: boolean;
};

export function swapTags<T extends string>(
  content: string,
  recorder: UpdateRecorder,
  offset: number,
  oldTags: T[],
  callback: SwapTagCallback<T>,
  options: SwapTagsOptions,
  ...node: (ElementWithLocation | ParentNode)[]
): void {
  const nodeQueue = [...node];
  while (nodeQueue.length) {
    const currentNode = nodeQueue.shift();
    if (isElement(currentNode)) {
      const tagName = currentNode.tagName.toLowerCase() as T;
      if (oldTags.includes(tagName)) {
        /* istanbul ignore if */
        if (typeof currentNode.sourceCodeLocation?.startTag !== 'object') {
          // Skip if source code location is not available
          continue;
        }

        recorder.remove(
          offset + currentNode.sourceCodeLocation.startTag.startOffset,
          currentNode.sourceCodeLocation.startTag.endOffset -
            currentNode.sourceCodeLocation.startTag.startOffset,
        );
        recorder.insertLeft(
          offset + currentNode.sourceCodeLocation.startTag.startOffset,
          callback('open', tagName, currentNode, content),
        );
        if (currentNode.sourceCodeLocation.endTag?.startOffset) {
          recorder.remove(
            offset + currentNode.sourceCodeLocation.endTag.startOffset,
            currentNode.sourceCodeLocation.endTag.endOffset -
              currentNode.sourceCodeLocation.endTag.startOffset,
          );
          recorder.insertLeft(
            offset + currentNode.sourceCodeLocation.endTag.startOffset,
            callback('close', tagName, currentNode, content),
          );
        }
      }
    }
    if (
      // Only traverse child nodes if the current node is not a self-closing tag
      (!isElement(currentNode) ||
        options.expectNestedSelfClosingTags ||
        currentNode?.sourceCodeLocation?.endTag?.startOffset) &&
      isParentNode(currentNode)
    ) {
      nodeQueue.push(...currentNode.childNodes.filter(isElement));
    }
  }
}

function safeSubstring(content: string, start: number, end: number): string {
  return start < end && start < content.length && end < content.length
    ? content.substring(start, end)
    : '';
}

export function getAttributeValueText<T extends string>(
  content: string,
  node: ElementWithLocation,
  attribute: T,
): string {
  return safeSubstring(
    content,
    node.sourceCodeLocation.attrs[attribute.toLowerCase()].startOffset +
      attribute.length,
    node.sourceCodeLocation.attrs[attribute.toLowerCase()].endOffset,
  );
}

/**
 * Swaps attributes in an HTML element based on a mapping of old attribute names to new attribute names.
 *
 * The function loops over each attribute in the node:
 * - If the attribute is in the mapping, it calls the optional callback function
 * - If the callback result is truthy, it adds the result to the output
 * - If the attribute is not in the mapping, it copies the attribute as-is
 */
export function swapAttributes<T extends string, U extends string>(
  node: ElementWithLocation,
  attributeSwaps: Record<T, U>,
  content: string,
  callback?: SwapAttributeCallback<T, U>,
): string {
  if (node.attrs.length === 0) {
    return '';
  }
  const result = [
    safeSubstring(
      content,
      node.sourceCodeLocation.startTag.startOffset + node.tagName.length + 1,
      node.sourceCodeLocation.attrs[node.attrs[0].name].startOffset,
    ),
  ];
  const swap = Object.fromEntries(
    Object.keys(attributeSwaps).map((key) => [key.toLowerCase(), key]),
  );

  const swapAttributeCallback: SwapAttributeCallback<T, U> =
    callback ??
    ((oldAttribute, newAttribute, node, content): string | null =>
      newAttribute
        ? newAttribute + getAttributeValueText(content, node, oldAttribute)
        : null);

  const copySpace = (index: number): void => {
    if (index > 0) {
      result.push(
        safeSubstring(
          content,
          node.sourceCodeLocation.attrs[node.attrs[index - 1].name].endOffset,
          node.sourceCodeLocation.attrs[node.attrs[index].name].startOffset,
        ),
      );
    }
  };

  node.attrs.forEach((attr: any, index: number) => {
    if (attr.name in swap) {
      const oldAttribute = swap[attr.name] as T;
      const newAttribute = attributeSwaps[oldAttribute] as U;
      const replacement =
        newAttribute &&
        swapAttributeCallback(oldAttribute, newAttribute, node, content);
      if (replacement) {
        copySpace(index);
        result.push(replacement);
      }
    } else {
      copySpace(index);
      result.push(
        safeSubstring(
          content,
          node.sourceCodeLocation.attrs[attr.name].startOffset,
          node.sourceCodeLocation.attrs[attr.name].endOffset,
        ),
      );
    }
  });
  return result.join('');
}

/**
 * Extracts the text content from a selector within element and returns it as a string.
 * If the element wraps anything more than a simple text node, an error is thrown.
 */
export function getText(text: DefaultTreeAdapterTypes.ChildNode[]): string {
  if (text.length === 1 && text[0].nodeName === '#text') {
    return (text[0] as DefaultTreeAdapterTypes.TextNode).value.trim();
  } else if (!text || text.length === 0) {
    return '';
  } else {
    // If the result contains something other than a single text node,
    // throw an error to indicate that the title cannot be converted.
    throw new Error(
      `The element contains additional markup that cannot be processed.`,
    );
  }
}
