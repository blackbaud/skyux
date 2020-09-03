import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-checkbox-docs',
  templateUrl: './checkbox-docs.component.html'
})
export class CheckboxDocsComponent {

  public checkboxItems: any[] = [
    {
      label: 'Checkbox 1',
      checked: true,
      disabled: false
    },
    {
      label: 'Checkbox 2',
      checked: false,
      disabled: false
    },
    {
      label: 'Checkbox 3 is disabled',
      disabled: true
    }
  ];

  public iconCheckboxGroup: any[] = [
    {
      label: 'Bold',
      checked: true,
      icon: 'bold'
    },
    {
      label: 'Italic',
      checked: false,
      icon: 'italic'
    },
    {
      label: 'Underline',
      checked: false,
      icon: 'underline'
    }
  ];

}
