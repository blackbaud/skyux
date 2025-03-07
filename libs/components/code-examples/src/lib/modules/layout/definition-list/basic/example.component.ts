import { Component } from '@angular/core';
import { SkyDefinitionListModule } from '@skyux/layout';

/**
 * @title Definition list with basic setup
 */
@Component({
  selector: 'app-layout-definition-list-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyDefinitionListModule],
})
export class LayoutDefinitionListBasicExampleComponent {
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
