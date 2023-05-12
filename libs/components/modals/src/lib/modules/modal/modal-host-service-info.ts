import { SkyModalHostService } from './modal-host.service';

/**
 * @internal
 * Information for tracking instances fo the modal host service
 */
export interface SkyModalHostServiceInfo {
  hostService: SkyModalHostService;
  zIndex: number;
}
