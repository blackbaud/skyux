import { SkyFileItem } from './file-item';

/**
 * Custom validation run on each file uploaded. The string returned is used as the error message in multi-file attachment.
 */
export type SkyFileValidateFn = (file: SkyFileItem) => string | undefined;
