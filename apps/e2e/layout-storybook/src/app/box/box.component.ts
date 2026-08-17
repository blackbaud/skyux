import { Component } from '@angular/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
  standalone: false,
})
export class BoxComponent {
  public readonly boxTypes = [
    {
      name: 'Box H2',
      helpContent: 'Help',
    },
    {
      name: 'Box H3',
      heading: 3,
    },
    {
      name: 'Box H4',
      heading: 4,
      helpContent: 'Help',
    },
    {
      name: 'Box H5',
      heading: 5,
    },
  ];
}
