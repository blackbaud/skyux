import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  HostListener,
  Injector,
  ReflectiveInjector,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  NavigationStart,
  Router
} from '@angular/router';

import 'rxjs/add/operator/takeWhile';

import {
  SkyModalAdapterService
} from './modal-adapter.service';

import {
  SkyModalInstance
} from './modal-instance';

import {
  SkyModalHostService
} from './modal-host.service';

import {
  SkyModalConfigurationInterface as IConfig
} from './modal.interface';

import {
  SkyModalConfiguration
} from './modal-configuration';

@Component({
  selector: 'sky-modal-host',
  templateUrl: './modal-host.component.html',
  styleUrls: ['./modal-host.component.scss'],
  viewProviders: [SkyModalAdapterService]
})

export class SkyModalHostComponent {
  public get modalOpen() {
    return SkyModalHostService.openModalCount > 0;
  }

  public get backdropZIndex() {
    return SkyModalHostService.backdropZIndex;
  }

  @ViewChild('target', { read: ViewContainerRef })
  public target: ViewContainerRef;

  constructor(
    private resolver: ComponentFactoryResolver,
    private adapter: SkyModalAdapterService,
    private injector: Injector,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  @HostListener('click', ['$event'])
  public onHostClick(event: any): void {
    event.stopPropagation();
  }

  public open(modalInstance: SkyModalInstance, component: any, config?: IConfig) {
    const params: IConfig = Object.assign({}, config);
    const factory = this.resolver.resolveComponentFactory(component);

    const hostService = new SkyModalHostService();
    hostService.fullPage = !!params.fullPage;

    const adapter = this.adapter;
    const modalOpener: HTMLElement = adapter.getModalOpener();

    let isOpen = true;

    params.providers.push({
      provide: SkyModalHostService,
      useValue: hostService
    });
    params.providers.push({
      provide: SkyModalConfiguration,
      useValue: params
    });

    adapter.setPageScroll(SkyModalHostService.openModalCount > 0);
    adapter.toggleFullPageModalClass(SkyModalHostService.fullPageModalCount > 0);

    let providers = params.providers /* istanbul ignore next */ || [];
    let resolvedProviders = ReflectiveInjector.resolve(providers);
    let injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, this.injector);
    let modalComponentRef = this.target.createComponent(factory, undefined, injector);

    modalInstance.componentInstance = modalComponentRef.instance;

    function closeModal() {
      hostService.destroy();
      adapter.setPageScroll(SkyModalHostService.openModalCount > 0);
      adapter.toggleFullPageModalClass(SkyModalHostService.fullPageModalCount > 0);
      /* istanbul ignore else */
      /* sanity check */
      if (modalOpener && modalOpener.focus) {
        modalOpener.focus();
      }
      modalComponentRef.destroy();
    }

    hostService.openHelp.subscribe((helpKey?: string) => {
      modalInstance.openHelp(helpKey);
    });

    hostService.close.subscribe(() => {
      modalInstance.close();
    });

    this.router.events
      .takeWhile(() => isOpen)
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          modalInstance.close();
        }
      });

    modalInstance.closed.subscribe(() => {
      isOpen = false;
      closeModal();
    });

    // Necessary if the host was created via a consumer's lifecycle hook such as ngOnInit
    this.changeDetector.detectChanges();
  }
}
