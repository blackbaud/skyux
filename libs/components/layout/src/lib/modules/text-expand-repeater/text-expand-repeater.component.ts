import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { forkJoin as observableForkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

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
export class SkyTextExpandRepeaterComponent implements AfterViewInit {
  /**
   * The data to truncate.
   */
  @Input()
  public set data(value: any[] | undefined) {
    this.#_data = value;

    // Wait for the dom to render the new items based on the updated data
    setTimeout(() => {
      this.#htmlItems = this.#textExpandRepeaterAdapter.getItems(this.#elRef);
      this.#setup(value);
    });
  }

  public get data(): any[] | undefined {
    return this.#_data;
  }

  /**
   * The template for items in the list.
   */
  @Input()
  public itemTemplate: TemplateRef<unknown> | undefined;

  /**
   * The style of bullet to use
   * @default "unordered"
   */
  @Input()
  public listStyle: SkyTextExpandRepeaterListStyleType | undefined =
    'unordered';

  /**
   * The number of items to display before truncating the list. If not supplied, all items are shown.
   */
  @Input()
  public set maxItems(value: number | undefined) {
    this.#_maxItems = value;
    this.#setup(this.data);
  }

  public get maxItems(): number | undefined {
    return this.#_maxItems;
  }

  public buttonText = '';
  public expandable = false;
  public contentSectionId = `sky-text-expand-repeater-content-${++nextId}`;

  public isExpanded: boolean | undefined;
  public transitionHeight = 1;

  #seeMoreText = '';
  #seeLessText = '';

  @ViewChild('container', {
    read: ElementRef,
    static: false,
  })
  public containerEl: ElementRef | undefined;

  #htmlItems: NodeListOf<HTMLElement> | undefined;

  #_data: any[] | undefined;
  #_maxItems: number | undefined;

  #resources: SkyLibResourcesService;
  #elRef: ElementRef;
  #textExpandRepeaterAdapter: SkyTextExpandRepeaterAdapterService;
  #changeDetector: ChangeDetectorRef;

  constructor(
    resources: SkyLibResourcesService,
    elRef: ElementRef,
    textExpandRepeaterAdapter: SkyTextExpandRepeaterAdapterService,
    changeDetector: ChangeDetectorRef,
  ) {
    this.#resources = resources;
    this.#elRef = elRef;
    this.#textExpandRepeaterAdapter = textExpandRepeaterAdapter;
    this.#changeDetector = changeDetector;
  }

  public ngAfterViewInit(): void {
    observableForkJoin([
      this.#resources.getString('skyux_text_expand_see_more'),
      this.#resources.getString('skyux_text_expand_see_less'),
    ])
      .pipe(take(1))
      .subscribe((resources) => {
        this.#seeMoreText = resources[0];
        this.#seeLessText = resources[1];
        /* sanity check */
        /* istanbul ignore else */
        if (!this.isExpanded) {
          this.buttonText = this.#seeMoreText;
        } else {
          this.buttonText = this.#seeLessText;
        }
        this.#changeDetector.detectChanges();
      });
  }

  public animationEnd(): void {
    // Ensure all items that should be hidden are hidden. This is because we need them shown during the animation window for visual purposes.
    if (!this.isExpanded) {
      this.#hideItems();
    }

    // This set timeout is needed as the `animationEnd` function is called by the angular animation callback prior to the animation setting the style on the element
    setTimeout(() => {
      if (this.containerEl) {
        // Set height back to auto so the browser can change the height as needed with window changes
        this.#textExpandRepeaterAdapter.removeContainerMaxHeight(
          this.containerEl,
        );
      }
    });
  }

  public repeaterExpand(): void {
    if (!this.isExpanded) {
      this.#animateRepeater(true);
    } else {
      this.#animateRepeater(false);
    }
  }

  #animateRepeater(expanding: boolean): void {
    const adapter = this.#textExpandRepeaterAdapter;
    const container = this.containerEl;
    if (container) {
      if (expanding) {
        this.#showItems();
      } else {
        this.#hideItems();
      }
      const newHeight = adapter.getContainerHeight(container);
      this.transitionHeight = newHeight;
      if (!expanding) {
        this.buttonText = this.#seeMoreText;
      } else {
        this.buttonText = this.#seeLessText;
      }
      if (!expanding) {
        // Show all items during animation for visual purposes.
        this.#showItems();
      }
      this.isExpanded = expanding;
    }
  }

  #setup(value: unknown[] | undefined): void {
    if (value) {
      const length = value.length;
      if (this.maxItems && length > this.maxItems) {
        this.expandable = true;
        this.buttonText = this.#seeMoreText;
        this.#hideItems();
        if (this.containerEl) {
          this.transitionHeight =
            this.#textExpandRepeaterAdapter.getContainerHeight(
              this.containerEl,
            );
        }
        this.isExpanded = false;
      } else {
        this.expandable = false;
        this.isExpanded = undefined;
      }
    } else {
      this.expandable = false;
      this.isExpanded = undefined;
    }
    this.#changeDetector.markForCheck();
  }

  #hideItems(): void {
    if (this.#htmlItems && this.maxItems) {
      for (let i = this.maxItems; i < this.#htmlItems.length; i++) {
        this.#textExpandRepeaterAdapter.hideItem(this.#htmlItems[i]);
      }
    }
  }

  #showItems(): void {
    if (this.#htmlItems && this.maxItems) {
      for (let i = this.maxItems; i < this.#htmlItems.length; i++) {
        this.#textExpandRepeaterAdapter.showItem(this.#htmlItems[i]);
      }
    }
  }
}
