import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs-demo',
  templateUrl: './tabs-demo.component.html',
})
export class TabsDemoComponent {
  public showTab3 = true;

  public onNewTabClick(): void {
    alert('Add tab clicked!');
  }
}
