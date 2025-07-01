import { UpdateRecorder } from '@angular-devkit/schematics';
import { Element, parse5 } from '@angular/cdk/schematics';

export type ElementWithLocation = Element & {
  sourceCodeLocation: Required<parse5.Token.ElementLocation>;
};
type ParentNode = parse5.DefaultTreeAdapterTypes.ParentNode & {
  sourceCodeLocation: Required<parse5.Token.ElementLocation>;
};
export type SwapTagCallback<T extends string> = (
  position: 'open' | 'close',
  tag: T,
  node: ElementWithLocation,
) => string;

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
      nodeQueue.push(...currentNode.childNodes.filter(isElement));
    }
  }

  return elements;
}

export function parseTemplate(template: string): ParentNode {
  const document = parse5.parseFragment(template, {
    sourceCodeLocationInfo: true,
  });
  if (isParentNode(document)) {
    return document;
  }
  return parse5.parseFragment('', {
    sourceCodeLocationInfo: true,
  }) as ParentNode;
}

export function swapTags<T extends string>(
  recorder: UpdateRecorder,
  offset: number,
  oldTags: T[],
  callback: SwapTagCallback<T>,
  ...node: (Element | ParentNode)[]
): void {
  const nodeQueue = [...node];
  while (nodeQueue.length) {
    const currentNode = nodeQueue.shift();
    if (isElement(currentNode)) {
      const tagName = currentNode.tagName.toLowerCase() as T;
      if (oldTags.includes(tagName)) {
        /* istanbul ignore if */
        if (
          !currentNode.sourceCodeLocation?.startTag ||
          !currentNode.sourceCodeLocation?.endTag
        ) {
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
          callback('open', tagName, currentNode as ElementWithLocation),
        );
        recorder.remove(
          offset + currentNode.sourceCodeLocation.endTag.startOffset,
          currentNode.sourceCodeLocation.endTag.endOffset -
            currentNode.sourceCodeLocation.endTag.startOffset,
        );
        recorder.insertLeft(
          offset + currentNode.sourceCodeLocation.endTag.startOffset,
          callback('close', tagName, currentNode as ElementWithLocation),
        );
      }
    }
    if (isParentNode(currentNode)) {
      nodeQueue.push(...currentNode.childNodes.filter(isElement));
    }
  }
}
