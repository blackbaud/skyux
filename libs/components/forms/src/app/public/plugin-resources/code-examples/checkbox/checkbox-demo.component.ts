import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-checkbox-demo',
  templateUrl: './checkbox-demo.component.html'
})
export class CheckboxDemoComponent {

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
      checked: true,
      icon: 'underline'
    }
  ];

  public iconCheckboxItems: any[] = [
    {
      label: 'Info icon checkbox 1',
      checked: true,
      icon: 'info'
    },
    {
      label: 'Disabled info icon checkbox 1',
      checked: true,
      disabled: true,
      icon: 'strikethrough'
    },
    {
      label: 'Success icon checkbox',
      checked: true,
      icon: 'star',
      checkboxType: 'success'
    },
    {
      label: 'Warning icon checkbox',
      checked: true,
      icon: 'exclamation-triangle',
      checkboxType: 'warning'
    },
    {
      label: 'Danger icon checkbox',
      checked: true,
      icon: 'ban',
      checkboxType: 'danger'
    }
  ];
}
