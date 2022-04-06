import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-demo',
  templateUrl: './navbar-demo.component.html',
})
export class NavbarDemoComponent {
  public onDropdownItemClick(buttonText: string): void {
    alert(buttonText + ' button clicked!');
  }
}
