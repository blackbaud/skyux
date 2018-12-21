import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'datepicker-visual',
  templateUrl: './datepicker-visual.component.html'
})
export class DatepickerVisualComponent implements OnInit {
  public selectedDate: Date = new Date('4/4/2017');
  public reactiveForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public get reactiveDate(): AbstractControl {
    return this.reactiveForm.get('selectedDate');
  }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      selectedDate: new FormControl('4/4/2017', Validators.required)
    });

    this.reactiveDate.statusChanges.subscribe((status: any) => {
      console.log('Reactive date status:', status);
    });

    this.reactiveDate.valueChanges.subscribe((value: any) => {
      console.log('Reactive date value:', value);
    });
  }
}
