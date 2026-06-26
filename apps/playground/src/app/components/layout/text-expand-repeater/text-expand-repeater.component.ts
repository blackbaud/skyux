import { Component } from '@angular/core';

@Component({
  selector: 'app-text-expand-repeater',
  templateUrl: './text-expand-repeater.component.html',
  standalone: false,
})
export class TextExpandRepeaterComponent {
  public repeaterData: string[] = [
    'Repeater item 1',
    'Repeater item 2',
    'Repeater item 3',
    'Repeater item 4',
    'Repeater item 5',
  ];
}
