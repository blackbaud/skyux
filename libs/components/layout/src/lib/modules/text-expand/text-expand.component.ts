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
  standalone: false,
})
export class SkyTextExpandComponent implements AfterContentInit {
  /**
   * The title to display when the component expands the full text in a modal.
   * @default "Expanded view"
   */
  @Input()
  public expandModalTitle: string | undefined;

  /**
   * The maximum number of text characters to display inline when users select the link
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
   * The maximum number of newline characters to display inline when users select
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
   * The number of text characters to display before truncating the text.
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
   * The text to truncate.
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
   * Whether to replace newline characters in truncated text with spaces.
   */
  @Input()
  public truncateNewlines = true;

  public buttonText = '';

  public contentSectionId = `sky-text-expand-content-${++nextId}`;

  public expandable = false;

  public isExpanded: boolean | undefined;

  public isModal = false;

  @ViewChild('container', {
    read: ElementRef,
    static: true,
  })
  public containerEl: ElementRef | undefined;

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
    textExpandAdapter: SkyTextExpandAdapterService,
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
        this.#animateText(true);
      } else {
        this.#animateText(false);
      }
    }
  }

  public animationEnd(event?: TransitionEvent): void {
    if (event && event.propertyName !== 'max-height') {
      return;
    }

    if (this.textEl && this.containerEl) {
      // Ensure the correct text is displayed
      this.#textExpandAdapter.setText(this.textEl, this.#textToShow);

      // Set height back to auto so the browser can change the height as needed with window changes
      this.#textExpandAdapter.removeContainerMaxHeight(this.containerEl);
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

  #animateText(expanding: boolean): void {
    if (this.containerEl && this.textEl) {
      const adapter = this.#textExpandAdapter;
      const container = this.containerEl;

      // Capture the current height and lock it to establish a CSS transition start point.
      const startHeight = adapter.getContainerHeight(container);
      adapter.setContainerMaxHeight(container, startHeight);

      if (expanding) {
        adapter.setText(this.textEl, this.text);
        this.#textToShow = this.text;
      } else {
        adapter.setText(this.textEl, this.#collapsedText);
        this.#textToShow = this.#collapsedText;
      }
      this.buttonText = expanding ? this.#seeLessText : this.#seeMoreText;

      // Use scrollHeight to measure the target content height regardless of the max-height constraint.
      const targetHeight = adapter.getContainerScrollHeight(container);

      // Always show all text while animating so that the animation is smooth.
      // The animation callback will set this back if needed.
      if (!expanding) {
        adapter.setText(this.textEl, this.text);
      }

      // Force a reflow so the browser registers the starting max-height.
      void container.nativeElement.offsetHeight;

      // Set the target max-height to trigger the CSS transition.
      adapter.setContainerMaxHeight(container, targetHeight);

      this.isExpanded = expanding;
    }
  }
}
