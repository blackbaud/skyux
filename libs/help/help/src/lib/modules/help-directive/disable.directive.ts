import { Directive, OnDestroy, OnInit } from '@angular/core';

import { HelpWidgetService } from '../shared/widget.service';

@Directive({
  selector: '[bbHelpDisableWidget]',
})
export class BBHelpDisableWidgetDirective implements OnInit, OnDestroy {
  constructor(private widgetService: HelpWidgetService) {}

  public ngOnInit() {
    this.widgetService.disableWidget();
  }

  public ngOnDestroy() {
    this.widgetService.enableWidget();
  }
}
