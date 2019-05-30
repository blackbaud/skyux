export interface SkyDocsBehaviorDemoControlPanelConfig {
  columns: {
    radioGroup?: {
      name: string;
      value: any;
      radios: {
        label: string;
        value: any;
      }[];
    };
    checkboxes?: {
      label: string;
      value: any;
      checked?: boolean;
    }[];
  }[];
}
