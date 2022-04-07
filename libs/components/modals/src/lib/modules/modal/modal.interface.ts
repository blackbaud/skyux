// TODO: defaults won't show in the generated docs until this work is done:
// https://github.com/blackbaud/skyux-docs-tools/issues/38

/**
 * Specifies configuration options for creating a modal.
 */
export interface SkyModalConfigurationInterface {
  /**
   * Indicates whether to display the modal full screen.
   * This property defaults to `false`.
   */
  fullPage?: boolean;

  /**
   * Specifies a size for the modal. The valid options are `small`, `medium`, and `large`.
   * This property defaults to `medium`.
   */
  size?: string;

  /**
   * An array property of `providers`.
   * In Angular, a provider is something that can create or deliver a service.
   * This property can be used to pass context values from the component that launches the modal to the modal component.
   */
  providers?: any[];

  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that describes
   * the modal. This sets the modal's `aria-describedby` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * The description typically includes text on the modal but not on items that users interact
   * with, such as buttons and forms. If you do not specify an ID, the default description is
   * the content of the `sky-modal-content` component.
   */
  ariaDescribedBy?: string;

  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that labels
   * the modal. This sets the `aria-labelledby` attribute for the modal
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * This is typically a header element, and if you do not specify an ID, the default value
   * is the content of the `sky-modal-header` component.
   */
  ariaLabelledBy?: string;

  /**
   * Specifies an ARIA role for the modal
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the modal functions and what it controls. For information about
   * how an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](http://www.w3.org/WAI/PF/aria/roles). By default, modals set
   * the ARIA role to `dialog`.
   * @default "dialog"
   */
  ariaRole?: string;

  /**
   * Indicates whether the modal uses tiles. When set to `true`, the modal's background switches
   * to `$sky-background-color-neutral-light` and tile headings are styled as subsection headings.
   * This property defaults to `false`.
   */
  tiledBody?: boolean;

  /**
   * Specifies a `helpKey` string. This property displays
   * the <i class="fa fa-question-circle" aria-hidden="true"></i> button in the modal header.
   * When users click this button, the `helpOpened` event broadcasts the `helpKey` parameter.
   * Blackbaud developers can use the Help Widget, which is for internal Blackbaud use only, to
   * [display help content in a flyout panel](https://docs.blackbaud.com/bb-help-docs/components/modal-header).
   */
  helpKey?: string;

  /**
   * Specifies a CSS class to add to the modal, such as `ag-custom-component-popup` for
   * using a modal as part of a cell editor in Data Entry Grid.
   */
  wrapperClass?: string;
}
