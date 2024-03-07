import { NgModule } from '@angular/core';

import { provideConfirmTesting } from './provider';

@NgModule({
  providers: [provideConfirmTesting()],
})
export class SkyConfirmTestingModule {}
