import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { UrlValidationControlValidatorComponent } from './control-validator/url-validation-control-validator.component';
import { UrlValidationDirectiveComponent } from './directive/url-validation-directive.component';

const routes: ComponentRouteInfo[] = [
  {
    path: 'control-validator',
    component: UrlValidationControlValidatorComponent,
    data: {
      name: 'URL (validator)',
      icon: 'checkmark',
      library: 'validation',
    },
  },
  {
    path: 'directive',
    component: UrlValidationDirectiveComponent,
    data: {
      name: 'URL (directive)',
      icon: 'checkmark',
      library: 'validation',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class UrlValidationRoutingModule {
  public static routes = routes;
}
