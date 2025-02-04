import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule, SkyTrimModule } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { SkyFormErrorModule } from '../form-error/form-error.module';
import { SkyFormErrorsModule } from '../form-error/form-errors.module';
import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyCheckboxGroupComponent } from './checkbox-group.component';
import { SkyCheckboxLabelTextLabelComponent } from './checkbox-label-text-label.component';
import { SkyCheckboxLabelComponent } from './checkbox-label.component';
import { SkyCheckboxComponent } from './checkbox.component';

@NgModule({
  declarations: [
    SkyCheckboxComponent,
    SkyCheckboxLabelComponent,
    SkyCheckboxLabelTextLabelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxGroupComponent,
    SkyFormErrorModule,
    SkyFormErrorsModule,
    SkyFormsResourcesModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyIdModule,
    SkyTrimModule,
    SkyThemeModule,
  ],
  exports: [
    SkyCheckboxComponent,
    SkyCheckboxLabelComponent,
    SkyCheckboxGroupComponent,
    SkyFormErrorModule,
  ],
})
export class SkyCheckboxModule {}
