import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyNavbarModule } from '@skyux/navbar';
import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  selector: 'sky-navbar-fixture',
  templateUrl: './navbar-harness-test.component.html',
  imports: [RouterModule, SkyDropdownModule, SkyNavbarModule],
})
export class NavbarHarnessTestComponent {
  protected onDropdownItemClick(buttonText: string): void {
    alert(buttonText + ' button clicked!');
  }
}
