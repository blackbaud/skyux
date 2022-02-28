import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

import { SkyLibResourcesService } from '@skyux/i18n';

import { forkJoin } from 'rxjs';

import { take } from 'rxjs/operators';

import { SkyTabsetComponent } from './tabset.component';

import { SkyTabComponent } from './tab.component';

const buttonTypeNext = 'next';

const buttonTypePrevious = 'previous';

/**
 * @internal
 */
@Component({
  selector: 'sky-tabset-nav-button',
  templateUrl: './tabset-nav-button.component.html',
})
export class SkyTabsetNavButtonComponent implements AfterViewInit {
  @Input()
  public tabset: SkyTabsetComponent;

  @Input()
  public buttonType: string;

  @Input()
  public set buttonText(value: string) {
    this._buttonText = value;
  }

  public get buttonText(): string {
    if (this._buttonText) {
      return this._buttonText;
    }

    switch (this.buttonType) {
      case buttonTypePrevious:
        return this.previousButtonText;
      case buttonTypeNext:
        return this.nextButtonText;
      /* istanbul ignore next */
      default:
        return '';
    }
  }

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

  private _buttonText: string;
  private previousButtonText: string;
  private nextButtonText: string;

  constructor(
    private resourceService: SkyLibResourcesService,
    private changeDetector: ChangeDetectorRef
  ) {}

  public ngAfterViewInit() {
    forkJoin([
      this.resourceService.getString('skyux_tabs_navigator_previous'),
      this.resourceService.getString('skyux_tabs_navigator_next'),
    ])
      .pipe(take(1))
      .subscribe((resources) => {
        this.previousButtonText = resources[0];
        this.nextButtonText = resources[1];
        this.changeDetector.detectChanges();
      });
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
