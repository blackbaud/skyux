import { SkyContentInfoDescriptor } from './content-info-descriptor';

/**
 * Information about the content a consumer is rendering within a component.
 *
 * @internal
 */
export interface SkyContentInfo {
  /**
   * Information that describes the content within a parent component a consumer has rendered, i.e. "constituents".
   * Provided as localized text or an element ID pointing to text that is the descriptor.
   */
  descriptor?: SkyContentInfoDescriptor;
}
