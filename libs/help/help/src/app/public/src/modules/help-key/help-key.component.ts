import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { HelpWidgetService } from '../shared';
@Component({
  selector: 'bb-help-key',
  template: ''
})
export class HelpKeyComponent implements OnInit, OnDestroy {
  @Input()
  public helpKey: string;

  constructor(private widgetService: HelpWidgetService) { }

  public ngOnInit() {
    this.widgetService.setCurrentHelpKey(this.helpKey);
  }

  public ngOnDestroy() {
    this.widgetService.setHelpKeyToDefault();
  }
}
