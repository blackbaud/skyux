import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyIdModule, SkyResponsiveHostDirective } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { SkyTabIdService } from '../shared/tab-id.service';

import { SkyVerticalTabsetAdapterService } from './vertical-tabset-adapter.service';
import { SkyVerticalTabsetGroupService } from './vertical-tabset-group.service';
import { SkyVerticalTabsetService } from './vertical-tabset.service';

let nextId = 0;

@Component({
  selector: 'sky-vertical-tab',
  templateUrl: './vertical-tab.component.html',
  styleUrls: ['./vertical-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyIconModule,
    SkyIdModule,
    SkyResponsiveHostDirective,
    SkyStatusIndicatorModule,
  ],
})
export class SkyVerticalTabComponent {
  /**
   * Whether the tab is active when the tabset loads.
   * @default false
   */
  @Input()
  public set active(value: boolean | undefined) {
    if (value !== this.#_active) {
      this.#_active = value ?? false;

      if (this.#_active) {
        this.#tabsetService.activateTab(this);
      }
    }
  }

  public get active(): boolean {
    return this.#_active;
  }

  #_active = false;

  /**
   * The HTML element ID of the element that contains
   * the content that the vertical tab displays, which corresponds to the `tabId`. This property
   * [supports accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).
   * For more information about the `aria-controls` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-controls).
   * @deprecated Now that the vertical tabs provide aria labels automatically, this input is no longer necessary.
   */
  public readonly ariaControls = input<string | undefined>();

  /**
   * The ARIA role for the vertical tab
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the tab functions and what it controls. For information about how
   * an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/#roles).
   * @default "tab"
   * @deprecated Any other value than `tab` could lead to a poor user experience for users with assistive technology.
   * In the next major version, this property will be automatically set to `tab`.
   */
  public readonly ariaRole = input<string | undefined>();

  /**
   * Whether to disable the tab.
   */
  public readonly disabled = input<boolean | undefined>(false);

  /**
   * Whether to indicate that the tab has an error.
   * @internal This is used for sectioned forms and is not currently a supported design for pure vertical tabs.
   */
  public readonly errorIndicator = input<boolean | undefined>(false);

  /**
   * Whether to indicate that the tab has required content.
   * @internal This is used for sectioned forms and is not currently a supported design for pure vertical tabs.
   */
  public readonly requiredIndicator = input<boolean | undefined>(false);

  /**
   * Displays an item count alongside the tab header to indicate how many list items the tab contains.
   */
  public readonly tabHeaderCount = input<number | undefined>();

  /**
   * The tab header.
   * @required
   */
  public readonly tabHeading = input<string | undefined>();

  /**
   * Whether to display a chevron-right icon on the right hand side of the tab.
   * @internal
   */
  public readonly showTabRightArrow = input<boolean | undefined>();

  /**
   * The ID for the tab.
   * @deprecated Now that the vertical tabs provide aria labels automatically, this input is no longer necessary.
   */
  @Input()
  public set tabId(value: string | undefined) {
    this.#tabIdOrDefault = value || this.#defaultTabId;
    this.#tabIdSvc?.register(this.#defaultTabId, this.#tabIdOrDefault);
  }

  public get tabId(): string {
    return this.#tabIdOrDefault;
  }

  public set contentRendered(value: boolean) {
    this.#_contentRendered = value;

    /* istanbul ignore else */
    if (this.#_contentRendered) {
      // NOTE: Trigger another change detection cycle when the service marks
      // this tab as "rendered".
      setTimeout(() => {
        if (this.tabContent()) {
          this.#changeRef.markForCheck();
        }
      });
    }
  }

  public get contentRendered(): boolean {
    return this.#_contentRendered;
  }

  public index: number | undefined;

  public readonly isMobile = signal(false);

  public readonly tabButton = viewChild<ElementRef>('tabButton');
  public readonly tabContent = viewChild<ElementRef>('tabContentWrapper');

  public readonly groupService = inject(SkyVerticalTabsetGroupService, {
    optional: true,
  });

  protected readonly resolvedAriaRole = computed(
    () => this.ariaRole() ?? 'tab',
  );

  #_contentRendered = false;

  #tabIdOrDefault: string;

  #defaultTabId: string;

  readonly #adapterService = inject(SkyVerticalTabsetAdapterService);
  readonly #changeRef = inject(ChangeDetectorRef);
  readonly #tabsetService = inject(SkyVerticalTabsetService);
  readonly #tabIdSvc = inject(SkyTabIdService, { optional: true });

  constructor() {
    const destroyRef = inject(DestroyRef);

    this.#tabIdOrDefault = this.#defaultTabId = `sky-vertical-tab-${++nextId}`;
    this.tabId = this.#defaultTabId;

    this.isMobile.set(this.#tabsetService.isMobile());

    this.#tabsetService.switchingMobile
      .pipe(takeUntilDestroyed())
      .subscribe((mobile: boolean) => {
        this.isMobile.set(mobile);
        this.#changeRef.markForCheck();
      });

    this.#tabsetService.addTab(this);

    destroyRef.onDestroy(() => {
      this.#tabIdSvc?.unregister(this.#defaultTabId);
      this.#tabsetService.destroyTab(this);
    });
  }

  public activateTab(): void {
    if (!this.disabled()) {
      this.active = true;
      this.#tabsetService.activateTab(this);

      this.#changeRef.markForCheck();
    }
  }

  public focusButton(): void {
    this.#adapterService.focusButton(this.tabButton());
  }

  public tabButtonActivate(event: Event): void {
    this.activateTab();
    event.stopPropagation();
  }

  public tabButtonArrowLeft(event: Event): void {
    if (this.groupService) {
      this.groupService.messageStream.next({
        messageType: 'focus',
      });

      event.preventDefault();
    }
  }

  public tabDeactivated(): void {
    this.#changeRef.markForCheck();
  }
}
