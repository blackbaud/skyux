import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { LookupResultTemplatesDemoComponent } from './lookup-result-templates-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
  declarations: [LookupResultTemplatesDemoComponent],
  exports: [LookupResultTemplatesDemoComponent],
})
export class LookupResultTemplatesDemoModule {}
