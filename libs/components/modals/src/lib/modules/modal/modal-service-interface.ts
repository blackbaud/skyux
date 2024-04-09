import { SkyModalInstance } from './modal-instance';
import { SkyModalConfigurationInterface } from './modal.interface';

/**
 * @internal
 */
export interface SkyModalServiceInterface {
  open(
    component: any,
    config?: SkyModalConfigurationInterface | any[],
  ): SkyModalInstance;
}
