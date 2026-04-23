import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService, SkyLibResourcesService } from '@skyux/i18n';
import { firstValueFrom } from 'rxjs';

export async function getResourceString(
  resourceKey: string,
  resourceArgs: unknown[] = [],
): Promise<string> {
  const resourcesSvc = TestBed.inject(SkyAppResourcesService);

  return await firstValueFrom(
    resourcesSvc.getString(resourceKey, ...resourceArgs),
  );
}

export async function getLibResourceString(
  resourceKey: string,
  resourceArgs: unknown[] = [],
): Promise<string> {
  const resourcesSvc = TestBed.inject(SkyLibResourcesService);

  return await firstValueFrom(
    resourcesSvc.getString(resourceKey, ...resourceArgs),
  );
}
