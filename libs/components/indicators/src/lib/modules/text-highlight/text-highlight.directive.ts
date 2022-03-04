import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { MutationObserverService } from '@skyux/core';

const className = 'sky-highlight-mark';

// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
/**
 * Highlights all matching text within DOM elements that it is placed on.
 * The directive is only valid for elements that contain content, so you
 * cannot place it on `ng-template`, `ng-content`, or `ng-container` tags.
 */
@Directive({
  selector: '[skyHighlight]',
})
export class SkyTextHighlightDirective
  implements OnChanges, AfterViewInit, OnDestroy
{
  /**
   * Specifies the text to highlight.
   */
  @Input()
  public set skyHighlight(value: string | string[]) {
    value = value || [];
    this._skyHighlight = [];

    if (Array.isArray(value)) {
      this._skyHighlight = value.filter((item) => !!item);
      // Reorder strings by their length in descending order to avoid missing matches
      // that contain substrings of other matches.
      this._skyHighlight.sort(function (a, b) {
        return b.length - a.length;
      });
    } else {
      this._skyHighlight = [value as string];
    }
  }

  private existingHighlight = false;

  private observer: MutationObserver;

  private _skyHighlight: string[];

  constructor(
    private el: ElementRef,
    private observerService: MutationObserverService
  ) {}

  private static cleanRegex(regex: string): string {
    return regex.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  private static markNode(node: any, searchTerms: string[]): number {
    /* istanbul ignore else */
    if (searchTerms) {
      const text = node.nodeValue;
      for (let i = 0; i < searchTerms.length; i++) {
        searchTerms[i] = this.cleanRegex(searchTerms[i]);
      }
      const searchRegex = new RegExp(searchTerms.join('|'), 'gi');
      const match = searchRegex.exec(text);
      if (match) {
        // Split apart text node with mark tags in the middle on the search term.
        const matchIndex = match.index;

        const middle = node.splitText(matchIndex);
        middle.splitText(searchRegex.lastIndex - matchIndex);
        const middleClone = middle.cloneNode(true);

        const markNode = document.createElement('mark');
        markNode.className = className;
        markNode.appendChild(middleClone);
        middle.parentNode.replaceChild(markNode, middle);

        return 1;
      }
    }
    return 0;
  }

  private static markTextNodes(
    node: HTMLElement,
    searchTerms: string[]
  ): number {
    if (node.nodeType === 3) {
      return SkyTextHighlightDirective.markNode(node, searchTerms);
    } else if (node.nodeType === 1 && node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const childNode = node.childNodes[i] as HTMLElement;
        i += SkyTextHighlightDirective.markTextNodes(childNode, searchTerms);
      }
    }

    return 0;
  }

  private static removeHighlight(el: ElementRef): void {
    const matchedElements = el.nativeElement.querySelectorAll(
      `mark.${className}`
    ) as NodeList;

    /* istanbul ignore else */
    /* sanity check */
    if (matchedElements) {
      for (let i = 0; i < matchedElements.length; i++) {
        const node = matchedElements[i];
        const parentNode = node.parentNode;

        parentNode.replaceChild(node.firstChild, node);
        parentNode.normalize();
      }
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.skyHighlight && !changes.skyHighlight.firstChange) {
      this.highlight();
    }
  }

  public ngAfterViewInit(): void {
    this.observer = this.observerService.create(() => {
      this.highlight();
    });

    this.observeDom();
    if (this._skyHighlight && this._skyHighlight.length > 0) {
      this.highlight();
    }
  }

  public ngOnDestroy(): void {
    /* istanbul ignore else */
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private readyForHighlight(searchText: string[]): boolean {
    return searchText && searchText.length > 0 && this.el.nativeElement;
  }

  private highlight(): void {
    /* istanbul ignore else */
    if (this.observer) {
      this.observer.disconnect();
    }

    const searchText = this._skyHighlight;

    if (this.existingHighlight) {
      SkyTextHighlightDirective.removeHighlight(this.el);
    }

    /* istanbul ignore else */
    if (this.readyForHighlight(searchText)) {
      const node: HTMLElement = this.el.nativeElement;

      // mark all matched text in the DOM
      SkyTextHighlightDirective.markTextNodes(node, searchText);
      this.existingHighlight = true;
    }

    this.observeDom();
  }

  private observeDom(): void {
    /* istanbul ignore else */
    if (this.observer) {
      const config = {
        attributes: false,
        childList: true,
        characterData: true,
      };
      this.observer.observe(this.el.nativeElement, config);
    }
  }
}
