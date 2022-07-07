import { ComponentHarness } from '@angular/cdk/testing';

export abstract class SkyComponentHarness extends ComponentHarness {
  protected async getSkyId(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-sky-id');
  }
}
