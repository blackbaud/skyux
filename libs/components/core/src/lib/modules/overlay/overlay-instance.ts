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
    return this.#backdropClickObs;
  }

  /**
   * Emits after the overlay is closed.
   */
  public get closed(): Observable<void> {
    return this.#closedObs;
  }

  public id: string;

  #backdropClick: Subject<void>;

  #backdropClickObs: Observable<void>;

  #closed: Subject<void>;

  #closedObs: Observable<void>;

  constructor(
    /**
     * The configuration for the overlay.
     */
    public readonly config: SkyOverlayConfig,
    public readonly componentRef: ComponentRef<SkyOverlayComponent>
  ) {
    this.id = this.componentRef.instance.id;

    this.componentRef.instance.closed.subscribe(() => {
      this.#closed.next();
      this.#closed.complete();
      this.#backdropClick.complete();
    });

    this.componentRef.instance.backdropClick.subscribe(() => {
      this.#backdropClick.next();
    });

    this.#backdropClick = new Subject<void>();
    this.#closed = new Subject<void>();

    this.#backdropClickObs = this.#backdropClick.asObservable();
    this.#closedObs = this.#closed.asObservable();
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
