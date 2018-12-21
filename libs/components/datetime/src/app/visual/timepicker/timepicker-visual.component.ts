import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'timepicker-visual',
  templateUrl: './timepicker-visual.component.html'
})
export class TimepickerVisualComponent implements OnInit {
  public reactiveForm: FormGroup;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) { }

  public get reactiveTime(): AbstractControl {
    return this.reactiveForm.get('time');
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
      this.changeDetector.markForCheck();
    });
  }
}
