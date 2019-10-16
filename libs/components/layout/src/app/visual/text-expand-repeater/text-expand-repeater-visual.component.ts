import { Component } from '@angular/core';

@Component({
  selector: 'text-expand-repeater-visual',
  templateUrl: './text-expand-repeater-visual.component.html'
})
export class TextExpandRepeaterVisualComponent {

  public basicNames: string[] = [
    'bob',
    'john'
  ];

  public complexData: {
    firstName: string;
    lastName: string;
    role: string;
  }[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      role: 'Admin'
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'Admin'
    }
  ];

}
