export interface HelpWidgetConfig {
  extends?: string;
  productId?: string;
  defaultHelpKey?: string;
  locale?: string;
  helpBaseUrl?: string;
  customLocales?: string[];
  headerColor?: string;
  headerTextColor?: string;
  trainingCentralUrl?: string;
  knowledgeBaseUrl?: string;
  caseCentralUrl?: string;
  helpCentralUrl?: string;
  hideUndock?: boolean;
  hideWidgetOnMobile?: boolean;
  hideHelpChat?: boolean;
  useFlareSearch?: boolean;
  getChatData?: any;
  authEnabled?: boolean;
}
