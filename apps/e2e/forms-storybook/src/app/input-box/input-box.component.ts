import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl, Validators } from '@angular/forms';

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

  protected readonly characterLimitUnderField = new FormControl('Under');
  protected readonly characterLimitAtField = new FormControl('0123456789');
  protected readonly characterLimitLongLabelField = new FormControl('Value');
  protected readonly characterLimitOverField = new FormControl(
    'Over the limit',
  );

  public errorField = new UntypedFormControl('', [Validators.required]);

  public ngOnInit(): void {
    this.errorField.markAsTouched();
  }

  public onActionClick(): void {
    console.log('click!');
  }
}
