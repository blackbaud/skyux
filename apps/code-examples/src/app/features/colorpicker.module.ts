import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ColorpickerDemoComponent as ColorpickerBasicDemoComponent } from '../code-examples/colorpicker/colorpicker/basic/colorpicker-demo.component';
import { ColorpickerDemoModule as ColorpickerBasicDemoModule } from '../code-examples/colorpicker/colorpicker/basic/colorpicker-demo.module';
import { ColorpickerDemoComponent as ColorpickerProgrammaticDemoComponent } from '../code-examples/colorpicker/colorpicker/programmatic/colorpicker-demo.component';
import { ColorpickerDemoModule as ColorpickerProgrammaticDemoModule } from '../code-examples/colorpicker/colorpicker/programmatic/colorpicker-demo.module';

const routes: Routes = [
  {
    path: 'basic',
    component: ColorpickerBasicDemoComponent,
  },
  {
    path: 'programmatic',
    component: ColorpickerProgrammaticDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColorpickerFeatureRoutingModule {}

@NgModule({
  imports: [
    ColorpickerFeatureRoutingModule,
    ColorpickerBasicDemoModule,
    ColorpickerProgrammaticDemoModule,
  ],
})
export class ColorpickerFeatureModule {}
