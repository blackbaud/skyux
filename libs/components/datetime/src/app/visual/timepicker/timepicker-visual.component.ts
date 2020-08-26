import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl
} from '@angular/forms';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'timepicker-visual',
  templateUrl: './timepicker-visual.component.html'
})
export class TimepickerVisualComponent implements OnInit {
  public reactiveForm: FormGroup;
  public disabled = false;
  public time12Hour = '8:30 PM';
  public time24Hour = '20:30';

  constructor(
    private formBuilder: FormBuilder,
    private themeSvc: SkyThemeService
  ) { }

  public get reactiveTime(): AbstractControl {
    return this.reactiveForm.get('time');
  }

  public setReactiveTime(time: string) {
    this.reactiveForm.setValue({'time': time});
  }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      time: new FormControl('2:15 PM', [Validators.required])

    });

    this.reactiveTime.statusChanges.subscribe((status: any) => {
      console.log('Reactive time status:', status);
    });

    this.reactiveTime.valueChanges.subscribe((value: any) => {
      console.log('Reactive time value:', value);
    });
  }

  public toggleDisabled(): void {
    this.disabled = !this.disabled;
  }

  public setSelectedHour(): void {
    this.time12Hour = '1:00 AM';
    this.time24Hour = '1:00';
    this.setReactiveTime('1:00 AM');
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
