import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  FooComponent,
  SkyFooNonStandaloneComponent,
  SkyFooStandaloneComponent,
} from './foo.component';

@NgModule({})
export class FooModule {
  public forRoot(): ModuleWithProviders<FooModule> {
    return {
      ngModule: FooModule,
      providers: [],
    };
  }
}

/**
 * This module should automatically generate values for docsIncludeIds based on
 * its exports.
 */
@NgModule({
  declarations: [SkyFooNonStandaloneComponent],
  imports: [FooComponent, SkyFooStandaloneComponent],
  exports: [SkyFooStandaloneComponent, SkyFooNonStandaloneComponent],
})
export class FooWithExportsModule {}
