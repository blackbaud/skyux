import { StacheNavLink } from '../nav';

export interface StacheLayout {
  pageTitle: string;
  breadcrumbsRoutes: StacheNavLink[];
  inPageRoutes: StacheNavLink[];
  showBackToTop: boolean;
  showBreadcrumbs: boolean;
  showTableOfContents: boolean;
  sidebarRoutes?: StacheNavLink[];
}
