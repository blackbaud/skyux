import {
  Component
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'toggle-switch-visual',
  templateUrl: './toggle-switch-visual.component.html'
})
export class ToggleSwitchVisualComponent {

  public formGroup: FormGroup;
  public showLabel = false;

  constructor(
    private formBuilder: FormBuilder,
    private themeSvc: SkyThemeService
  ) {
    this.formGroup = this.formBuilder.group({
      notifyByEmail: new FormControl(true)
    });

    setTimeout(() => {
      this.showLabel = true;
    }, 2000);
  }

  public onToggleDisabledClick(): void {
    const control = this.formGroup.get('notifyByEmail');

    if (control.disabled) {
      control.enable();
    } else {
      control.disable();
    }
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
