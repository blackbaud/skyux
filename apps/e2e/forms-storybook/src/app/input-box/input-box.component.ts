import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UntypedFormControl, Validators } from '@angular/forms';
import { FontLoadingService } from '@skyux/storybook';

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

  protected ready = toSignal(inject(FontLoadingService).ready(true));

  public ngOnInit(): void {
    this.errorField.markAsTouched();
  }

  public onActionClick(): void {
    console.log('click!');
  }
}
