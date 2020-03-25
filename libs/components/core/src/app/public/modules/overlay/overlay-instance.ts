import {
  ComponentRef,
  StaticProvider,
  TemplateRef,
  Type
} from '@angular/core';

import {
  Observable,
  Subject
} from 'rxjs';

import {
  SkyOverlayComponent
} from './overlay.component';

import {
  SkyOverlayConfig
} from './overlay-config';

/**
 * Represents a new overlay instance. It is used to manage the "closed" state of the overlay,
 * and access any public members on the appended content component instance.
 */
export class SkyOverlayInstance {

  /**
   * Emits after the overlay is closed.
   */
  public get closed(): Observable<void> {
    return this._closed;
  }

  private _closed = new Subject<void>();

  constructor(
    /**
     * The configuration for the overlay.
     */
    public readonly config: SkyOverlayConfig,
    public readonly componentRef: ComponentRef<SkyOverlayComponent>
  ) {
    this.componentRef.instance.closed.subscribe(() => {
      this.close();
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
    const componentRef = this.componentRef.instance.attachComponent(component, providers);
    return componentRef.instance;
  }

  /**
   * Attaches a `TemplateRef` to the overlay.
   * @param templateRef The `TemplateRef` to attach.
   * @param context The context to provide to the template.
   */
  public attachTemplate<T>(
    templateRef: TemplateRef<T>,
    context?: T
  ): void {
    this.componentRef.instance.attachTemplate(templateRef, context);
  }

  /**
   * Closes the overlay.
   * @deprecated Use the public `close` method on the `SkyOverlayService` instead.
   */
  public close(): void {
    this._closed.next();
    this._closed.complete();
  }

}
