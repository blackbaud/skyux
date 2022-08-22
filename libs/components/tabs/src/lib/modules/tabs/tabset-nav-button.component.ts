import { Component, Input } from '@angular/core';

import { SkyTabComponent } from './tab.component';
import { SkyTabsetNavButtonType } from './tabset-nav-button-type';
import { SkyTabsetComponent } from './tabset.component';

const buttonTypeNext = 'next';

const buttonTypePrevious = 'previous';

/**
 * @internal
 */
@Component({
  selector: 'sky-tabset-nav-button',
  templateUrl: './tabset-nav-button.component.html',
})
export class SkyTabsetNavButtonComponent {
  /**
   * Specifies the tabset wizard component to associate with the nav button.
   * @required
   */
  @Input()
  public tabset: SkyTabsetComponent;

  /**
   * Specifies the type of nav button to include.
   * @required
   */
  @Input()
  public buttonType: SkyTabsetNavButtonType;

  /**
   * Specifies the label to display on the nav button. The following are the defaults for each `buttonType`.
   * `next` = "Next", `previous` = "Previous"
   */
  @Input()
  public buttonText?: string | undefined;

  public get disabled(): boolean {
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

  private get selectedTab(): SkyTabComponent {
    let selectedTab: SkyTabComponent;

    if (this.tabset && this.tabset.tabs) {
      selectedTab = this.tabset.tabs.find(
        (tab) => tab.tabIndex === this.tabset.lastActiveTabIndex
      );
    }

    return selectedTab;
  }

  private get nextTab(): SkyTabComponent {
    const selectedTab = this.selectedTab;

    if (selectedTab) {
      const tabs = this.tabset.tabs.toArray();
      return tabs[tabs.indexOf(selectedTab) + 1];
    }

    return undefined;
  }

  private get previousTab(): SkyTabComponent {
    const selectedTab = this.selectedTab;

    if (selectedTab) {
      const tabs = this.tabset.tabs.toArray();
      return tabs[tabs.indexOf(selectedTab) - 1];
    }

    return undefined;
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
      this.tabset.active = tabToSelect.tabIndex;
    }
  }
}
