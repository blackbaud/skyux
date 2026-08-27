import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService, SkyLibResourcesService } from '@skyux/i18n';
import { Observable } from 'rxjs';

export type GetStringFn = (
  resourceKey: string,
  ...resourceArgs: unknown[]
) => Observable<string>;

export function provideAppResources(
  getString: GetStringFn,
): SkyAppResourcesService {
  TestBed.configureTestingModule({
    providers: [{ provide: SkyAppResourcesService, useValue: { getString } }],
  });

  return TestBed.inject(SkyAppResourcesService);
}

export function provideLibResources(
  getString: GetStringFn,
): SkyLibResourcesService {
  TestBed.configureTestingModule({
    providers: [{ provide: SkyLibResourcesService, useValue: { getString } }],
  });

  return TestBed.inject(SkyLibResourcesService);
}
