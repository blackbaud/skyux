import { NgModule } from '@angular/core';

import { LibraryConfigService } from './config.service';

@NgModule({
  providers: [
    LibraryConfigService
  ]
})
export class LibrarySharedModule { }
