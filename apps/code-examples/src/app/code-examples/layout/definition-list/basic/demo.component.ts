import { Component } from '@angular/core';
import { SkyDefinitionListModule } from '@skyux/layout';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyDefinitionListModule],
})
export class DemoComponent {
  protected items: { label: string; value?: string }[] = [
    {
      label: 'Field 1',
      value: 'Field 1 value',
    },
    {
      label: 'Field 2',
      value: 'Field 2 value',
    },
    {
      label: 'Field 3',
      value: undefined,
    },
    {
      label: 'Field 4',
      value: 'Field 4 value',
    },
  ];
}
