import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  Injectable,
  Injector,
  Renderer2,
  RendererFactory2,
  Type,
  createComponent,
} from '@angular/core';

import { SkyAppWindowRef } from '../window/window-ref';

import { SkyDynamicComponentLocation } from './dynamic-component-location';
import { SkyDynamicComponentOptions } from './dynamic-component-options';

/**
 * Angular service for creating and rendering a dynamic component.
 */
@Injectable({
  // Must be 'any' so that the component is created in the context of its module's injector.
  // If set to 'root', the component's dependency injections would only be derived from the root
  // injector and may lose context if the component is created within a lazy-loaded module.
  providedIn: 'any',
})
export class SkyDynamicComponentService {
  #applicationRef: ApplicationRef;

  #environmentInjector: EnvironmentInjector;

  #injector: Injector;

  #renderer: Renderer2;

  #windowRef: SkyAppWindowRef;

  constructor(
    applicationRef: ApplicationRef,
    injector: Injector,
    windowRef: SkyAppWindowRef,
    rendererFactory: RendererFactory2,
    environmentInjector: EnvironmentInjector
  ) {
    this.#applicationRef = applicationRef;
    this.#injector = injector;
    this.#windowRef = windowRef;
    this.#environmentInjector = environmentInjector;

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
    options?: SkyDynamicComponentOptions
  ): ComponentRef<T> {
    options = options || {
      location: SkyDynamicComponentLocation.BodyBottom,
    };

    const injector = Injector.create({
      providers: options.providers || [],
      parent: options.parentInjector || this.#injector,
    });

    let componentRef: ComponentRef<T>;

    if (options.viewContainerRef) {
      componentRef = options.viewContainerRef.createComponent(componentType, {
        injector,
      });
    } else {
      componentRef = createComponent<T>(componentType, {
        environmentInjector: this.#environmentInjector,
        elementInjector: injector,
      });

      this.#applicationRef.attachView(componentRef.hostView);

      const el = this.#getRootNode(componentRef);

      const bodyEl = this.#windowRef.nativeWindow.document.body;

      switch (options.location) {
        case SkyDynamicComponentLocation.BeforeElement:
          if (!options.referenceEl) {
            throw new Error(
              '[SkyDynamicComponentService] Could not create a component at location `SkyDynamicComponentLocation.BeforeElement` because a reference element was not provided.'
            );
          }

          this.#renderer.insertBefore(
            options.referenceEl.parentElement,
            el,
            options.referenceEl
          );
          break;
        case SkyDynamicComponentLocation.ElementTop:
          if (!options.referenceEl) {
            throw new Error(
              '[SkyDynamicComponentService] Could not create a component at location `SkyDynamicComponentLocation.ElementTop` because a reference element was not provided.'
            );
          }

          this.#renderer.insertBefore(
            options.referenceEl,
            el,
            options.referenceEl.firstChild
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

    return componentRef;
  }

  /**
   * Removes a component ref from the page
   * @param componentRef Component ref for the component being removed
   */
  public removeComponent<T>(componentRef: ComponentRef<T> | undefined): void {
    if (!componentRef) {
      return;
    }

    this.#applicationRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }

  #getRootNode<T>(componentRef: ComponentRef<T>): any {
    // Technique for retrieving the component's root node taken from here:
    // https://malcoded.com/posts/angular-dynamic-components
    return (componentRef.hostView as EmbeddedViewRef<T>).rootNodes[0];
  }
}
