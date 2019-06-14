import {
  Component
} from '@angular/core';

import {
  HelpWidgetService
} from '../../public';

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
