import { ModuleWithProviders, NgModule } from '@angular/core';

/**
 * @docsSection banana
 */
@NgModule({})
export class FooModule {
  public forRoot(): ModuleWithProviders<FooModule> {
    return {
      ngModule: FooModule,
      providers: [],
    };
  }
}
