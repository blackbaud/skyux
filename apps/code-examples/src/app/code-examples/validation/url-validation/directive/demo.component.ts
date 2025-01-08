import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  SkyUrlValidationModule,
  SkyUrlValidationOptions,
} from '@skyux/validation';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyUrlValidationModule,
  ],
})
export class DemoComponent {
  protected demoModel: {
    url?: string;
  } = {};

  protected skyUrlValidationOptions: SkyUrlValidationOptions = {
    rulesetVersion: 2,
  };
}
