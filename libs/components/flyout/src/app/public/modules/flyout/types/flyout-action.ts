export interface SkyFlyoutAction {

    /**
     * Specifies the button's label.
     */
    label?: string;

    /**
     * Specifies a callback function to execute when the button is clicked.
     */
    callback?: () => void;

    /**
     * Indicates whether to close the flyout after the button is clicked.
     */
    closeAfterInvoking?: boolean;
}
