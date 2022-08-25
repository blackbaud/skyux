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

    if (value) {
      if (this.buttonType === buttonTypeFinish) {
        this.#_tabset.hasFinishButton = true;
      }

      if (this.#currentSub) {
        this.#currentSub.unsubscribe();
      }

      this.#currentSub = this.#_tabset.activeChange
        .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
        .subscribe((index: SkyTabIndex) => {
          this.#activeIndex = index;
          this.#tabCount = this.#_tabset.tabs.length;
          this.#updateButtonVisibility();
          this.#updateButtonClassName();
          this.#updateAriaControls();
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
  public get buttonType(): SkyTabsetNavButtonType {
    return this.#_buttonType;
  }

  public set buttonType(value: SkyTabsetNavButtonType) {
    this.#_buttonType = value;
    this.#updateButtonClassName();

    if (value === buttonTypeFinish) {
      this.type = 'submit';
    } else {
      this.type = 'button';
    }
  }

  /**
   * Specifies the label to display on the nav button. The following are the defaults for each `buttonType`.
   * `next` = "Next", `previous` = "Previous"
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

    let tabToSelect: SkyTabComponent;

    switch (this.buttonType) {
      case buttonTypePrevious:
        tabToSelect = this.previousTab;
        break;
      case buttonTypeNext:
        tabToSelect = this.nextTab;
        break;
      /* istanbul ignore next */
      default:
        break;
    }

    return !tabToSelect || tabToSelect.disabled;
  }

  public buttonClassName: string;
  public isVisible = false;
  public type: 'submit' | 'button';
  public ariaControls: string;

  #_buttonType: SkyTabsetNavButtonType;
  #_disabled: boolean | undefined;
  #_tabset: SkyTabsetComponent;
  #activeIndex: SkyTabIndex;
  #currentSub: Subscription;
  #logger: SkyLogService;
  #tabCount: number;
  #ngUnsubscribe = new Subject<void>();

  private get selectedTab(): SkyTabComponent {
    let selectedTab: SkyTabComponent;

    if (this.#_tabset && this.#_tabset.tabs) {
      selectedTab = this.#_tabset.tabs.find(
        (tab) => tab.tabIndex === this.#_tabset.lastActiveTabIndex
      );
    }

    return selectedTab;
  }

  constructor(logger: SkyLogService) {
    this.#logger = logger;
  }

  private get nextTab(): SkyTabComponent {
    const selectedTab = this.selectedTab;

    if (selectedTab) {
      const tabs = this.#_tabset.tabs.toArray();
      return tabs[tabs.indexOf(selectedTab) + 1];
    }

    return undefined;
  }

  private get previousTab(): SkyTabComponent {
    const selectedTab = this.selectedTab;

    if (selectedTab) {
      const tabs = this.#_tabset.tabs.toArray();
      return tabs[tabs.indexOf(selectedTab) - 1];
    }

    return undefined;
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public buttonClick() {
    let tabToSelect: SkyTabComponent;

    switch (this.buttonType) {
      case buttonTypePrevious:
        tabToSelect = this.previousTab;
        break;
      case buttonTypeNext:
        tabToSelect = this.nextTab;
        break;
      /* istanbul ignore next */
      default:
        break;
    }

    /* istanbul ignore else */
    if (tabToSelect && !tabToSelect.disabled) {
      this.#_tabset.active = tabToSelect.tabIndex;
    }
  }

  #updateButtonVisibility(): void {
    const isLastStep = this.#activeIndex === this.#tabCount - 1;

    if (this.buttonType === buttonTypeFinish) {
      this.isVisible = isLastStep;
      return;
    }

    // Hide the next button on the last step only if a finish button exists.
    if (
      this.buttonType === buttonTypeNext &&
      isLastStep &&
      this.#_tabset.hasFinishButton
    ) {
      this.isVisible = false;
      return;
    }

    this.isVisible = true;
  }

  #updateButtonClassName(): void {
    if (
      (this.#_buttonType === buttonTypeNext ||
        this.#_buttonType === buttonTypeFinish) &&
      this.#_tabset?.hasFinishButton
    ) {
      this.buttonClassName = 'sky-btn-primary';
    } else {
      this.buttonClassName = 'sky-btn-default';
    }
  }

  #updateAriaControls(): void {
    if (this.#_buttonType === buttonTypePrevious) {
      this.ariaControls = this.previousTab?.tabPanelId;
    } else if (this.#_buttonType === buttonTypeNext) {
      this.ariaControls = this.nextTab?.tabPanelId;
    }
  }
}
