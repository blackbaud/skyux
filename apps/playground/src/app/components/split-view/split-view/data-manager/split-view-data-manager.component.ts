import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import {
  SkyConfirmCloseEventArgs,
  SkyConfirmService,
  SkyConfirmType,
} from '@skyux/modals';
import {
  SkySplitViewMessage,
  SkySplitViewMessageType,
} from '@skyux/split-view';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-split-view-data-manager',
  templateUrl: './split-view-data-manager.component.html',
  styleUrls: ['./split-view-data-manager.component.scss'],
  standalone: false,
})
export class SplitViewDataManagerComponent implements OnInit {
  public set activeIndex(value: number) {
    this._activeIndex = value;
    this.activeRecord = this.items[this._activeIndex];
  }

  public get activeIndex(): number {
    return this._activeIndex;
  }

  public activeRecord: any;

  public hasUnsavedWork = false;

  public items = [
    { id: 1, name: 'Jennifer Stanley', amount: 12.45, date: '04/28/2019' },
    { id: 2, name: 'Jennifer Stanley', amount: 52.39, date: '04/22/2019' },
    { id: 3, name: 'Jennifer Stanley', amount: 9.12, date: '04/09/2019' },
    { id: 4, name: 'Jennifer Stanley', amount: 193.0, date: '03/27/2019' },
    { id: 5, name: 'Jennifer Stanley', amount: 19.89, date: '03/11/2019' },
    { id: 6, name: 'Jennifer Stanley', amount: 214.18, date: '02/17/2019' },
    { id: 7, name: 'Jennifer Stanley', amount: 4.53, date: '02/26/2019' },
  ];

  public splitViewStream = new Subject<SkySplitViewMessage>();

  public width: number;

  private _activeIndex = 0;

  public changeDetectorRef = inject(ChangeDetectorRef);
  public confirmService = inject(SkyConfirmService);
  public dataManagerService = inject(SkyDataManagerService);
  public dock = undefined;

  constructor() {
    this.activeIndex = 0;
  }

  public ngOnInit(): void {
    this.dataManagerService.initDataManager({
      activeViewId: 'dataManagerView',
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
        views: [
          {
            viewId: 'dataManagerView',
          },
        ],
      }),
    });
    this.dataManagerService.initDataView(this.#splitViewConfig);
  }

  public onItemClick(index: number): void {
    if (this.hasUnsavedWork && index !== this.activeIndex) {
      this.confirmService
        .open({
          message:
            'You have unsaved work. Would you like to save it before you change records?',
          type: SkyConfirmType.YesCancel,
        })
        .closed.subscribe((closeArgs: SkyConfirmCloseEventArgs) => {
          if (closeArgs.action.toLowerCase() === 'yes') {
            this.activeIndex = index;
            this.setFocusInWorkspace();
          }
        });
    } else {
      this.activeIndex = index;
      this.setFocusInWorkspace();
    }
  }

  public submitForm(): void {
    if (this.hasUnsavedWork) {
      this.confirmService
        .open({
          message:
            'You have unsaved work. Would you like to save it before you change records?',
          type: SkyConfirmType.YesCancel,
        })
        .closed.subscribe((closeArgs: SkyConfirmCloseEventArgs) => {
          if (closeArgs.action.toLowerCase() === 'yes') {
            alert('Form submitted!');
            this.setFocusInWorkspace();
          }
        });
    } else {
      alert('Form submitted!');
      this.setFocusInWorkspace();
    }
  }

  private setFocusInWorkspace(): void {
    const message: SkySplitViewMessage = {
      type: SkySplitViewMessageType.FocusWorkspace,
    };

    this.splitViewStream.next(message);
  }

  #splitViewConfig: SkyDataViewConfig = {
    id: 'dataManagerView',
    name: 'Split View Data Manager View',
    sortEnabled: true,
    searchEnabled: true,
  };
}
