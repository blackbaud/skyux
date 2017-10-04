import { Component } from '@angular/core';

import { HelpWindowRef } from '../window-ref';

@Component({
  selector: 'toggle-widget',
  templateUrl: './toggle-widget.component.html'
})
export class ToggleWidgetComponent {
  constructor(private windowRef: HelpWindowRef) { }

  public toggleWidget(): void {
    this.windowRef.nativeWindow.BBHELP.HelpWidget.toggleOpen();
  }
}
