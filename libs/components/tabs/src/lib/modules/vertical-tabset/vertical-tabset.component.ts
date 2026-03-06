import { animate, style, transition, trigger } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';

import { take } from 'rxjs/operators';

import { SkyTabIdService } from '../shared/tab-id.service';

import { SkyVerticalTabsetAdapterService } from './vertical-tabset-adapter.service';
import {
  HIDDEN_STATE,
  SkyVerticalTabsetService,
  VISIBLE_STATE,
} from './vertical-tabset.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, SkyIconModule],
  providers: [SkyTabIdService, SkyVerticalTabsetService],
  selector: 'sky-vertical-tabset',
  templateUrl: './vertical-tabset.component.html',
  styleUrl: './vertical-tabset.component.scss',
  animations: [
    trigger('tabGroupEnter', [
      transition(`${HIDDEN_STATE} => ${VISIBLE_STATE}`, [
        style({ transform: 'translate(-100%)' }),
        animate('150ms ease-in'),
      ]),
    ]),
    trigger('contentEnter', [
      transition(`${HIDDEN_STATE} => ${VISIBLE_STATE}`, [
        style({ transform: 'translate(100%)' }),
        animate('150ms ease-in'),
      ]),
    ]),
  ],
})
export class SkyVerticalTabsetComponent implements AfterViewChecked {
  /**
   * The text to display on the show tabs button on mobile devices.
   */
  public readonly showTabsText = input<string>();

  /**
   * The ARIA label for the tabset. This sets the tabset's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the tabset includes a visible label, use `ariaLabelledBy` instead.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  public readonly ariaLabel = input<string>();

  /**
   * The HTML element ID of the element that labels
   * the tabset. This sets the tabset's `aria-labelledby` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the tabset does not include a visible label, use `ariaLabel` instead.
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   */
  public readonly ariaLabelledBy = input<string>();

  /**
   * The ARIA role for the vertical tabset
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the tabset functions and what it controls. For information about how
   * an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/#roles).
   * @default "tablist"
   * @deprecated Any other value than `tablist` could lead to a poor user experience for users with assistive technology.
   * In the next major version, this property will be automatically set to `tablist`.
   */
  public readonly ariaRole = input<string | undefined>();

  /**
   * Whether the vertical tabset loads tab content during initialization so that it
   * displays content without moving around elements in the content container.
   * @default false
   */
  public readonly maintainTabContent = input<boolean | undefined>(false);

  /**
   * Fires when the active tab changes. Emits the index of the active tab. The
   * index is based on the tab's position when it loads.
   */
  public readonly activeChange = output<number>();

  public readonly tabGroups = viewChild<ElementRef>('groupContainerWrapper');
  public readonly content = viewChild<ElementRef>('skySideContent');
  public readonly contentWrapper = viewChild<ElementRef>(
    'contentContainerWrapper',
  );

  public readonly isMobile = signal(false);

  protected readonly tablistHasFocus = signal(false);

  protected readonly resolvedAriaRole = computed(
    () => this.ariaRole() ?? 'tablist',
  );

  readonly #defaultShowTabsText = signal('');
  protected readonly resolvedShowTabsText = computed(
    () => this.showTabsText() || this.#defaultShowTabsText(),
  );

  public readonly adapterService = inject(SkyVerticalTabsetAdapterService);
  public readonly tabService = inject(SkyVerticalTabsetService);
  public readonly tabIdSvc = inject(SkyTabIdService);

  readonly #changeRef = inject(ChangeDetectorRef);

  constructor() {
    inject(SkyLibResourcesService)
      .getString('skyux_vertical_tabs_show_tabs_text')
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((resource) => {
        this.#defaultShowTabsText.set(resource);
      });

    this.tabService.indexChanged
      .pipe(takeUntilDestroyed())
      .subscribe((index) => {
        if (index !== undefined) {
          this.activeChange.emit(index);
        }

        const wrapper = this.contentWrapper();

        if (wrapper) {
          this.adapterService.scrollToContentTop(wrapper);
        }

        this.#changeRef.markForCheck();
      });

    this.tabService.switchingMobile
      .pipe(takeUntilDestroyed())
      .subscribe((mobile: boolean) => {
        this.isMobile.set(mobile);
        this.#changeRef.markForCheck();
      });

    if (this.tabService.isMobile()) {
      this.isMobile.set(true);
      this.tabService.animationContentVisibleState = VISIBLE_STATE;
    }
  }

  public ngAfterViewChecked(): void {
    this.tabService.maintainTabContent = this.maintainTabContent();
    this.tabService.content = this.content();
    this.tabService.updateContent();
  }

  protected tabsetFocus(): void {
    this.tabService.focusActiveTab(this.tabGroups());
  }

  protected trapFocusInTablist(): void {
    this.tablistHasFocus.set(true);
  }

  protected resetTabIndex(): void {
    this.tablistHasFocus.set(false);
  }

  protected tabGroupsArrowDown(): void {
    this.adapterService.focusNextButton(this.tabGroups());
  }

  protected tabGroupsArrowUp(): void {
    this.adapterService.focusPreviousButton(this.tabGroups());
  }
}
