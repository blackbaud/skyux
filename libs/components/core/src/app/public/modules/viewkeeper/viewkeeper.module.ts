import {
  NgModule
} from '@angular/core';

import {
  SkyViewkeeperDirective
} from './viewkeeper.directive';

import {
  SkyViewkeeperService
} from './viewkeeper.service';

import {
  MutationObserverService
} from '../mutation/mutation-observer-service';

@NgModule({
  declarations: [
    SkyViewkeeperDirective
  ],
  exports: [
    SkyViewkeeperDirective
  ],
  providers: [
    SkyViewkeeperService,
    MutationObserverService
  ]
})
export class SkyViewkeeperModule { }
