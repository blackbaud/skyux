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
   * Sets the `aria-describedby` attribute for the modal dialog to support accessibility.
   * The value should be an ID (without the leading `#`) that points to the element
   * that describes the modal. Typically, this is the text on the modal,
   * not including anything that users interact with such as buttons or a form.
   * If no ID is specified, the default value is the content of the `sky-modal-content` component.
   */
  ariaDescribedBy?: string;

  /**
   * Sets the `aria-labelledby` attribute for the modal dialog to support accessibility.
   * The value should be an ID (without the leading `#`) that points to the element
   * that labels the modal. Typically this is a header element. If no ID is specified,
   * the default value is the content of the `sky-modal-header` component.
   */
  ariaLabelledBy?: string;

  /**
   * Specifies [an ARIA role](http://www.w3.org/WAI/PF/aria/roles) for the modal dialog
   * to support accessibility by indicating how the modal functions and what it controls.
   * The ARIA role indicates what the modal component represents on the web page.
   * This property defaults to `dialog`.
   */
  ariaRole?: string;

  /**
   * Indicates whether the modal uses tiles. When set to `true`, the modal's background switches
   * to `$sky-background-color-neutral-light` and tile headings are styled as subsection headings.
   * This property defaults to `false`.
   */
  tiledBody?: boolean;

  /**
   * Specifies a `helpKey` string. This property dispays
   * the <i class="fa fa-question-circle" aria-hidden="true"></i> button in the modal header.
   * When users click this button, the `helpOpened` event broadcasts the `helpKey` parameter.
   * Blackbaud developers can use the Help Widget, which is for internal Blackbaud use only, to
   * [display help content in a flyout panel](https://docs.blackbaud.com/bb-help-docs/components/modal-header).
   */
  helpKey?: string;
}
