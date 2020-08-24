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
  selector: 'checkbox-visual',
  templateUrl: './checkbox-visual.component.html'
})
export class CheckboxVisualComponent implements OnInit {

  public checkValue: boolean = true;

  public foo: boolean;

  public bar: boolean;

  public reactiveFormGroup: FormGroup;

  public required: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private themeSvc: SkyThemeService
  ) { }

  public ngOnInit(): void {
    this.reactiveFormGroup = this.formBuilder.group(
      { reactiveCheckbox: [ undefined ] }
    );
  }

  public toggleRequired(): void {
    this.required = !this.required;
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
