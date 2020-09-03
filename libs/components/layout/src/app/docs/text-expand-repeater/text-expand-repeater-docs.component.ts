import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-text-expand-repeater-docs',
  templateUrl: './text-expand-repeater-docs.component.html'
})
export class TextExpandRepeaterDocsComponent {

  public repeaterData: string[] = [
    'Repeater item 1',
    'Repeater item 2',
    'Repeater item 3',
    'Repeater item 4',
    'Repeater item 5'
  ];

 }
