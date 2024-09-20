import { Component, inject } from '@angular/core';
import { FontLoadingService } from '@skyux/storybook/font-loading';

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
    {
      name: 'Box easy mode H2',
      useHeader: true,
      helpContent: 'Help',
    },
    {
      name: 'Box easy mode H3',
      useHeader: true,
      heading: 3,
    },
    {
      name: 'Box easy mode H4',
      useHeader: true,
      heading: 4,
      helpContent: 'Help',
    },
    {
      name: 'Box easy mode H5',
      useHeader: true,
      heading: 5,
    },
  ];

  protected readonly ready$ = inject(FontLoadingService).ready();
}
