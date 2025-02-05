import { Component } from '@angular/core';
import { SkyTabsModule } from '@skyux/tabs';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyTabsModule],
})
export class DemoComponent {
  protected showTab3 = true;

  public onNewTabClick(): void {
    alert('Add tab clicked!');
  }
}
