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

export function isTemplateMatch(sample: string, template: string): boolean {
  let matches = true;

  const templateTokens = template.split(new RegExp('{\\d+}')).reverse();

  let currentToken = templateTokens.pop();
  let lastPosition = 0;

  while (currentToken !== undefined && matches) {
    const tokenPosition = sample.indexOf(currentToken, lastPosition);

    matches = tokenPosition >= lastPosition;
    lastPosition = tokenPosition + currentToken.length;
    currentToken = templateTokens.pop();
  }

  return matches;
}
