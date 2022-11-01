import { Component } from '@angular/core';

@Component({
  selector: 'app-key-info-demo',
  templateUrl: './key-info-demo.component.html',
})
export class KeyInfoDemoComponent {
  public layout = 'vertical';

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
