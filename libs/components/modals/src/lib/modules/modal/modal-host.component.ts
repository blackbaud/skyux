import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  NgModuleRef,
  Optional,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { takeWhile } from 'rxjs/operators';

import { SkyModalAdapterService } from './modal-adapter.service';
import { SkyModalConfiguration } from './modal-configuration';
import { SkyModalHostService } from './modal-host.service';
import { SkyModalInstance } from './modal-instance';
import { SkyModalConfigurationInterface } from './modal.interface';
import { SkyModalModule } from './modal.module';

/**
 * @internal
 */
@Component({
  selector: 'sky-modal-host',
  templateUrl: './modal-host.component.html',
  styleUrls: ['./modal-host.component.scss'],
  viewProviders: [SkyModalAdapterService],
})
export class SkyModalHostComponent {
  public get modalOpen() {
    return SkyModalHostService.openModalCount > 0;
  }

  public get backdropZIndex() {
    return SkyModalHostService.backdropZIndex;
  }

  /**
   * Use `any` for backwards-compatibility with Angular 4-7.
   * See: https://github.com/angular/angular/issues/30654
   * TODO: Remove the `any` in a breaking change.
   * @internal
   */
  @ViewChild('target', {
    read: ViewContainerRef,
    static: true,
  } as any)
  public target: ViewContainerRef;

  constructor(
    private resolver: ComponentFactoryResolver,
    private adapter: SkyModalAdapterService,
    private injector: Injector,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    @Optional() private ngModuleRef: NgModuleRef<SkyModalModule>
  ) {}

  public open(
    modalInstance: SkyModalInstance,
    component: any,
    config?: SkyModalConfigurationInterface
  ) {
    const params: SkyModalConfigurationInterface = Object.assign({}, config);
    const factory = this.resolver.resolveComponentFactory(component);

    const hostService = new SkyModalHostService();
    hostService.fullPage = !!params.fullPage;

    const adapter = this.adapter;
    const modalOpener: HTMLElement = adapter.getModalOpener();

    let isOpen = true;

    params.providers.push({
      provide: SkyModalHostService,
      useValue: hostService,
    });
    params.providers.push({
      provide: SkyModalConfiguration,
      useValue: params,
    });

    adapter.setPageScroll(SkyModalHostService.openModalCount > 0);
    adapter.toggleFullPageModalClass(
      SkyModalHostService.fullPageModalCount > 0
    );

    const providers = params.providers || /* istanbul ignore next */ [];
    const injector = Injector.create({
      providers,
      parent: this.injector,
    });

    const modalComponentRef = this.target.createComponent(
      factory,
      undefined,
      injector,
      undefined,
      this.ngModuleRef
    );

    modalInstance.componentInstance = modalComponentRef.instance;

    function closeModal() {
      hostService.destroy();
      adapter.setPageScroll(SkyModalHostService.openModalCount > 0);
      adapter.toggleFullPageModalClass(
        SkyModalHostService.fullPageModalCount > 0
      );
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

    this.router.events.pipe(takeWhile(() => isOpen)).subscribe((event) => {
      /* istanbul ignore else */
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
