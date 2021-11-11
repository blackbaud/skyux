import { Component } from '@angular/core';

@Component({
  selector: 'app-help-inline-demo',
  templateUrl: './help-inline-demo.component.html',
})
export class HelpInlineDemoComponent {
  public onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
