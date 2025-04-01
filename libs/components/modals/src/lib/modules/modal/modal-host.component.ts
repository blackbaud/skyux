import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef,
  createEnvironmentInjector,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import {
  SKY_STACKING_CONTEXT,
  SkyAppWindowRef,
  SkyDynamicComponentService,
  SkyStackingContextService,
  SkyStackingContextStratum,
} from '@skyux/core';

import { of, takeWhile } from 'rxjs';

import { SkyModalsResourcesModule } from '../shared/sky-modals-resources.module';

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
  imports: [CommonModule, RouterModule, SkyModalsResourcesModule],
})
export class SkyModalHostComponent implements OnDestroy {
  protected backdropZIndex = toSignal(SkyModalHostService.backdropZIndexChange);
  protected modalCount = toSignal(SkyModalHostService.openModalCountChange);

  @ViewChild('target', {
    read: ViewContainerRef,
    static: true,
  })
  public target: ViewContainerRef | undefined;

  #modalInstances: SkyModalInstance[] = [];

  readonly #adapter = inject(SkyModalAdapterService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dynamicComponentSvc = inject(SkyDynamicComponentService);
  readonly #elRef = inject(ElementRef);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #modalHostContext = inject(SkyModalHostContext);
  readonly #router = inject(Router, { optional: true });
  readonly #stackingContextService = inject(SkyStackingContextService);
  readonly #windowRef = inject(SkyAppWindowRef);

  public ngOnDestroy(): void {
    // Close all modal instances before disposing of the host container.
    this.#closeAllModalInstances();
    this.#modalHostContext.args.teardownCallback();
  }

  public open<T>(
    modalInstance: SkyModalInstance,
    component: Type<T>,
    config?: SkyModalConfigurationInterface,
    environmentInjector?: EnvironmentInjector,
  ): void {
    /* Ignore coverage as we specify the target element and so the view child should never be undefined unless
     * we were to call the `open` method in an early lifecycle hook. */
    /* istanbul ignore next */
    if (!this.target) {
      return;
    }

    const params: SkyModalConfigurationInterface = Object.assign({}, config);

    const zIndex = this.#stackingContextService.getZIndex('modal');
    // Create a new instance of SkyModalHostService.
    const hostService = createEnvironmentInjector(
      [
        SkyModalHostService,
        {
          provide: SKY_STACKING_CONTEXT,
          useValue: {
            zIndex: of(zIndex),
          },
        },
      ],
      this.#environmentInjector,
    ).get(SkyModalHostService, undefined, {
      self: true,
    });
    hostService.fullPage = !!params.fullPage;

    const adapter = this.#adapter;
    const modalOpener: HTMLElement = adapter.getModalOpener();

    let isOpen = true;

    params.providers ||= [];
    params.providers.push(
      {
        provide: SkyModalHostService,
        useValue: hostService,
      },
      {
        provide: SkyModalConfiguration,
        useValue: params,
      },
      {
        provide: SKY_STACKING_CONTEXT,
        useValue: {
          zIndex: of(zIndex),
        },
      },
      {
        provide: SkyStackingContextStratum,
        useValue: 'modal',
      },
    );

    adapter.setPageScroll(SkyModalHostService.openModalCount > 0);
    adapter.toggleFullPageModalClass(
      SkyModalHostService.fullPageModalCount > 0,
    );

    environmentInjector ||= this.#environmentInjector;
    const modalComponentRef = this.#dynamicComponentSvc.createComponent(
      component,
      {
        environmentInjector: environmentInjector,
        providers: params.providers,
        viewContainerRef: this.target,
      },
    );

    // modal element that was just opened
    const modalElement = modalComponentRef.location;

    modalInstance.adapter = this.#adapter;
    modalInstance.componentRef = modalComponentRef;

    this.#registerModalInstance(modalInstance);

    // Adding a timeout to avoid ExpressionChangedAfterItHasBeenCheckedError.
    // https://stackoverflow.com/questions/40562845
    this.#windowRef.nativeWindow.setTimeout(() => {
      this.#adapter.focusFirstElement(modalElement);

      // hiding all elements at the modal-host level from screen readers when the a modal is opened
      this.#adapter.hideHostSiblingsFromScreenReaders(this.#elRef);
      if (
        SkyModalHostService.openModalCount > 1 &&
        SkyModalHostService.topModal === hostService
      ) {
        // hiding the lower modals when more than one modal is opened
        this.#adapter.hidePreviousModalFromScreenReaders(modalElement);
      }
    });

    const closeModal = (): void => {
      // unhide siblings if last modal is closing
      if (SkyModalHostService.openModalCount === 1) {
        this.#adapter.unhideOrRestoreHostSiblingsFromScreenReaders();
      } else if (SkyModalHostService.topModal === hostService) {
        // if there are more than 1 modal then unhide the one behind this one before closing it
        this.#adapter.unhidePreviousModalFromScreenReaders(modalElement);
      }

      hostService.destroy();
      adapter.setPageScroll(SkyModalHostService.openModalCount > 0);
      adapter.toggleFullPageModalClass(
        SkyModalHostService.fullPageModalCount > 0,
      );
      /* istanbul ignore else */
      /* sanity check */
      if (modalOpener && modalOpener.focus) {
        modalOpener.focus();
      }
      modalComponentRef.destroy();
      this.#stackingContextService.unsetZIndex(zIndex);
    };

    hostService.openHelp.subscribe((helpKey) => {
      modalInstance.openHelp(helpKey);
    });

    hostService.close.subscribe(() => {
      modalInstance.close();
    });

    this.#router?.events.pipe(takeWhile(() => isOpen)).subscribe((event) => {
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
