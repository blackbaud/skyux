import {
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  OnDestroy,
  QueryList
} from '@angular/core';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  ListState,
  ListStateDispatcher,
  ListViewModel,
  ListViewsSetActiveAction,
  ListViewsModel
} from '../list/state';

import {
  SkyListViewSwitcherButtonModel
} from './list-view-switcher-button.model';

import {
  SkyListViewSwitcherCustomButtonComponent
} from './list-view-switcher-custom-button.component';

@Component({
  selector: 'sky-list-view-switcher',
  templateUrl: './list-view-switcher.component.html',
  styleUrls: ['./list-view-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyListViewSwitcherComponent implements AfterViewInit, OnDestroy {

  public activeView: number;

  public availableViewButtons: SkyListViewSwitcherButtonModel[];

  public currentIcon: string;

  public isMobile: boolean = false;

  public showSwitcher: boolean = false;

  private currentViews: ListViewModel[];

  @ContentChildren(SkyListViewSwitcherCustomButtonComponent)
  private customViewButtons: QueryList<SkyListViewSwitcherCustomButtonComponent>;

  private ngUnsubscribe = new Subject();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dispatcher: ListStateDispatcher,
    private mediaQueryService: SkyMediaQueryService,
    private state: ListState
  ) { }

  public ngAfterViewInit(): void {

    this.mediaQueryService
      .subscribe((newBreakpoint: SkyMediaBreakpoints) => {
        if (newBreakpoint === SkyMediaBreakpoints.xs) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
        this.changeDetector.markForCheck();
      });

    this.state
      .takeUntil(this.ngUnsubscribe)
      .map(s => s.views)
      .distinctUntilChanged(this.listViewsModelCompare)
      .subscribe((views: ListViewsModel) => {
        this.currentViews = views.views;
        this.resetAvailableViews(views.active);
      });

    this.customViewButtons.changes.subscribe(() => this.resetAvailableViews());
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public activateView(view: ListViewModel, viewIndex: number): void {
    if (this.activeView !== viewIndex) {

      // Without this timeout the list updates too quickly and the dropdown on mobile does not close
      setTimeout(() => {
        this.dispatcher.next(new ListViewsSetActiveAction(view.id));
      });

      this.currentIcon = this.availableViewButtons
        .find(availableView => availableView.viewModel === view).icon;

      this.activeView = viewIndex;

    }
  }

  // Ignoring coverage here due to a bug where we can't test hiding and showing views. We should fix
  // this when that bug is fixed.
  /* istanbul ignore next */
  private listViewsModelCompare(listViewsModelA: ListViewsModel, listViewsModelB: ListViewsModel): boolean {
    if (listViewsModelA.active !== listViewsModelB.active) {
      return false;
    }

    const viewsA = listViewsModelA.views;
    const viewsB = listViewsModelB.views;

    if (viewsA === viewsB) {
      return true;
    }
    if (viewsA === undefined || viewsB === undefined) {
      return false;
    }

    if (viewsA.length !== viewsB.length) {
      return false;
    }

    for (let i = 0; i < viewsA.length; ++i) {
      if (viewsA[i] !== viewsB[i]) {
        return false;
      }
    }
    return true;
  }

  private resetAvailableViews(activeViewId?: string): void {
    if (this.currentViews.length <= 1) {
      this.showSwitcher = false;
    } else {
      const viewNames = this.currentViews.map(view => { return view.name; });

      this.availableViewButtons = [];

      if (viewNames.indexOf('Grid View') >= 0) {
        this.availableViewButtons.push({
          icon: 'table',
          viewModel: this.currentViews.find(view => view.name === 'Grid View'),
          label: 'Table view'
        });
      }

      // Future built in types will go here. Per the design doc future icons would be:
      // Repeater
      //  Icon: list
      //  Label: “List view”
      // Card
      //  Icon: th-large
      //  Label: “Card view”
      // Map
      //  Icon: map-marker
      //  Label: “Map view”
      // Calendar
      //  Icon: calendar
      //  Label: “Calendar view”

      this.customViewButtons.forEach(customViewButton => {
        if (customViewButton.view &&
          this.currentViews.map(view => { return view.id; }).indexOf(customViewButton.view.id) >= 0) {
          this.availableViewButtons.push({
            icon: customViewButton.icon,
            viewModel: this.currentViews.find(view => view.name === customViewButton.view.label),
            label: customViewButton.label
          });
        }
      });

      let activeView = this.currentViews.find(view => view.id === activeViewId);
      this.activeView = this.currentViews.indexOf(activeView);

      let activeViewData = this.availableViewButtons
        .find(availableView => availableView.viewModel === activeView);

      /* sanity check */
      /* istanbul ignore else */
      if (activeViewData) {
        this.currentIcon = activeViewData.icon;
      }

      if (this.availableViewButtons.length >= 2) {
        this.showSwitcher = true;
      }

      this.changeDetector.detectChanges();
    }
  }
}
