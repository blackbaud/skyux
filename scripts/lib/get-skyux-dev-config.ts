import { readJson } from 'fs-extra';
import { join } from 'path';

import { SkyuxDevConfig } from '../shared/skyux-dev-config';

export async function getSkyuxDevConfig(): Promise<SkyuxDevConfig> {
  return readJson(join(process.cwd(), '.skyuxdev.json'));
}
