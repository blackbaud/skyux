import {
  Component,
  OnInit
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
  selector: 'colorpicker-visual',
  templateUrl: './colorpicker-visual.component.html'
})
export class ColorpickerVisualComponent implements OnInit {
  public color1: any;
  public selectedColor1: string = '#2889e5';
  public selectedOutputFormat1: string = 'rgba';
  public presetColors1 = [
    '#333333',
    '#888888',
    '#EFEFEF',
    '#FFF',
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
    '#A1B1A7',
    '#68AFEF'
  ];

  public color2: any;
  public selectedColor2: string = '#2889e5';
  public selectedOutputFormat2: string = 'rgba';
  public presetColors2 = [
    '#333333',
    '#888888',
    '#EFEFEF',
    '#FFF',
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
    '#A1B1A7',
    '#68AFEF'
  ];

  public color3: any;
  public selectedColor3: string = '#2889e5';
  public selectedOutputFormat3: string = 'rgba';
  public presetColors3 = [
    '#333333',
    '#888888',
    '#EFEFEF',
    '#FFF',
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
    '#A1B1A7',
    '#68AFEF'
  ];

  public myForm: FormGroup;
  public disabled: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private themeSvc: SkyThemeService
  ) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      colorpicker: new FormControl('')
    });
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

  public onToggleAbleColorpicker(): void {
    if (this.myForm.controls['colorpicker'].disabled) {
      this.myForm.controls['colorpicker'].enable();
    } else {
      this.myForm.controls['colorpicker'].disable();
    }
  }
}
