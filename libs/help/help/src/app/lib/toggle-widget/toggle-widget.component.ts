import {
  Component
} from '@angular/core';

import {
  HelpWidgetService
} from '../../public/public_api';

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
