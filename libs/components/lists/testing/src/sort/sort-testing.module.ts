import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkySortModule } from '@skyux/lists';

@NgModule({
  imports: [NoopAnimationsModule],
  exports: [SkySortModule],
})
export class SkySortTestingModule {}
