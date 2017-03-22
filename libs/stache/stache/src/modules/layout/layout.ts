import { StacheNavLink } from '../nav/nav-link';

export interface StacheLayout {
  pageTitle: string;
  breadcrumbsRoutes: StacheNavLink[];
  inPageRoutes: StacheNavLink[];
  showBreadcrumbs: boolean;
  showPageContents: boolean;
  sidebarRoutes?: StacheNavLink[];
}
