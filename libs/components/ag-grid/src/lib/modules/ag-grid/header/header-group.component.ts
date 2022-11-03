import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentOptions,
  SkyDynamicComponentService,
} from '@skyux/core';

import { IHeaderGroupAngularComp } from 'ag-grid-angular';
import {
  ColumnGroupOpenedEvent,
  Events,
  ProvidedColumnGroup,
} from 'ag-grid-community';
import { BehaviorSubject, Observable, Subscription, fromEvent } from 'rxjs';

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
  public inlineHelpContainer: ElementRef;

  public params: SkyAgGridHeaderGroupParams | undefined = undefined;
  public isExpanded$: Observable<boolean>;

  #columnGroup: ProvidedColumnGroup | undefined = undefined;
  #isExpandedSubject = new BehaviorSubject<boolean>(false);
  #subscriptions = new Subscription();
  readonly #changeDetector: ChangeDetectorRef;
  readonly #dynamicComponentService: SkyDynamicComponentService;
  #inlineHelpComponentRef: ComponentRef<unknown> | undefined;
  #viewInitialized = false;
  #agIntialized = false;

  constructor(
    changeDetector: ChangeDetectorRef,
    dynamicComponentService: SkyDynamicComponentService
  ) {
    this.#changeDetector = changeDetector;
    this.#dynamicComponentService = dynamicComponentService;
    this.isExpanded$ = this.#isExpandedSubject.asObservable();
  }

  public ngAfterViewInit(): void {
    this.#viewInitialized = true;
    this.#updateInlineHelp();
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public agInit(params: SkyAgGridHeaderGroupParams): void {
    this.#agIntialized = true;
    this.params = params;
    this.#subscriptions.unsubscribe();
    if (!this.params) {
      return;
    }
    this.#subscriptions = new Subscription();
    this.#columnGroup = this.params.columnGroup.getProvidedColumnGroup();
    if (this.#columnGroup.isExpandable()) {
      this.#subscriptions.add(
        fromEvent(this.params.api, Events.EVENT_COLUMN_GROUP_OPENED).subscribe(
          (event: ColumnGroupOpenedEvent) => {
            if (event.columnGroup === this.#columnGroup) {
              this.#isExpandedSubject.next(this.#columnGroup.isExpanded());
            }
          }
        )
      );
    }
    this.#changeDetector.markForCheck();
  }

  public setExpanded($event: boolean): void {
    this.params.setExpanded($event);
  }

  #updateInlineHelp(): void {
    if (!this.#viewInitialized || !this.#agIntialized) {
      return;
    }
    const colGroupDef = this.params?.columnGroup?.getColGroupDef();
    const inlineHelpComponent =
      colGroupDef?.headerGroupComponentParams?.inlineHelpComponent;
    if (
      inlineHelpComponent &&
      (!this.#inlineHelpComponentRef ||
        this.#inlineHelpComponentRef.componentType !== inlineHelpComponent)
    ) {
      this.#dynamicComponentService.removeComponent(
        this.#inlineHelpComponentRef
      );
      this.#inlineHelpComponentRef =
        this.#dynamicComponentService.createComponent(inlineHelpComponent, {
          providers: [
            {
              provide: SkyAgGridHeaderGroupInfo,
              useValue: {
                columnGroup: this.params.columnGroup,
                context: this.params.context,
                displayName: this.params.displayName,
              } as SkyAgGridHeaderGroupInfo,
            },
          ],
          referenceEl: this.inlineHelpContainer.nativeElement,
          location: SkyDynamicComponentLocation.ElementBottom,
        } as SkyDynamicComponentOptions);
    } else if (!inlineHelpComponent) {
      this.#dynamicComponentService.removeComponent(
        this.#inlineHelpComponentRef
      );
    }
  }
}
