import { SkyModalHostService } from '@skyux/modals';

/**
 * @internal
 * Information for tracking instances fo the modal host service
 */
export interface SkyModalHostServiceInfo {
  hostService: SkyModalHostService;
  zIndex: number;
}
