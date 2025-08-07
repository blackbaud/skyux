import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  Injectable,
  Renderer2,
  RendererFactory2,
  Type,
  createComponent,
  createEnvironmentInjector,
  inject,
} from '@angular/core';

import { SkyAppWindowRef } from '../window/window-ref';

import { SkyDynamicComponentLocation } from './dynamic-component-location';
import { SkyDynamicComponentOptions } from './dynamic-component-options';

/**
 * Angular service for creating and rendering a dynamic component.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyDynamicComponentService {
  #applicationRef: ApplicationRef;

  #renderer: Renderer2;

  #windowRef: SkyAppWindowRef;

  #environmentInjector = inject(EnvironmentInjector);

  constructor(
    applicationRef: ApplicationRef,
    windowRef: SkyAppWindowRef,
    rendererFactory: RendererFactory2,
  ) {
    this.#applicationRef = applicationRef;
    this.#windowRef = windowRef;

    // Based on suggestions from https://github.com/angular/angular/issues/17824
    // for accessing an instance of Renderer2 in a service since Renderer2 can't
    // be injected into a service.  Passing undefined for both parameters results
    // in the default renderer which is what we want here.
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  /**
   * Creates an instance of the specified component and adds it to the specified location
   * on the page.
   */
  public createComponent<T>(
    componentType: Type<T>,
    options: SkyDynamicComponentOptions = {
      location: SkyDynamicComponentLocation.BodyBottom,
    },
  ): ComponentRef<T> {
    const environmentInjector = createEnvironmentInjector(
      options.providers ?? [],
      options.environmentInjector ?? this.#environmentInjector,
    );

    let componentRef: ComponentRef<T>;

    if (options.viewContainerRef) {
      componentRef = options.viewContainerRef.createComponent(componentType, {
        environmentInjector,
      });
    } else {
      componentRef = createComponent<T>(componentType, {
        environmentInjector,
      });

      this.#applicationRef.attachView(componentRef.hostView);

      this.#insertComponentAtLocation(componentRef, options);
    }

    if (options.className) {
      const el = this.#getRootNode(componentRef);
      this.#renderer.addClass(el, options.className);
    }

    return componentRef;
  }

  #insertComponentAtLocation(
    componentRef: ComponentRef<unknown>,
    options: SkyDynamicComponentOptions,
  ): void {
    const el = this.#getRootNode(componentRef);

    const bodyEl = this.#windowRef.nativeWindow.document.body;

    switch (options.location) {
      case SkyDynamicComponentLocation.BeforeElement:
        if (!options.referenceEl) {
          throw new Error(
            '[SkyDynamicComponentService] Could not create a component at location `SkyDynamicComponentLocation.BeforeElement` because a reference element was not provided.',
          );
        }

        this.#renderer.insertBefore(
          options.referenceEl.parentElement,
          el,
          options.referenceEl,
        );
        break;
      case SkyDynamicComponentLocation.ElementTop:
        if (!options.referenceEl) {
          throw new Error(
            '[SkyDynamicComponentService] Could not create a component at location `SkyDynamicComponentLocation.ElementTop` because a reference element was not provided.',
          );
        }

        this.#renderer.insertBefore(
          options.referenceEl,
          el,
          options.referenceEl.firstChild,
        );
        break;
      case SkyDynamicComponentLocation.ElementBottom:
        this.#renderer.appendChild(options.referenceEl, el);
        break;
      case SkyDynamicComponentLocation.BodyTop:
        this.#renderer.insertBefore(bodyEl, el, bodyEl.firstChild);
        break;
      default:
        this.#renderer.appendChild(bodyEl, el);
        break;
    }
  }

  /**
   * Removes a component ref from the page
   * @param componentRef Component ref for the component being removed
   */
  public removeComponent<T>(componentRef: ComponentRef<T> | undefined): void {
    if (!componentRef) {
      return;
    }

    if (!this.#applicationRef.destroyed) {
      this.#applicationRef.detachView(componentRef.hostView);
    }
    componentRef.destroy();
  }

  #getRootNode<T>(componentRef: ComponentRef<T>): any {
    // Technique for retrieving the component's root node taken from here:
    // https://malcoded.com/posts/angular-dynamic-components
    return (componentRef.hostView as EmbeddedViewRef<T>).rootNodes[0];
  }
}

/**
 * Angular service for creating and rendering a dynamic component.
 * @internal
 * @deprecated Use `SkyDynamicComponentService` to create a standalone component instead.
 */
@Injectable({
  providedIn: 'any',
})
export class SkyDynamicComponentLegacyService extends SkyDynamicComponentService {}
