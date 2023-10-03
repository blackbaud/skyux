import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyPhoneFieldModule } from '@skyux/phone-field';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyPhoneFieldModule,
  ],
})
export class DemoComponent {
  protected phoneControl: FormControl;
  protected phoneForm: FormGroup;

  constructor() {
    this.phoneControl = new FormControl();
    this.phoneForm = new FormGroup({
      phoneControl: this.phoneControl,
    });
  }
}
