import { ComponentRef, StaticProvider, TemplateRef, Type } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { SkyOverlayConfig } from './overlay-config';
import { SkyOverlayComponent } from './overlay.component';

/**
 * Represents a new overlay instance. It is used to manage the "closed" state of the overlay,
 * and access any public members on the appended content component instance.
 */
export class SkyOverlayInstance {
  /**
   * Emits when the overlay is clicked (but not its content).
   */
  public get backdropClick(): Observable<void> {
    return this._backdropClick.asObservable();
  }

  /**
   * Emits after the overlay is closed.
   */
  public get closed(): Observable<void> {
    return this._closed.asObservable();
  }

  private _backdropClick = new Subject<void>();

  private _closed = new Subject<void>();

  constructor(
    /**
     * The configuration for the overlay.
     */
    public readonly config: SkyOverlayConfig,
    public readonly componentRef: ComponentRef<SkyOverlayComponent>
  ) {
    this.componentRef.instance.closed.subscribe(() => {
      this._closed.next();
      this._closed.complete();
      this._backdropClick.complete();
    });

    this.componentRef.instance.backdropClick.subscribe(() => {
      this._backdropClick.next();
    });
  }

  /**
   * Creates and attaches a component to the overlay.
   * @param component The component to attach.
   * @param providers Custom providers to apply to the component.
   */
  public attachComponent<C>(
    component: Type<C>,
    providers?: StaticProvider[]
  ): C {
    const componentRef = this.componentRef.instance.attachComponent(
      component,
      providers
    );
    return componentRef.instance;
  }

  /**
   * Attaches a `TemplateRef` to the overlay.
   * @param templateRef The `TemplateRef` to attach.
   * @param context The context to provide to the template.
   */
  public attachTemplate<T>(templateRef: TemplateRef<T>, context?: T): void {
    this.componentRef.instance.attachTemplate(templateRef, context);
  }
}
