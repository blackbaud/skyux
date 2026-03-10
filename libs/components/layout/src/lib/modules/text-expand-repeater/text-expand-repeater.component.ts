import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  TemplateRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLibResourcesService } from '@skyux/i18n';

import { SkyTextExpandRepeaterAdapterService } from './text-expand-repeater-adapter.service';
import { SkyTextExpandRepeaterListStyleType } from './types/text-expand-repeater-list-style-type';

/**
 * Auto-incrementing integer used to generate unique ids for text expand repeater components.
 */
let nextId = 0;

@Component({
  selector: 'sky-text-expand-repeater',
  templateUrl: './text-expand-repeater.component.html',
  styleUrls: ['./text-expand-repeater.component.scss'],
  providers: [SkyTextExpandRepeaterAdapterService],
  standalone: false,
})
export class SkyTextExpandRepeaterComponent<TData = unknown> {
  /**
   * The data to truncate.
   */
  public readonly data = input<TData[] | undefined>();

  /**
   * The template for items in the list.
   */
  public readonly itemTemplate = input<TemplateRef<unknown> | undefined>();

  /**
   * The style of bullet to use
   * @default "unordered"
   */
  public readonly listStyle = input<
    SkyTextExpandRepeaterListStyleType | undefined
  >('unordered');

  /**
   * The number of items to display before truncating the list. If not supplied, all items are shown.
   */
  public readonly maxItems = input<number, unknown>(0, {
    transform: numberAttribute,
  });

  protected expandable = false;
  public contentSectionId = `sky-text-expand-repeater-content-${++nextId}`;

  protected readonly isExpanded = signal(false);
  protected collapsedMinHeight = '0';

  readonly #resources = inject(SkyLibResourcesService);
  readonly #seeMoreText = toSignal(
    this.#resources.getString('skyux_text_expand_see_more'),
    { initialValue: '' },
  );
  readonly #seeLessText = toSignal(
    this.#resources.getString('skyux_text_expand_see_less'),
    { initialValue: '' },
  );
  protected readonly buttonText = computed(() => {
    const seeLessText = this.#seeLessText();
    const seeMoreText = this.#seeMoreText();
    return this.isExpanded() ? seeLessText : seeMoreText;
  });

  protected containerEl = viewChild<ElementRef>('container');

  #dataIndices = 0;
  #htmlItems: NodeListOf<HTMLElement> | undefined;

  readonly #elRef = inject(ElementRef);
  readonly #textExpandRepeaterAdapter = inject(
    SkyTextExpandRepeaterAdapterService,
  );
  readonly #changeDetector = inject(ChangeDetectorRef);

  protected readonly trackedData = computed(() =>
    (this.data() ?? []).map((item) => ({
      item,
      index: ++this.#dataIndices,
    })),
  );

  constructor() {
    afterRenderEffect(() => {
      this.#htmlItems = this.#textExpandRepeaterAdapter.getItems(this.#elRef);
      this.#setup();
    });
  }

  public animationEnd(): void {
    if (!this.isExpanded()) {
      this.#hideItems();
    }
  }

  public repeaterExpand(): void {
    if (!this.isExpanded()) {
      this.#animateRepeater(true);
    } else {
      this.#animateRepeater(false);
    }
  }

  #animateRepeater(expanding: boolean): void {
    if (expanding) {
      this.#showItems();
    }
    this.isExpanded.set(expanding);
  }

  #setup(): void {
    const container = this.containerEl();
    const maxItems = this.maxItems();
    const value = this.trackedData();
    this.expandable = false;
    this.isExpanded.set(false);
    if (value.length > 0) {
      const length = value.length;
      if (maxItems && length > maxItems) {
        this.expandable = true;
        this.#hideItems();
        if (container) {
          this.collapsedMinHeight =
            container.nativeElement.offsetHeight + 'px';
        }
      } else {
        this.isExpanded.set(true);
      }
    } else {
      this.isExpanded.set(true);
    }
    this.#changeDetector.detectChanges();
  }

  #hideItems(): void {
    if (this.#htmlItems && this.maxItems()) {
      for (let i = this.maxItems(); i < this.#htmlItems.length; i++) {
        this.#textExpandRepeaterAdapter.hideItem(this.#htmlItems[i]);
      }
    }
  }

  #showItems(): void {
    if (this.#htmlItems && this.maxItems()) {
      for (let i = this.maxItems(); i < this.#htmlItems.length; i++) {
        this.#textExpandRepeaterAdapter.showItem(this.#htmlItems[i]);
      }
    }
  }
}
