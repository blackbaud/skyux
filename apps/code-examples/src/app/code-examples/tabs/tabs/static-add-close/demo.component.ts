import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyTabsModule } from '@skyux/tabs';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [CommonModule, SkyTabsModule],
})
export class DemoComponent {
  protected showTab3 = true;

  protected onNewTabClick(): void {
    alert('Add tab clicked!');
  }
}
