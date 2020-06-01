import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  FormControl,
  NgModel,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  SkyFluidGridGutterSize
} from '@skyux/layout';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'input-box-visual',
  templateUrl: './input-box-visual.component.html',
  styleUrls: ['./input-box-visual.component.scss']
})
export class InputBoxVisualComponent implements OnInit, AfterViewInit {

  public gutterSize = SkyFluidGridGutterSize.Medium;

  public errorField: FormControl;

  public errorForm: FormGroup;

  public errorNgModelValue: string;

  @ViewChild('errorNgModel')
  public errorNgModel: NgModel;

  constructor(private themeSvc: SkyThemeService) { }

  public ngOnInit(): void {
    this.errorField = new FormControl(
      '',
      [
        Validators.required
      ]
    );

    this.errorField.markAsTouched();

    this.errorForm = new FormGroup({
      errorFormField: new FormControl(
        '',
        [
          Validators.required
        ]
      )
    });

    this.errorForm.controls['errorFormField'].markAsTouched();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.errorNgModel.control.markAsTouched();
    });
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
