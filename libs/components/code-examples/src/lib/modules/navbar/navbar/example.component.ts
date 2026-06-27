import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyNavbarModule } from '@skyux/navbar';
import { SkyDropdownModule } from '@skyux/popovers';

/**
 * @title Navbar with basic setup
 */
@Component({
  selector: 'app-navbar-example',
  templateUrl: './example.component.html',
  imports: [RouterModule, SkyDropdownModule, SkyNavbarModule],
})
export class NavbarExampleComponent {
  public onItemClick(buttonText: string): void {
    alert(buttonText + ' button clicked!');
  }
}
