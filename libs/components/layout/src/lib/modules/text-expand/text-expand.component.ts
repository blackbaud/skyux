import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyModalService } from '@skyux/modals';

import { forkJoin as observableForkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

import { SkyTextExpandAdapterService } from './text-expand-adapter.service';
import { SKY_TEXT_EXPAND_MODAL_CONTEXT } from './text-expand-modal-context-token';
import { SkyTextExpandModalComponent } from './text-expand-modal.component';

/**
 * Auto-incrementing integer used to generate unique ids for text expand components.
 */
let nextId = 0;

@Component({
  selector: 'sky-text-expand',
  templateUrl: './text-expand.component.html',
  styleUrls: ['./text-expand.component.scss'],
  providers: [SkyTextExpandAdapterService],
})
export class SkyTextExpandComponent implements AfterContentInit {
  /**
   * Specifies a title to display when the component expands the full text in a modal.
   * @default "Expanded view"
   */
  @Input()
  public expandModalTitle: string | undefined;

  /**
   * Specifies the maximum number of text characters to display inline when users select the link
   * to expand the full text. If the text exceeds this limit, then the component expands
   * the full text in a modal instead.
   * @default 600
   */
  @Input()
  public set maxExpandedLength(value: number | undefined) {
    if (value) {
      this.#_maxExpandedLength = value;
    } else {
      this.#_maxExpandedLength = 600;
    }
    this.#setup(this.text);
  }

  public get maxExpandedLength(): number {
    return this.#_maxExpandedLength;
  }

  /**
   * Specifies the maximum number of newline characters to display inline when users select
   * the link to expand the full text. If the text exceeds this limit, then
   * the component expands the full text in a modal view instead.
   * @default 2
   */
  @Input()
  public set maxExpandedNewlines(value: number | undefined) {
    if (value) {
      this.#_maxExpandedNewlines = value;
    } else {
      this.#_maxExpandedNewlines = 2;
    }
    this.#setup(this.text);
  }

  public get maxExpandedNewlines(): number {
    return this.#_maxExpandedNewlines;
  }

  /**
   * Specifies the number of text characters to display before truncating the text.
   * To avoid truncating text in the middle of a word, the component looks for a space
   * in the 10 characters before the last character.
   * @default 200
   */
  @Input()
  public set maxLength(value: number | undefined) {
    if (value) {
      this.#_maxLength = value;
    } else {
      this.#_maxLength = 200;
    }
    this.#setup(this.text);
  }

  public get maxLength(): number {
    return this.#_maxLength;
  }

  /**
   * Specifies the text to truncate.
   */
  @Input()
  public set text(value: string | undefined) {
    this.#_text = value ?? '';
    this.#setup(this.#_text);
  }

  public get text(): string {
    return this.#_text;
  }

  /**
   * Indicates whether to replace newline characters in truncated text with spaces.
   */
  @Input()
  public truncateNewlines = true;

  public buttonText = '';

  public contentSectionId = `sky-text-expand-content-${++nextId}`;

  public expandable = false;

  public isExpanded = false;

  public isModal = false;

  @ViewChild('container', {
    read: ElementRef,
    static: true,
  })
  public set containerEl(value: ElementRef | undefined) {
    this.#_containerEl = value;
    this.#setContainerMaxHeight();
  }

  public get containerEl(): ElementRef | undefined {
    return this.#_containerEl;
  }

  @ViewChild('text', {
    read: ElementRef,
    static: true,
  })
  public set textEl(value: ElementRef | undefined) {
    this.#_textEl = value;
    this.#setup(this.text);
  }

  public get textEl(): ElementRef | undefined {
    return this.#_textEl;
  }

  #collapsedText = '';

  #newlineCount = 0;

  #seeMoreText = '';

  #seeLessText = '';

  #textToShow = '';

  #_containerEl: ElementRef | undefined;

  #_maxExpandedLength = 600;

  #_maxExpandedNewlines = 2;

  #_maxLength = 200;

  #_text = '';

  #_textEl: ElementRef | undefined;

  #resources: SkyLibResourcesService;
  #modalSvc: SkyModalService;
  #textExpandAdapter: SkyTextExpandAdapterService;

  constructor(
    resources: SkyLibResourcesService,
    modalSvc: SkyModalService,
    textExpandAdapter: SkyTextExpandAdapterService
  ) {
    this.#resources = resources;
    this.#modalSvc = modalSvc;
    this.#textExpandAdapter = textExpandAdapter;
  }

  public textExpand(): void {
    if (this.isModal) {
      // Modal View
      /* istanbul ignore else */
      /* sanity check */
      if (!this.isExpanded) {
        this.#modalSvc.open(SkyTextExpandModalComponent, [
          {
            provide: SKY_TEXT_EXPAND_MODAL_CONTEXT,
            useValue: {
              header: this.expandModalTitle,
              text: this.text,
            },
          },
        ]);
      }
    } else {
      // Normal View
      if (!this.isExpanded) {
        this.#setContainerMaxHeight();
        setTimeout(() => {
          this.isExpanded = true;
          this.#animateText(this.#collapsedText, this.text, true);
        }, 10);
      } else {
        this.#setContainerMaxHeight();
        setTimeout(() => {
          this.isExpanded = false;
          this.#animateText(this.text, this.#collapsedText, false);
        }, 10);
      }
    }
  }

  public animationEnd(): void {
    if (this.textEl && this.containerEl) {
      // Ensure the correct text is displayed
      this.#textExpandAdapter.setText(this.textEl, this.#textToShow);
      // Set height back to auto so the browser can change the height as needed with window changes
      this.#textExpandAdapter.setContainerHeight(this.containerEl, undefined);
    }
  }

  public ngAfterContentInit(): void {
    observableForkJoin([
      this.#resources.getString('skyux_text_expand_see_more'),
      this.#resources.getString('skyux_text_expand_see_less'),
    ])
      .pipe(take(1))
      .subscribe((resources) => {
        this.#seeMoreText = resources[0];
        this.#seeLessText = resources[1];
        this.#setup(this.text);

        /* istanbul ignore else */
        if (!this.expandModalTitle) {
          this.#resources
            .getString('skyux_text_expand_modal_title')
            .pipe(take(1))
            .subscribe((resource) => {
              this.expandModalTitle = resource;
            });
        }
      });
  }

  #setContainerMaxHeight(): void {
    if (this.containerEl) {
      // ensure everything is reset
      this.animationEnd();
      /* Before animation is kicked off, ensure that a maxHeight exists */
      /* Once we have support for angular v4 animations with parameters we can use that instead */
      const currentHeight = this.#textExpandAdapter.getContainerHeight(
        this.containerEl
      );
      this.#textExpandAdapter.setContainerHeight(
        this.containerEl,
        `${currentHeight}px`
      );
    }
  }

  #setup(value: string | undefined): void {
    if (value) {
      this.#newlineCount = this.#getNewlineCount(value);
      this.#collapsedText = this.#getTruncatedText(value, this.maxLength);
      if (this.#collapsedText !== value) {
        this.buttonText = this.#seeMoreText;
        this.isExpanded = false;
        this.expandable = true;
        this.isModal =
          this.#newlineCount > this.maxExpandedNewlines ||
          this.text.length > this.maxExpandedLength;
      } else {
        this.expandable = false;
      }
      this.#textToShow = this.#collapsedText;
    } else {
      this.#textToShow = '';
      this.expandable = false;
    }
    if (this.textEl) {
      this.#textExpandAdapter.setText(this.textEl, this.#textToShow);
    }
  }

  #getNewlineCount(value: string): number {
    const matches = value.match(/\n/gi);

    if (matches) {
      return matches.length;
    }

    return 0;
  }

  #getTruncatedText(value: string, length: number): string {
    let i: number;
    if (this.truncateNewlines) {
      value = value.replace(/\n+/gi, ' ');
    }
    // Jump ahead one character and see if it's a space, and if it isn't,
    // back up to the first space and break there so a word doesn't get cut
    // in half.
    if (length < value.length) {
      for (i = length; i > length - 10; i--) {
        if (/\s/.test(value.charAt(i))) {
          length = i;
          break;
        }
      }
    }
    return value.substring(0, length);
  }

  #animateText(
    previousText: string,
    newText: string,
    expanding: boolean
  ): void {
    if (this.containerEl && this.textEl) {
      const adapter = this.#textExpandAdapter;
      const container = this.containerEl;
      // Reset max height
      adapter.setContainerHeight(container, undefined);
      // Measure the current height so we can animate from it.
      const currentHeight = adapter.getContainerHeight(container);
      this.#textToShow = newText;
      adapter.setText(this.textEl, this.#textToShow);
      this.buttonText = expanding ? this.#seeLessText : this.#seeMoreText;
      // Measure the new height so we can animate to it.
      const newHeight = adapter.getContainerHeight(container);
      /* istanbul ignore if */
      if (newHeight < currentHeight) {
        // The new text is smaller than the old text, so put the old text back before doing
        // the collapse animation to avoid showing a big chunk of whitespace.
        adapter.setText(this.textEl, previousText);
      }

      adapter.setContainerHeight(container, `${currentHeight}px`);
      // This timeout is necessary due to the browser needing to pick up the non-auto height being set
      // in order to do the transtion in height correctly. Without it the transition does not fire.
      setTimeout(() => {
        adapter.setContainerHeight(container, `${newHeight}px`);
        /* This resets values if the transition does not get kicked off */
        setTimeout(() => {
          this.animationEnd();
        }, 500);
      }, 10);
    }
  }
}
