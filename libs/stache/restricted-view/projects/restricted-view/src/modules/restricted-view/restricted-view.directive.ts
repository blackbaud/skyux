import {
  Directive,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyRestrictedViewAuthService
} from './restricted-view-auth.service';

@Directive({
  selector: '[skyRestrictedView]'
})
export class SkyRestrictedViewDirective implements OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private renderer: Renderer2,
    private authService: SkyRestrictedViewAuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    this.viewContainer.clear();

    this.authService.isAuthenticated
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.viewContainer.createEmbeddedView(this.templateRef);

          const ref: any = this.viewContainer.get(0);
          const directiveElement = ref.rootNodes[0];

          this.renderer.addClass(directiveElement, 'skyux-restricted-view');
        } else {
          this.viewContainer.clear();
        }
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
