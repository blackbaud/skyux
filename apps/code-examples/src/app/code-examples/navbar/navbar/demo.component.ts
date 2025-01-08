import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyNavbarModule } from '@skyux/navbar';
import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [RouterModule, SkyDropdownModule, SkyNavbarModule],
})
export class DemoComponent {
  protected onDropdownItemClick(buttonText: string): void {
    alert(buttonText + ' button clicked!');
  }
}
