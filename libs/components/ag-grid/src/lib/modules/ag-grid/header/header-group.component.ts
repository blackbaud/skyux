import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentService,
} from '@skyux/core';

import { IHeaderGroupAngularComp } from 'ag-grid-angular';
import { ColumnGroupOpenedEvent, ProvidedColumnGroup } from 'ag-grid-community';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  fromEventPattern,
} from 'rxjs';

import { SkyAgGridHeaderGroupInfo } from '../types/header-group-info';
import { SkyAgGridHeaderGroupParams } from '../types/header-group-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-header-group',
  templateUrl: './header-group.component.html',
  styleUrls: ['./header-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridHeaderGroupComponent
  implements IHeaderGroupAngularComp, OnDestroy, AfterViewInit
{
  @ViewChild('inlineHelpContainer', { read: ElementRef, static: true })
  public inlineHelpContainer: ElementRef | undefined;

  protected params: SkyAgGridHeaderGroupParams | undefined = undefined;
  protected isExpanded$: Observable<boolean>;

  #columnGroup: ProvidedColumnGroup | undefined = undefined;
  #isExpandedSubject = new BehaviorSubject<boolean>(false);
  #subscriptions = new Subscription();
  #viewInitialized = false;
  #agInitialized = false;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dynamicComponentService = inject(SkyDynamicComponentService);
  readonly #environmentInjector = inject(EnvironmentInjector);

  constructor() {
    this.isExpanded$ = this.#isExpandedSubject.asObservable();
  }

  public ngAfterViewInit(): void {
    this.#viewInitialized = true;
    this.#updateInlineHelp();
    this.#changeDetector.markForCheck();
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public agInit(params: SkyAgGridHeaderGroupParams | undefined): void {
    this.#agInitialized = true;
    this.params = params;
    this.#subscriptions.unsubscribe();
    if (!params) {
      return;
    }
    this.#subscriptions = new Subscription();
    this.#columnGroup = params.columnGroup.getProvidedColumnGroup();
    if (this.#columnGroup.isExpandable()) {
      this.#subscriptions.add(
        fromEventPattern<ColumnGroupOpenedEvent>(
          (handler) =>
            params.api.addEventListener('columnGroupOpened', handler),
          (handler) =>
            params.api.removeEventListener('columnGroupOpened', handler),
        ).subscribe((event) => {
          if (
            this.#columnGroup &&
            event.columnGroups.includes(this.#columnGroup)
          ) {
            this.#isExpandedSubject.next(this.#columnGroup.isExpanded());
          }
        }),
      );
    }
    this.#updateInlineHelp();
    this.#changeDetector.markForCheck();
  }

  public setExpanded($event: boolean): void {
    this.params?.setExpanded($event);
  }

  #updateInlineHelp(): void {
    if (!this.#viewInitialized || !this.#agInitialized) {
      return;
    }

    const colGroupDef = this.params?.columnGroup?.getColGroupDef();
    const inlineHelpComponent =
      colGroupDef?.headerGroupComponentParams?.inlineHelpComponent;

    if (inlineHelpComponent) {
      const headerGroupInfo = new SkyAgGridHeaderGroupInfo();
      headerGroupInfo.columnGroup = this.params?.columnGroup;
      headerGroupInfo.context = this.params?.context;
      headerGroupInfo.displayName = this.params?.displayName;

      this.#dynamicComponentService.createComponent(inlineHelpComponent, {
        providers: [
          {
            provide: SkyAgGridHeaderGroupInfo,
            useValue: headerGroupInfo,
          },
        ],
        environmentInjector: this.#environmentInjector,
        referenceEl: this.inlineHelpContainer?.nativeElement,
        location: SkyDynamicComponentLocation.ElementBottom,
      });
    }
  }
}
