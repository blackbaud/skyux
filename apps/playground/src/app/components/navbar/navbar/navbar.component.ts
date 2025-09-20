import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyNavbarModule } from '@skyux/navbar';
import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
  imports: [SkyNavbarModule, SkyDropdownModule, RouterLink],
})
export class NavbarComponent {
  protected onItemClick(buttonText: string): void {
    alert(buttonText + ' button clicked!');
  }
}
