import {
  NgModule
} from '@angular/core';

import {
  FooComponent
} from './foo.component';

import {
  FooDirective
} from './foo.directive';

import {
  FooPipe
} from './foo.pipe';

import {
  FooUserComponent
} from './foo-user.component';

import {
  FooUserPipe
} from './foo-user.pipe';

@NgModule({
  declarations: [
    FooComponent,
    FooDirective,
    FooPipe,
    FooUserComponent,
    FooUserPipe
  ]
})
export class FooModule { }
