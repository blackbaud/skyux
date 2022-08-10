import { Component } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
})
export class ToggleSwitchComponent {
  public showInlineHelp = false;

  public onToggleInlineHelpClick(): void {
    this.showInlineHelp = !this.showInlineHelp;
  }
}
