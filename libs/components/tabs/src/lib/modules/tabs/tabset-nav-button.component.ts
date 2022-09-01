import { Component, Input, OnDestroy } from '@angular/core';
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
 * @internal
 */
@Component({
  selector: 'sky-tabset-nav-button',
  templateUrl: './tabset-nav-button.component.html',
})
export class SkyTabsetNavButtonComponent implements OnDestroy {
  /**
   * Specifies the tabset wizard component to associate with the nav button.
   * @required
   */
  @Input()
  public set tabset(value: SkyTabsetComponent) {
    this.#_tabset = value;

    if (this.#currentTabsetSub) {
      this.#currentTabsetSub.unsubscribe();
    }

    if (value) {
      if (this.#_buttonType === buttonTypeFinish) {
        this.#_tabset.hasFinishButton = true;
      }

      this.#currentTabsetSub = this.#_tabset.activeChange
        .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
        .subscribe((index: SkyTabIndex) => {
          this.#activeSkyTabIndex = index;
          this.#tabCount = this.#_tabset.tabs.length;
          this.#updateTabToSelect();
          this.#updateButtonVisibility();
          this.#updateButtonProperties();
        });
    } else {
      this.#logger.error(
        'The SkyTabsetNavButtonComponent requires a reference to the SkyTabsetComponent it controls.'
      );
    }
  }

  /**
   * Specifies the type of nav button to include.
   * @required
   */
  @Input()
  public get buttonType(): SkyTabsetNavButtonType | string {
    return this.#_buttonType;
  }

  public set buttonType(value: SkyTabsetNavButtonType | string) {
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

  /**
   * Specifies the label to display on the nav button. The following are the defaults for each `buttonType`.
   * `next` = "Next", `previous` = "Previous", `finish` = "Finish"
   */
  @Input()
  public buttonText?: string | undefined;

  /**
   * Indicates whether to disable the nav button.
   * Defaults to the disabled state of the next tab for `next`, the existence of a previous tab for `previous`,
   * and false for `finish`.
   */
  @Input()
  public set disabled(value: boolean) {
    this.#_disabled = value;
  }

  public get disabled(): boolean {
    if (this.#_disabled !== undefined) {
      return this.#_disabled;
    } else if (this.#_buttonType === buttonTypeFinish) {
      return false;
    }

    return !this.#tabToSelect || this.#tabToSelect.disabled;
  }

  public buttonClassName: string | undefined;
  public isVisible = false;
  public type: 'submit' | 'button';
  public ariaControls: string | undefined;

  #_buttonType: SkyTabsetNavButtonType | string;
  #_disabled: boolean | undefined;
  #_tabset: SkyTabsetComponent;
  #activeIndexNumber: number;
  #activeSkyTabIndex: SkyTabIndex;
  #currentTabsetSub: Subscription;
  #logger: SkyLogService;
  #tabCount: number;
  #tabToSelect: SkyTabComponent | undefined;
  #ngUnsubscribe = new Subject<void>();

  constructor(logger: SkyLogService) {
    this.#logger = logger;
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public buttonClick() {
    /* istanbul ignore else */
    if (this.#tabToSelect && !this.#tabToSelect.disabled) {
      this.#_tabset.active = this.#tabToSelect.tabIndex;
    }
  }

  #updateButtonVisibility(): void {
    const isLastStep = this.#activeIndexNumber === this.#tabCount - 1;

    if (this.#_buttonType === buttonTypeFinish) {
      this.isVisible = isLastStep;
      return;
    }

    // Hide the next button on the last step only if a finish button exists.
    if (
      this.#_buttonType === buttonTypeNext &&
      isLastStep &&
      this.#_tabset.hasFinishButton
    ) {
      this.isVisible = false;
      return;
    }

    this.isVisible = true;
  }

  #updateButtonProperties(): void {
    if (
      (this.#_buttonType === buttonTypeNext ||
        this.#_buttonType === buttonTypeFinish) &&
      this.#_tabset?.hasFinishButton
    ) {
      this.buttonClassName = 'sky-btn-primary';
    } else {
      this.buttonClassName = 'sky-btn-default';
    }

    this.ariaControls = this.#tabToSelect?.tabPanelId;
  }

  #updateTabToSelect(): void {
    if (this.#_tabset?.tabs) {
      const tabs = this.#_tabset.tabs.toArray();
      this.#tabToSelect = undefined;

      // tab index can be a number or a string, but we need the actual number index
      this.#activeIndexNumber = tabs.findIndex(
        (tab) => tab.tabIndex === this.#activeSkyTabIndex
      );

      /* istanbul ignore else */
      if (this.#activeIndexNumber !== undefined) {
        if (this.#_buttonType === buttonTypeNext) {
          this.#tabToSelect = tabs[this.#activeIndexNumber + 1];
        } else if (this.#_buttonType === buttonTypePrevious) {
          this.#tabToSelect = tabs[this.#activeIndexNumber - 1];
        }
      }
    }
  }
}
