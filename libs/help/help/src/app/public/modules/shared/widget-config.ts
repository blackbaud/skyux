export interface HelpWidgetConfig {
  authEnabled?: boolean;
  caseCentralUrl?: string;
  communityUrl?: string;
  customLocales?: string[];
  defaultHelpKey?: string;
  extends?: string;
  getChatData?: any;
  getCurrentHelpKey?: any;
  headerColor?: string;
  headerTextColor?: string;
  helpBaseUrl?: string;
  helpCenterUrl?: string;
  hideHelpChat?: boolean | string;
  /**
   * @deprecated The undock component no longer exists, thus this configuration will have no effect.
   */
  hideUndock?: boolean | string;
  hideWidgetOnMobile?: boolean;
  hostQueryParams?: string;
  knowledgebaseUrl?: string;
  locale?: string;
  productId?: string;
  searchService?: string;
  trainingCentralUrl?: string;
  useFlareSearch?: boolean;
  whatsNewRevisions?: any;
  environmentId?: string;
}
