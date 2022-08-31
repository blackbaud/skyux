import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import {
  SkyMediaQueryService,
  SkyResizeObserverMediaQueryService,
} from '@skyux/core';

import { takeWhile } from 'rxjs/operators';

import { SkyModalAdapterService } from './modal-adapter.service';
import { SkyModalConfiguration } from './modal-configuration';
import { SkyModalHostContext } from './modal-host-context';
import { SkyModalHostService } from './modal-host.service';
import { SkyModalInstance } from './modal-instance';
import { SkyModalConfigurationInterface } from './modal.interface';

/**
 * @internal
 */
@Component({
  selector: 'sky-modal-host',
  templateUrl: './modal-host.component.html',
  styleUrls: ['./modal-host.component.scss'],
  viewProviders: [SkyModalAdapterService],
})
export class SkyModalHostComponent implements OnDestroy {
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
  public target: ViewContainerRef | undefined;

  #resolver: ComponentFactoryResolver;
  #adapter: SkyModalAdapterService;
  #injector: Injector;
  #router: Router;
  #changeDetector: ChangeDetectorRef;
  #modalHostContext: SkyModalHostContext;
  #elRef: ElementRef;

  #ariaPreviousValueSiblings = new Map<Element, string | null>();

  #modalInstances: SkyModalInstance[] = [];

  constructor(
    resolver: ComponentFactoryResolver,
    adapter: SkyModalAdapterService,
    injector: Injector,
    router: Router,
    changeDetector: ChangeDetectorRef,
    modalHostContext: SkyModalHostContext,
    elRef: ElementRef
  ) {
    this.#resolver = resolver;
    this.#adapter = adapter;
    this.#injector = injector;
    this.#router = router;
    this.#changeDetector = changeDetector;
    this.#modalHostContext = modalHostContext;
    this.#elRef = elRef;
  }

  public ngOnDestroy(): void {
    // Close all modal instances before disposing of the host container.
    this.#closeAllModalInstances();
    this.#modalHostContext.args.teardownCallback();
  }

  public hideModalHostSiblings(): void {
    // hidding all elements at the modal-host level from screenreaders
    const hostElement = this.#elRef.nativeElement;
    const hostSiblings = hostElement.parentElement.children;
    this.#ariaPreviousValueSiblings = this.#adapter.addAriaHidden(
      hostSiblings,
      hostElement
    );
  }

  public open(
    modalInstance: SkyModalInstance,
    component: any,
    config?: SkyModalConfigurationInterface
  ): void {
    /* Ignore coverage as we specify the target element and so the view child should never be undefined unless
     * we were to call the `open` method in an early lifecycle hook. */
    /* istanbul ignore next */
    if (!this.target) {
      return;
    }

    const params: SkyModalConfigurationInterface = Object.assign({}, config);
    const factory = this.#resolver.resolveComponentFactory(component);

    const hostService = new SkyModalHostService();
    hostService.fullPage = !!params.fullPage;

    const adapter = this.#adapter;
    const modalOpener: HTMLElement = adapter.getModalOpener();

    let isOpen = true;

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    params.providers!.push({
      provide: SkyModalHostService,
      useValue: hostService,
    });
    params.providers!.push({
      provide: SkyModalConfiguration,
      useValue: params,
    });
    params.providers!.push({
      provide: SkyMediaQueryService,
      useExisting: SkyResizeObserverMediaQueryService,
    });
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    adapter.setPageScroll(SkyModalHostService.openModalCount > 0);
    adapter.toggleFullPageModalClass(
      SkyModalHostService.fullPageModalCount > 0
    );

    const providers = params.providers || /* istanbul ignore next */ [];
    const injector = Injector.create({
      providers,
      parent: this.#injector,
    });

    const modalComponentRef = this.target.createComponent(
      factory,
      undefined,
      injector
    );

    // modal element that was just opened
    const modalElement = modalComponentRef.location.nativeElement;

    modalInstance.componentInstance = modalComponentRef.instance;

    this.#registerModalInstance(modalInstance);

    if (SkyModalHostService.openModalCount == 1) {
      // hidding all elements at the modal-host level from screenreaders when the first modal is opened
      this.hideModalHostSiblings();
    }
    if (
      SkyModalHostService.openModalCount > 1 &&
      SkyModalHostService.topModal == hostService
    ) {
      // hiding the lower modals when more than one modal is opened
      modalElement.previousElementSibling.setAttribute('aria-hidden', true);
    }

    const closeModal = () => {
      // unhide siblings if last modal is closing
      if (SkyModalHostService.openModalCount == 1) {
        adapter.removeAriaHidden(this.#ariaPreviousValueSiblings);
        this.#ariaPreviousValueSiblings.clear();
      } else if (SkyModalHostService.topModal == hostService) {
        // if there are more than 1 modal then unhide the one behind this one before closing it
        // allModals = hostElement.children;
        modalElement.previousElementSibling.removeAttribute('aria-hidden');
      }

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
    };

    hostService.openHelp.subscribe((helpKey?: string) => {
      modalInstance.openHelp(helpKey);
    });

    hostService.close.subscribe(() => {
      modalInstance.close();
    });

    this.#router.events.pipe(takeWhile(() => isOpen)).subscribe((event) => {
      /* istanbul ignore else */
      if (event instanceof NavigationStart) {
        modalInstance.close();
      }
    });

    modalInstance.closed.subscribe(() => {
      isOpen = false;
      this.#unregisterModalInstance(modalInstance);
      closeModal();
    });

    // Necessary if the host was created via a consumer's lifecycle hook such as ngOnInit
    this.#changeDetector.detectChanges();
  }

  #registerModalInstance(instance: SkyModalInstance): void {
    this.#modalInstances.push(instance);
  }

  #unregisterModalInstance(instance: SkyModalInstance): void {
    this.#modalInstances.slice(this.#modalInstances.indexOf(instance), 1);
  }

  #closeAllModalInstances(): void {
    for (const instance of this.#modalInstances) {
      instance.close();
    }
  }
}
