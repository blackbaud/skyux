import { Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { SkyLogService } from '@skyux/core';

import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { SkyTabIndex } from './tab-index';
import { SkyTabComponent } from './tab.component';
import { SkyTabsetNavButtonType } from './tabset-nav-button-type';
import { SkyTabsetComponent } from './tabset.component';

const buttonTypeNext = 'next';
const buttonTypePrevious = 'previous';
const buttonTypeFinish = 'finish';

/**
 * Creates a button to navigate between tabs in a tabset when `tabStyle` is `"wizard"`.
 */
@Component({
  selector: 'sky-tabset-nav-button',
  templateUrl: './tabset-nav-button.component.html',
  standalone: false,
})
export class SkyTabsetNavButtonComponent implements OnDestroy {
  /**
   * The tabset wizard component to associate with the nav button.
   * @required
   */
  @Input()
  public get tabset(): SkyTabsetComponent | undefined {
    return this.#_tabset;
  }

  public set tabset(value: SkyTabsetComponent | undefined) {
    this.#_tabset = value;

    if (this.#currentTabsetSub) {
      this.#currentTabsetSub.unsubscribe();
    }

    if (value) {
      this.#currentTabsetSub = value.activeChange
        .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
        .subscribe((index: SkyTabIndex) => {
          this.#activeSkyTabIndex = index;
          this.#tabCount = this.#_tabset?.tabs?.length;
          this.#updateTabToSelect();
          this.#updateButtonVisibility();
          this.#updateButtonProperties();
        });
    } else {
      this.#logger.error(
        'The SkyTabsetNavButtonComponent requires a reference to the SkyTabsetComponent it controls.',
      );
    }
  }

  /**
   * The type of nav button to include.
   * @required
   */
  @Input()
  public get buttonType(): SkyTabsetNavButtonType | undefined {
    return this.#_buttonType;
  }

  public set buttonType(value: SkyTabsetNavButtonType | undefined) {
    this.#_buttonType = value;
    this.#updateTabToSelect();
    this.#updateButtonProperties();
    this.#updateButtonVisibility();

    if (value === buttonTypeFinish) {
      this.type = 'submit';
    } else {
      this.type = 'button';
    }
  }

  @HostBinding('attr.data-button-type')
  public get buttonTypeData(): SkyTabsetNavButtonType | undefined {
    return this.buttonType;
  }

  /**
   * The label to display on the nav button. The following are the defaults for each `buttonType`:
   * `next` = "Next", `previous` = "Previous", `finish` = "Finish"
   */
  @Input()
  public buttonText?: string | undefined;

  /**
   * Whether to disable the nav button.
   * Defaults to the disabled state of the next tab for `next`, the existence of a previous tab for `previous`,
   * and false for `finish`.
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = value;
  }

  public get disabled(): boolean | undefined {
    return this.#_disabled;
  }

  public buttonClassName: string | undefined;
  public isVisible = false;
  public type: 'submit' | 'button' = 'submit';
  public ariaControls: string | undefined;

  protected tabToSelect: SkyTabComponent | undefined;

  #_buttonType: SkyTabsetNavButtonType | undefined;
  #_disabled: boolean | undefined;
  #_tabset: SkyTabsetComponent | undefined;
  #activeIndexNumber: number | undefined;
  #activeSkyTabIndex: SkyTabIndex | undefined;
  #currentTabsetSub: Subscription | undefined;
  #logger: SkyLogService;
  #tabCount: number | undefined;
  #ngUnsubscribe = new Subject<void>();

  constructor(logger: SkyLogService) {
    this.#logger = logger;
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public buttonClick(): void {
    /* istanbul ignore else */
    if (this.tabToSelect && !this.tabToSelect.disabled && this.tabset) {
      this.tabset.active = this.tabToSelect.tabIndexValue;
    }
  }

  #updateButtonVisibility(): void {
    const isLastStep =
      !!this.#tabCount && this.#activeIndexNumber === this.#tabCount - 1;

    if (this.buttonType === buttonTypeFinish) {
      this.isVisible = isLastStep;
    } else if (this.buttonType === buttonTypeNext) {
      this.isVisible = !isLastStep;
    } else {
      this.isVisible = true;
    }
  }

  #updateButtonProperties(): void {
    if (
      this.buttonType === buttonTypeNext ||
      this.buttonType === buttonTypeFinish
    ) {
      this.buttonClassName = 'sky-btn-primary';
    } else {
      this.buttonClassName = 'sky-btn-default';
    }

    this.ariaControls = this.tabToSelect?.tabPanelId;
  }

  #updateTabToSelect(): void {
    if (this.tabset?.tabs) {
      const tabs = this.tabset.tabs.toArray();
      this.tabToSelect = undefined;

      // tab index can be a number or a string, but we need the actual number index
      this.#activeIndexNumber = tabs.findIndex(
        (tab) => tab.tabIndexValue === this.#activeSkyTabIndex,
      );

      /* istanbul ignore else */
      if (this.#activeIndexNumber !== undefined) {
        if (this.buttonType === buttonTypeNext) {
          this.tabToSelect = tabs[this.#activeIndexNumber + 1];
        } else if (this.buttonType === buttonTypePrevious) {
          this.tabToSelect = tabs[this.#activeIndexNumber - 1];
        }
      }
    }
  }
}
