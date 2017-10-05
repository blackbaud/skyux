import { Component, Input, OnDestroy } from '@angular/core';

import { HelpWidgetService } from '../shared';
@Component({
  selector: 'bb-help-key',
  template: ''
})
export class HelpKeyComponent implements OnDestroy {
  private _helpKey: string = '';

  @Input()
  set helpKey(helpKey: string) {
    this._helpKey = helpKey;
    this.widgetService.setCurrentHelpKey(this.helpKey);
  }

  get helpKey(): string {
    return this._helpKey;
  }

  constructor(private widgetService: HelpWidgetService) { }

  public ngOnDestroy() {
    this.widgetService.setHelpKeyToDefault();
  }
}
