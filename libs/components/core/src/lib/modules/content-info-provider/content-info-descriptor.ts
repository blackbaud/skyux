/**
 * Text or an element that describes the content a consumer renders in a component.
 *
 * @internal
 */
export interface SkyContentInfoDescriptor {
  /**
   * A descriptor of type `text` is an already localized string that describes a parent's content, i.e. constituent.
   * A descriptor of type `elementId` is an HTML Element ID of an element that describes a parent's content, i.e. the ID to a box header.
   */
  type: 'text' | 'elementId';
  /**
   * A value of the given type.
   */
  value: string;
}
