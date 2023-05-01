import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss'],
})
export class InputBoxComponent implements OnInit {
  public errorField = new UntypedFormControl('', [Validators.required]);

  public ngOnInit(): void {
    this.errorField.markAsTouched();
  }

  public onActionClick(): void {
    console.log('click!');
  }
}
