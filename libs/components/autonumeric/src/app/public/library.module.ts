import { NgModule } from '@angular/core';
import { SkyAutonumericModule } from './modules/autonumeric';

export * from './modules/autonumeric';

@NgModule({
  exports: [
    SkyAutonumericModule
  ]
})
export class AutonumericLibraryModule {

}
