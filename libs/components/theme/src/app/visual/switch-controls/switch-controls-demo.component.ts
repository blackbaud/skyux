import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'app-switch-controls-demo',
  templateUrl: './switch-controls-demo.component.html'
})
export class SwitchControlsDemoComponent implements OnInit {

  public myForm: FormGroup;

  public checkboxOptions: any[] = [
    { label: 'Checked Checkbox', checked: true, disabled: false },
    { label: 'Unhecked Checkbox', checked: false, disabled: false },
    { label: 'Disabled Checkbox', checked: false, disabled: true },
    { label: 'Disabled Checked Checkbox', checked: true, disabled: true }
  ];

  public checkboxIconGroupOptions: any[] = [
    { label: 'Bold', checked: true, icon: 'bold', disabled: false },
    { label: 'Italicized', checked: false, icon: 'italic', disabled: false },
    { label: 'Underlined', checked: false, icon: 'underline', disabled: false },
    { label: 'Indent', icon: 'indent', checked: false, disabled: true },
    { label: 'Outdent', icon: 'outdent', checked: true, disabled: true }
  ];

  public radioGroupIconOptions: any[] = [
    { name: 'Left align', value: '1', icon: 'align-left', disabled: false },
    { name: 'Center align', value: '2', icon: 'align-center', disabled: false },
    { name: 'Right align', value: '3', icon: 'align-right', disabled: false }
  ];

  public radioGroupIconDisabledOptions: any[] = [
    { name: 'Indent', value: '1', icon: 'indent', disabled: true },
    { name: 'Outdent', value: '2', icon: 'outdent', disabled: true }
  ];

  public radioOptions: any[] = [
    { name: 'Selected radio button', value: '1', disabled: false },
    { name: 'Unselected radio button', value: '2', disabled: false },
    { name: 'Disabled radio button', value: '3', disabled: true }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private themeSvc: SkyThemeService
  ) { }

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      radioControl: this.radioOptions[0].name,
      radioIconGroupControl: this.radioGroupIconOptions[0].name,
      radioIconGroupDisabledControl: this.radioGroupIconDisabledOptions[0].name
    });
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
