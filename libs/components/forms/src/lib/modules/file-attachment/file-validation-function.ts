import { SkyFileItem } from './file-item';

export type SkyFileValidationFunction = (
  fileItem: SkyFileItem
) => string | undefined;
