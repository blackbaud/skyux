import { NgModule } from '@angular/core';

/* spell-checker:ignore lipsum */
import { LipsumComponent } from './lipsum.component';

@NgModule({
  declarations: [LipsumComponent],
  exports: [LipsumComponent],
})
export class LipsumModule {}
