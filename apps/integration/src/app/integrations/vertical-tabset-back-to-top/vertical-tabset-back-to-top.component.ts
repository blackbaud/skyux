import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-vertical-tabset-back-to-top',
  templateUrl: './vertical-tabset-back-to-top.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalTabsetBackToTopComponent {
  public active = true;

  public group1Disabled = false;

  public group1Open = true;

  public group2Disabled = false;

  public group2Open = false;

  public group3Disabled = true;

  public group3Open = false;

  public maintainTabContent = false;

  public tabDisabled = true;

  public tabs = [
    {
      id: '1',
      heading: 'tab 1',
      content: 'Tab 1 content',
    },
    {
      id: '2',
      heading: 'tab 2',
      content: 'Tab 2 content',
    },
    {
      id: '3',
      heading: 'tab 3',
      content: 'Tab 3 content',
    },
  ];
}
