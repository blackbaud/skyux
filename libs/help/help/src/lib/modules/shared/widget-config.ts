export interface HelpWidgetConfig {
  authEnabled?: boolean;
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  caseCentralUrl?: string;
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  communityUrl?: string;
  customLocales?: string[];
  defaultHelpKey?: string;
  extends?: string;
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  getChatData?: any;
  getCurrentHelpKey?: any;
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  headerColor?: string;
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  headerTextColor?: string;
  helpBaseUrl?: string;
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  helpCenterUrl?: string;
  /**
   * Determines if widget will attempt to visually mimic being in the omnibar.
   * If legacy (default), the widget will create a green-ear trigger in the DOM that is designed to be on top of the omnibar.
   * If menu, the widget will not create any visual elements in the DOM (leaving that for the omnibar to do itself)
   * and will open all topics in a new tab.
   * Menu mode is recommended.
   */
  helpMode?: 'legacy' | 'menu';
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  hideHelpChat?: boolean | string;
  /**
   * The undock component no longer exists, thus this configuration will have no effect.
   * @deprecated
   */
  hideUndock?: boolean | string;
  helpUpdateCallback?: (args: { url: string }) => void;
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  hideWidgetOnMobile?: boolean;
  hostQueryParams?: string;
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  knowledgebaseUrl?: string;
  locale?: string;
  productId?: string;
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  searchService?: string;
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  trainingCentralUrl?: string;
  /**
   * This does nothing when {@link HelpWidgetConfig#helpMode} is menu.
   * Instead of using this property, enter menu mode.
   * @deprecated
   */
  useFlareSearch?: boolean;
  /**
   * This was a proposed solution to What's new years ago that never was acted upon.
   * @deprecated
   */
  whatsNewRevisions?: any;
  environmentId?: string;
}
