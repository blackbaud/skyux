import { Component } from '@angular/core';

@Component({
  selector: 'dropdown-visual',
  templateUrl: './dropdown-visual.component.html'
})
export class DropdownVisualComponent {
  public dropdownOpen = false;

  public click() {
    this.dropdownOpen = true;
  }
}
