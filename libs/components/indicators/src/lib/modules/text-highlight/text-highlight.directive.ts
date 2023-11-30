import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
} from '@angular/core';
import { SkyMutationObserverService } from '@skyux/core';

const CLASS_NAME = 'sky-highlight-mark';
const SPECIAL_CHAR_REGEX = /[-/\\^$*+?.()|[\]{}]/g;

function markNode(node: Text, searchRegex: RegExp): number {
  // The search regular expression is reused across calls to markNode(), so reset
  // it so it searches from the start of the string each time.
  searchRegex.lastIndex = 0;

  const text = node.nodeValue;

  if (text) {
    const match = searchRegex.exec(text);

    if (match) {
      // Split apart text node with mark tags in the middle on the search term.
      const matchIndex = match.index;

      const middle = node.splitText(matchIndex);
      middle.splitText(searchRegex.lastIndex - matchIndex);
      const middleClone = middle.cloneNode(true);

      const markNode = document.createElement('mark');
      markNode.className = CLASS_NAME;
      markNode.appendChild(middleClone);

      /* istanbul ignore else */
      if (middle.parentNode) {
        middle.parentNode.replaceChild(markNode, middle);
      }

      return 1;
    }
  }

  return 0;
}

function markTextNodes(node: Node, searchRegex: RegExp): number {
  if (node.nodeType === 3) {
    return markNode(node as Text, searchRegex);
  } else if (node.nodeType === 1 && node.childNodes) {
    for (let i = 0; i < node.childNodes.length; i++) {
      const childNode = node.childNodes[i];
      i += markTextNodes(childNode, searchRegex);
    }
  }

  return 0;
}

function removeHighlight(el: ElementRef): void {
  const matchedElements = (el.nativeElement as Element).querySelectorAll(
    `mark.${CLASS_NAME}`
  );

  if (matchedElements) {
    for (let i = 0; i < matchedElements.length; i++) {
      const node = matchedElements[i];
      const parentNode = node.parentNode;

      if (parentNode && node.firstChild) {
        parentNode.replaceChild(node.firstChild, node);
        parentNode.normalize();
      }
    }
  }
}

function createSearchRegex(searchTerms: string[]): RegExp | undefined {
  let searchRegex: RegExp | undefined;

  if (searchTerms.length > 0) {
    // Escape all the special regular expression characters by adding a
    // preceding '\' to each match.
    searchTerms = searchTerms.map((searchTerm) =>
      searchTerm.replace(SPECIAL_CHAR_REGEX, '\\$&')
    );

    searchRegex = new RegExp(searchTerms.join('|'), 'gi');
  }

  return searchRegex;
}

// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
/**
 * Highlights all matching text within the current DOM element.
 */
@Directive({
  selector: '[skyHighlight]',
})
export class SkyTextHighlightDirective
  implements OnChanges, AfterViewInit, OnDestroy
{
  /**
   * The text to highlight.
   */
  @Input()
  public set skyHighlight(value: string | string[] | undefined) {
    value = value || [];

    if (Array.isArray(value)) {
      this.#searchTerms = value.filter((item) => !!item);
      // Reorder strings by their length in descending order to avoid missing matches
      // that contain substrings of other matches.
      this.#searchTerms.sort(function (a, b) {
        return b.length - a.length;
      });
    } else {
      this.#searchTerms = [value as string];
    }
  }

  #existingHighlight = false;

  #observer: MutationObserver | undefined;

  #searchTerms: string[] = [];

  #el = inject(ElementRef);
  #observerSvc = inject(SkyMutationObserverService);

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['skyHighlight'] && !changes['skyHighlight'].firstChange) {
      this.#highlight();
    }
  }

  public ngAfterViewInit(): void {
    this.#observer = this.#observerSvc.create(() => {
      this.#highlight();
    });

    this.#highlight();
  }

  public ngOnDestroy(): void {
    this.#disconnectObserver();
  }

  #disconnectObserver(): void {
    if (this.#observer) {
      this.#observer.disconnect();
    }
  }

  #highlight(): void {
    this.#disconnectObserver();

    if (this.#existingHighlight) {
      removeHighlight(this.#el);
    }

    const node = this.#el.nativeElement;

    if (node) {
      const searchRegex = createSearchRegex(this.#searchTerms);

      // mark all matched text in the DOM
      if (searchRegex) {
        markTextNodes(node, searchRegex);
        this.#existingHighlight = true;
      }
    }

    this.#observeDom();
  }

  #observeDom(): void {
    if (this.#observer) {
      const config = {
        attributes: false,
        childList: true,
        characterData: true,
      };

      this.#observer.observe(this.#el.nativeElement, config);
    }
  }
}
