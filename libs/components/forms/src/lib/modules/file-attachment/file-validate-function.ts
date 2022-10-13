import { SkyFileItem } from './file-item';

export type SkyFileValidateFn = (file: SkyFileItem) => string | undefined;
