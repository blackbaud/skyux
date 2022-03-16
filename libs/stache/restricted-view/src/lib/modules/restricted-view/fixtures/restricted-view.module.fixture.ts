import {
  NgModule
} from '@angular/core';

import {
  SkyRestrictedViewModule
} from '../restricted-view.module';

import {
  RestrictedViewTestComponent
} from './restricted-view.component.fixture';

@NgModule({
  imports: [
    SkyRestrictedViewModule
  ],
  declarations: [
    RestrictedViewTestComponent
  ]
})
export class RestrictedViewFixtureModule { }
