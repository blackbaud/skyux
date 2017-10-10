import { Component } from '@angular/core';

import { HelpWidgetService } from '../../public/src/modules/shared';

@Component({
  selector: 'toggle-widget',
  templateUrl: './toggle-widget.component.html'
})
export class ToggleWidgetComponent {
  constructor(private widgetService: HelpWidgetService) { }

  public toggleWidget(): void {
    this.widgetService.toggleOpen();
  }
}
