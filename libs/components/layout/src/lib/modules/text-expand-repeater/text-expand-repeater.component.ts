import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
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
  animations: [
    trigger('expansionAnimation', [
      transition(':enter', []),
      state(
        'true',
        style({
          maxHeight: '{{transitionHeight}}px',
        }),
        { params: { transitionHeight: 0 } },
      ),
      state(
        'false',
        style({
          maxHeight: '{{transitionHeight}}px',
        }),
        { params: { transitionHeight: 0 } },
      ),
      transition('true => false', animate('250ms ease')),
      transition('false => true', animate('250ms ease')),
      transition('void => *', []),
    ]),
  ],
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
  protected transitionHeight = 1;

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
    // Ensure all items that should be hidden are hidden. This is because we need them shown during the animation window for visual purposes.
    if (!this.isExpanded()) {
      this.#hideItems();
    }

    // This set timeout is needed as the `animationEnd` function is called by the angular animation callback prior to the animation setting the style on the element
    setTimeout(() => {
      const containerEl = this.containerEl();
      if (containerEl) {
        // Set height back to auto so the browser can change the height as needed with window changes
        this.#textExpandRepeaterAdapter.removeContainerMaxHeight(containerEl);
      }
    });
  }

  public repeaterExpand(): void {
    if (!this.isExpanded()) {
      this.#animateRepeater(true);
    } else {
      this.#animateRepeater(false);
    }
  }

  #animateRepeater(expanding: boolean): void {
    const adapter = this.#textExpandRepeaterAdapter;
    const container = this.containerEl();
    if (container) {
      if (expanding) {
        this.#showItems();
      } else {
        this.#hideItems();
      }
      this.transitionHeight = adapter.getContainerHeight(container);
      if (!expanding) {
        // Show all items during animation for visual purposes.
        this.#showItems();
      }
      this.isExpanded.set(expanding);
    }
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
          this.transitionHeight =
            this.#textExpandRepeaterAdapter.getContainerHeight(container);
        }
      }
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
