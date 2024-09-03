import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';

import { SkyPhoneFieldModule } from '../phone-field.module';

import { PhoneFieldInputBoxTestComponent } from './phone-field-input-box.component.fixture';
import { PhoneFieldReactiveTestComponent } from './phone-field-reactive.component.fixture';
import { PhoneFieldTestComponent } from './phone-field.component.fixture';

@NgModule({
  declarations: [
    PhoneFieldInputBoxTestComponent,
    PhoneFieldReactiveTestComponent,
    PhoneFieldTestComponent,
  ],
  imports: [
    SkyPhoneFieldModule,
    SkyInputBoxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SkyInlineFormFixtureModule {}
