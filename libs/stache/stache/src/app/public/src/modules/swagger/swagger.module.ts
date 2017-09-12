import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheSwaggerComponent } from './swagger.component';

require('style-loader!swagger-ui-dist/swagger-ui.css');

@NgModule({
  declarations: [
    StacheSwaggerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheSwaggerComponent
  ]
})
export class StacheSwaggerModule { }
