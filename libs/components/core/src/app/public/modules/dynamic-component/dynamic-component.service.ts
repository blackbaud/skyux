import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  RendererFactory2,
  Renderer2
} from '@angular/core';

import {
  SkyWindowRefService
} from '../window';

import {
  SkyDynamicComponentArgs
} from './dynamic-component-args';

import {
  SkyDynamicComponentLocation
} from './dynamic-component-location';

@Injectable()
export class SkyDynamicComponentService {

  private renderer: Renderer2;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private windowRef: SkyWindowRefService,
    rendererFactory: RendererFactory2
  ) {
    // Based on suggestions from https://github.com/angular/angular/issues/17824
    // for accessing an instance of Renderer2 in a service since Renderer2 can't
    // be injected into a service.  Passing undefined for both parameters results
    // in the default renderer which is what we want here.
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  public createComponent<T>(args: SkyDynamicComponentArgs): ComponentRef<T> {
    const cmpRef = this.componentFactoryResolver
      .resolveComponentFactory<T>(args.componentType)
      .create(this.injector);

    this.appRef.attachView(cmpRef.hostView);

    // Technique for retrieving the component's root node taken from here:
    // https://malcoded.com/posts/angular-dynamic-components
    const el = (cmpRef.hostView as EmbeddedViewRef<any>).rootNodes[0];

    const bodyEl = this.windowRef.getWindow().document.body;

    switch (args.location) {
      case SkyDynamicComponentLocation.BodyTop:
        this.renderer.insertBefore(bodyEl, el, bodyEl.firstChild);
        break;
      default:
        this.renderer.appendChild(bodyEl, el);
        break;
    }

    return cmpRef;
  }

}
