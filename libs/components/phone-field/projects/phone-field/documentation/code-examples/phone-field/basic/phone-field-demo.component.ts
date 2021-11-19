import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone-field-demo',
  templateUrl: './phone-field-demo.component.html',
  styleUrls: ['./phone-field-demo.component.scss'],
})
export class PhoneFieldDemoComponent implements OnInit {
  public phoneControl: FormControl;

  public phoneForm: FormGroup;

  public ngOnInit(): void {
    this.phoneControl = new FormControl();
    this.phoneForm = new FormGroup({
      phoneControl: this.phoneControl,
    });
  }
}
