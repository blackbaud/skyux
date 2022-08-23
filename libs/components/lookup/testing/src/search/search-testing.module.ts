import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkySearchModule } from '@skyux/lookup';

@NgModule({
  exports: [NoopAnimationsModule, SkySearchModule],
})
export class SkySearchTestingModule {}
