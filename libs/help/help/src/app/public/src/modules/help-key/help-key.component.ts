import { Component, Input, OnDestroy } from '@angular/core';

import { HelpWidgetService } from '../shared';
@Component({
  selector: 'bb-help-key',
  template: ''
})
export class HelpKeyComponent implements OnDestroy {
  private _helpKey: string = '';
  private _pageDefaultKey: string = '';

  @Input()
  set pageDefaultKey(defaultKey: string) {
    this._pageDefaultKey = defaultKey;
    this.widgetService.setPageDefaultKey(this.pageDefaultKey);
  }

  get pageDefaultKey(): string {
    return this._pageDefaultKey;
  }

  @Input()
  set helpKey (helpKey: string) {
    this._helpKey = helpKey;
    if (!this.pageDefaultKey) {
      this.widgetService.setCurrentHelpKey(this.helpKey);
    }
  }

  get helpKey(): string {
    return this._helpKey;
  }

  constructor(
    private widgetService: HelpWidgetService) { }

  public ngOnDestroy() {
    if (this.pageDefaultKey || !this.widgetService.pageDefaultKey) {
      this.widgetService.setHelpKeyToGlobalDefault();
    } else {
      this.widgetService.setHelpKeyToPageDefault();
    }
  }
}
