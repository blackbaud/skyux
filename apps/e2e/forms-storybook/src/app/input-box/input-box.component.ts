import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss'],
  standalone: false,
})
export class InputBoxComponent implements OnInit {
  protected disabledField = new UntypedFormControl({
    disabled: true,
    value: 'Disabled value',
  });

  public errorField = new UntypedFormControl('', [Validators.required]);

  public ngOnInit(): void {
    this.errorField.markAsTouched();
  }

  public onActionClick(): void {
    console.log('click!');
  }
}
