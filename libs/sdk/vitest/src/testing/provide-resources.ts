import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService, SkyLibResourcesService } from '@skyux/i18n';
import { Observable } from 'rxjs';

export type GetStringFn = (
  resourceKey: string,
  ...resourceArgs: unknown[]
) => Observable<string>;

export function provideAppResources(getString: GetStringFn): void {
  TestBed.configureTestingModule({
    providers: [{ provide: SkyAppResourcesService, useValue: { getString } }],
  });
}

export function provideLibResources(getString: GetStringFn): void {
  TestBed.configureTestingModule({
    providers: [{ provide: SkyLibResourcesService, useValue: { getString } }],
  });
}
