import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { StacheAuthService } from './auth.service';

@Directive({
  selector: '[stacheInternal]'
})
export class StacheInternalDirective {
  constructor(
    private authService: StacheAuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    this.viewContainer.clear();
    this.authService.isAuthenticated.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
