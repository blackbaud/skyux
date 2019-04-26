// #region imports
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  Injector,
  ReflectiveInjector,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/operator/take';

import {
  SkyToast
} from './toast';

import {
  SkyToastAdapterService
} from './toast-adapter.service';

import {
  SkyToastComponent
} from './toast.component';

import {
  SkyToastService
} from './toast.service';
// #endregion

@Component({
  selector: 'sky-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyToasterComponent implements AfterViewInit {
  public get toastStream(): Observable<SkyToast[]> {
    return this.toastService.toastStream;
  }

  @ViewChild('toaster')
  private toaster: ElementRef;

  @ViewChildren('toastContent', { read: ViewContainerRef })
  private toastContent: QueryList<ViewContainerRef>;

  @ViewChildren(SkyToastComponent)
  private toastComponents: QueryList<SkyToastComponent>;

  constructor(
    private domAdapter: SkyToastAdapterService,
    private toastService: SkyToastService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  public ngAfterViewInit(): void {
    this.injectToastContent();
    this.toastContent.changes.subscribe(() => {
      this.injectToastContent();
    });

    // Scroll to the bottom of the toaster element when a new toast is added.
    this.toastStream.subscribe((toasts: SkyToast[]) => {
      this.domAdapter.scrollBottom(this.toaster);
    });
  }

  @HostListener('click', ['$event'])
  public onHostClick(event: any): void {
    event.stopPropagation();
  }

  public onToastClosed(toast: SkyToast): void {
    toast.instance.close();
  }

  public closeAll(): void {
    if (this.toastComponents) {
      this.toastComponents.forEach((toastComponent) => {
        toastComponent.close();
      });
    }
  }

  private injectToastContent(): void {
    // Dynamically inject each toast's body content when the number of toasts changes.
    this.toastService.toastStream.take(1).subscribe((toasts) => {
      this.toastContent.toArray().forEach((target: ViewContainerRef, i: number) => {
        target.clear();

        const toast = toasts[i];
        const componentFactory = this.resolver.resolveComponentFactory(toast.bodyComponent);
        const injector = ReflectiveInjector.fromResolvedProviders(
          ReflectiveInjector.resolve(toast.bodyComponentProviders),
          this.injector
        );

        const componentRef = target.createComponent(componentFactory, undefined, injector);
        componentRef.changeDetectorRef.detectChanges();
      });
    });
  }
}
