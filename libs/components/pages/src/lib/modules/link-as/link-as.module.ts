import { NgModule } from '@angular/core';

import { LinkAsPipe } from './link-as.pipe';

@NgModule({
  imports: [LinkAsPipe],
  exports: [LinkAsPipe],
})
export class LinkAsModule {}
