import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss'],
})
export class InputBoxComponent implements OnInit, AfterViewInit {
  public errorField: FormControl;

  public errorForm: FormGroup;

  public errorNgModelValue: string;

  public myValue = 'Value';

  @ViewChild('errorNgModel')
  public errorNgModel: NgModel;

  public ngOnInit(): void {
    this.errorField = new FormControl('', [Validators.required]);

    this.errorField.markAsTouched();

    this.errorForm = new FormGroup({
      errorFormField: new FormControl('', [Validators.required]),
    });

    this.errorForm.controls['errorFormField'].markAsTouched();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.errorNgModel.control.markAsTouched();
    });
  }

  public onActionClick(): void {
    console.log('click!');
  }
}
