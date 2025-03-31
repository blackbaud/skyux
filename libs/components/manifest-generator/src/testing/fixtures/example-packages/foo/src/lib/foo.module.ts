import { ModuleWithProviders, NgModule } from '@angular/core';

@NgModule({})
export class FooModule {
  public forRoot(): ModuleWithProviders<FooModule> {
    return {
      ngModule: FooModule,
      providers: [],
    };
  }
}
