import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyColorpickerOutput } from '@skyux/colorpicker';

@Component({
  selector: 'app-colorpicker-demo',
  templateUrl: './colorpicker-demo.component.html',
})
export class ColorpickerDemoComponent implements OnInit {
  public reactiveForm: FormGroup;

  public swatches: string[] = [
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
  ];

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.createForm();
  }

  public onSelectedColorChanged(args: SkyColorpickerOutput): void {
    console.log('Reactive form color changed:', args);
  }

  public submit(): void {
    const controlValue = this.reactiveForm.get('favoriteColor').value;
    const favoriteColor: string = controlValue.hex || controlValue;
    alert('Your favorite color is: \n' + favoriteColor);
  }

  private createForm(): void {
    this.reactiveForm = this.formBuilder.group({
      favoriteColor: new FormControl('#f00'),
    });
  }
}
