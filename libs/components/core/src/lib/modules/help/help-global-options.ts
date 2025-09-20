/**
 * Options to apply to all components that invoke global help.
 */
export interface SkyHelpGlobalOptions {
  /**
   * The ID of the element that is displayed when the invoking component is clicked.
   */
  ariaControls?: string;

  /**
   * The type of popup triggered by the invoking component.
   */
  ariaHaspopup?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
}
