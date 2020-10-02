import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-definition-list-demo',
  templateUrl: './definition-list-demo.component.html'
})
export class DefinitionListDemoComponent {

  public items: { label: string, value: string }[] = [
    {
      label: 'Field 1',
      value: 'Field 1 value'
    },
    {
      label: 'Field 2',
      value: 'Field 2 value'
    },
    {
      label: 'Field 3',
      value: undefined
    },
    {
      label: 'Field 4',
      value: 'Field 4 value'
    }
  ];

}
