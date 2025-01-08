import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyEmailValidationModule } from '@skyux/validation';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyEmailValidationModule,
    SkyInputBoxModule,
  ],
})
export class DemoComponent {
  protected demoModel: {
    emailAddress?: string;
  } = {};
}
