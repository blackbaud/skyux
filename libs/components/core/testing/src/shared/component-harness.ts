import { ComponentHarness } from '@angular/cdk/testing';

export abstract class SkyComponentHarness extends ComponentHarness {
  protected async getSkyId(): Promise<string | null> {
    return (await this.host()).getAttribute('data-sky-id');
  }
}
