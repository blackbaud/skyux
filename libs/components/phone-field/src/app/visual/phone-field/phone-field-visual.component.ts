import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'phone-field-visual',
  templateUrl: './phone-field-visual.component.html'
})
export class PhoneFieldVisualComponent implements OnInit {

  public phoneNumber: string;

  public phoneNumberInputBox: string;

  public phoneForm: FormGroup;

  public phoneControl: FormControl;

  constructor(
    private themeSvc: SkyThemeService
  ) { }

  public ngOnInit() {
    this.phoneControl = new FormControl();
    this.phoneForm = new FormGroup({
      'phoneControl': this.phoneControl
    });
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
