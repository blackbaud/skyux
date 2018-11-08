import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import { MutationObserverService } from '@skyux/core';

const className = 'sky-highlight-mark';

@Directive({
  selector: '[skyHighlight]'
})
export class SkyTextHighlightDirective
  implements OnChanges, AfterViewInit, OnDestroy {

  @Input()
  public skyHighlight: string = undefined;

  private existingHighlight = false;
  private observer: MutationObserver;

  private static getRegexMatch(node: HTMLElement, searchText: string): RegExpExecArray {
    const text = node.nodeValue;
    const newSearchText = this.cleanRegex(searchText);
    const searchRegex = new RegExp(newSearchText, 'gi');
    return searchRegex.exec(text);
  }

  private static markNode(node: any, searchText: string) {
    const regexMatch = SkyTextHighlightDirective.getRegexMatch(node, searchText);

    // found match
    if (regexMatch && regexMatch.length > 0) {

      // split apart text node with mark tags in the middle on the search term
      const matchIndex = regexMatch.index;

      const middle = node.splitText(matchIndex);
      middle.splitText(searchText.length);
      const middleClone = middle.cloneNode(true);

      const markNode = document.createElement('mark');
      markNode.className = className;
      markNode.appendChild(middleClone);
      middle.parentNode.replaceChild(markNode, middle);

      return 1;
    } else {
      return 0;
    }
  }

  private static markTextNodes(node: HTMLElement, searchText: string) {
    if (node.nodeType === 3) {
      return SkyTextHighlightDirective.markNode(node, searchText);

    } else if (node.nodeType === 1 && node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        let childNode = node.childNodes[i] as HTMLElement;
        i += SkyTextHighlightDirective.markTextNodes(childNode, searchText);
      }
    }

    return 0;
  }

  private static removeHighlight(el: ElementRef) {
    const matchedElements =
      el.nativeElement.querySelectorAll(`mark.${className}`) as NodeList;

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

  constructor(private el: ElementRef, private observerService: MutationObserverService) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.skyHighlight && !changes.skyHighlight.firstChange) {
      this.highlight();
    }
  }

  public ngAfterViewInit(): void {
    let me = this;

    this.observer = this.observerService.create((mutations: MutationRecord[]) => {
      me.highlight();
    });

    this.observeDom();

    if (this.skyHighlight) {
      this.highlight();
    }
  }

  public ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private readyForHighlight(searchText: string): boolean {
    return searchText && this.el.nativeElement;
  }

  private highlight(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    const searchText = this.skyHighlight;

    if (this.existingHighlight) {
      SkyTextHighlightDirective.removeHighlight(this.el);
    }

    if (this.readyForHighlight(searchText)) {
      const node: HTMLElement = this.el.nativeElement;

      // mark all matched text in the DOM
      SkyTextHighlightDirective.markTextNodes(node, searchText);
      this.existingHighlight = true;
    }

    this.observeDom();
  }

  private observeDom() {
    if (this.observer) {
      const config = { attributes: true, childList: true, characterData: true };
      this.observer.observe(this.el.nativeElement, config);
    }
  }

  private static cleanRegex(regex: string) {
    return regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}
