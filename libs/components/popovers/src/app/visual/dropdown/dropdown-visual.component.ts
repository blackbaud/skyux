import { Component } from '@angular/core';

@Component({
  selector: 'dropdown-visual',
  templateUrl: './dropdown-visual.component.html'
})
export class DropdownVisualComponent {
  public dropdownOpen = false;

 public colors: any[] = [
    { name: 'Red' },
    { name: 'Blue' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Yellow' },
    { name: 'Brown' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Black' },
    { name: 'Teal' },
    { name: 'Chartrouse' },
    { name: 'Salmon' },
    { name: 'Beige' },
    { name: 'Walnut' },
    { name: 'Perrywinkle' },
    { name: 'Fire truck red' },
    { name: 'Grey' },
    { name: 'Aqua' },
    { name: 'Cream' },
    { name: 'Violet' },
    { name: 'Hunter green' }
  ];

  public click() {
    this.dropdownOpen = true;
  }
}
