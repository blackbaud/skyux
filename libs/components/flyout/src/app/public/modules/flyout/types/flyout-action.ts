export interface SkyFlyoutAction {
    label?: string;
    callback?: () => void;
    closeAfterInvoking?: boolean;
}
