import { Directive, OnInit, OnDestroy } from '@angular/core';

import { HelpWidgetService } from '../shared';

@Directive({
  selector: '[bbHelpDisableWidget]'
})
export class BBHelpDisableWidgetDirective implements OnInit, OnDestroy {
constructor(
  private widgetService: HelpWidgetService) { }

  public ngOnInit() {
    this.widgetService.disableWidget();
  }

  public ngOnDestroy() {
    this.widgetService.enableWidget();
  }
}
