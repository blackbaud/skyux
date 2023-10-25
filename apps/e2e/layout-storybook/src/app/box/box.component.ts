import { Component, inject } from '@angular/core';
import { FontLoadingService } from '@skyux/storybook';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent {
  public readonly boxTypes = [
    {
      name: 'Box',
      showHelp: false,
    },
    {
      name: 'Box with help',
      showHelp: true,
    },
  ];

  protected readonly ready$ = inject(FontLoadingService).ready();
}
