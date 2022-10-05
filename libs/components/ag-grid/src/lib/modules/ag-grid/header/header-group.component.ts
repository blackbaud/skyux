import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
} from '@angular/core';

import { IHeaderGroupAngularComp } from 'ag-grid-angular';
import {
  ColumnGroupOpenedEvent,
  Events,
  ProvidedColumnGroup,
} from 'ag-grid-community';
import { BehaviorSubject, Observable, Subscription, fromEvent } from 'rxjs';

import { SkyAgGridHeaderGroupInfo } from '../types/header-group-info';
import { SkyAgGridHeaderGroupParams } from '../types/header-group-params';

import { SkyAgGridHeaderGroup } from './header-group-token';

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
  implements IHeaderGroupAngularComp, OnDestroy
{
  public params: SkyAgGridHeaderGroupParams | undefined = undefined;
  public isExpanded$: Observable<boolean>;
  public componentPortal: ComponentPortal<unknown> | undefined = undefined;

  #columnGroup: ProvidedColumnGroup | undefined = undefined;
  #isExpandedSubject = new BehaviorSubject<boolean>(false);
  #subscriptions = new Subscription();
  readonly #changeDetector: ChangeDetectorRef;
  readonly #injector: Injector;

  constructor(changeDetector: ChangeDetectorRef, injector: Injector) {
    this.#changeDetector = changeDetector;
    this.#injector = injector;
    this.isExpanded$ = this.#isExpandedSubject.asObservable();
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public agInit(params: SkyAgGridHeaderGroupParams): void {
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
    const colGroupDef = params.columnGroup.getColGroupDef();
    if (colGroupDef.headerGroupComponentParams?.inlineHelpComponent) {
      this.componentPortal = new ComponentPortal(
        colGroupDef.headerGroupComponentParams.inlineHelpComponent,
        null,
        Injector.create({
          providers: [
            {
              provide: SkyAgGridHeaderGroup,
              useValue: {
                columnGroup: params.columnGroup,
                context: params.context,
                displayName: params.displayName,
              } as SkyAgGridHeaderGroupInfo,
            },
          ],
          parent: this.#injector,
        })
      );
    } else {
      this.componentPortal = undefined;
    }
    this.#changeDetector.markForCheck();
  }

  public setExpanded($event: boolean): void {
    this.params.setExpanded($event);
  }
}
