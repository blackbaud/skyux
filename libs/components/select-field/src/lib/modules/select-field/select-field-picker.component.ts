import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';
import { SkyListToolbarComponent } from '@skyux/list-builder';
import { SkyListFilterInlineModel } from '@skyux/list-builder';
import { ListItemModel } from '@skyux/list-builder-common';
import { SkyListViewChecklistComponent } from '@skyux/list-builder-view-checklist';
import { SkyModalInstance } from '@skyux/modals';

import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkySelectFieldPickerContext } from './select-field-picker-context';
import { SkySelectField } from './types/select-field';
import { SkySelectFieldSelectMode } from './types/select-field-select-mode';

@Component({
  selector: 'sky-select-field-picker',
  templateUrl: './select-field-picker.component.html',
  styleUrls: ['./select-field-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySelectFieldPickerComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  /**
   * Fires when a search is submitted from the picker's toolbar.
   * @internal
   */
  @Output()
  public searchApplied: EventEmitter<string> = new EventEmitter<string>();

  public categories: string[];
  public data: Observable<any>;
  public selectMode: SkySelectFieldSelectMode;
  public headingText: string;

  public set inMemorySearchEnabled(value: boolean) {
    if (value !== this._inMemorySearchEnabled) {
      this._inMemorySearchEnabled = value;
    }
  }

  public get inMemorySearchEnabled(): boolean {
    if (this._inMemorySearchEnabled === undefined) {
      return true;
    }

    return this._inMemorySearchEnabled;
  }

  public selectedCategory = this.defaultCategory;
  public selectedIds: any[] = [];

  public addNewRecordButtonClick = new Subject<void>();
  public showAddNewRecordButton = false;

  public get defaultCategory(): string {
    return 'any';
  }

  @ViewChild(SkyListViewChecklistComponent, {
    static: true,
  })
  private listViewChecklist: SkyListViewChecklistComponent;

  @ViewChild(SkyListToolbarComponent, {
    static: true,
  })
  private listToolbar: SkyListToolbarComponent;

  private ngUnsubscribe = new Subject<void>();

  private _inMemorySearchEnabled: boolean;

  constructor(
    private context: SkySelectFieldPickerContext,
    private instance: SkyModalInstance,
    private elementRef: ElementRef,
    private windowRef: SkyAppWindowRef
  ) {}

  public ngOnInit() {
    this.data = this.context.data;
    this.headingText = this.context.headingText;
    this.selectMode = this.context.selectMode;
    this.showAddNewRecordButton = this.context.showAddNewRecordButton;
    this.inMemorySearchEnabled = this.context.inMemorySearchEnabled;

    this.selectedIds = this.getSelectedIds();
    this.assignCategories();

    this.listToolbar.searchApplied
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((searchText: string) => {
        this.searchApplied.emit(searchText);
      });
  }

  public ngAfterContentInit() {
    this.windowRef.nativeWindow.setTimeout(() => {
      this.elementRef.nativeElement.querySelector('.sky-search-input').focus();
    });
  }

  public ngOnDestroy(): void {
    this.addNewRecordButtonClick.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onAddNewRecordButtonClick(): void {
    this.addNewRecordButtonClick.next();
  }

  public save() {
    this.latestData.subscribe((items: SkySelectField[]) => {
      const results = items.filter((item: SkySelectField) => {
        return this.selectedIds.indexOf(item.id) > -1;
      });
      this.instance.save(results);
    });
  }

  public close() {
    this.instance.close();
  }

  public filterByCategory(model: ListItemModel, category: string) {
    return (
      category === this.defaultCategory || model.data.category === category
    );
  }

  public onCategoryChange(change: SkyListFilterInlineModel, filter: any) {
    // Reset the selected values when the category changes.
    this.listViewChecklist.clearSelections();
    filter.changed(change);
  }

  public onSelectedIdsChange(selectedMap: Map<string, boolean>) {
    this.latestData.subscribe((items: SkySelectField[]) => {
      this.selectedIds = items
        .filter((item) => selectedMap.get(item.id))
        .map((item) => item.id);
    });
  }

  private assignCategories() {
    this.latestData.subscribe((items: SkySelectField[]) => {
      const allCategories = items.map((item) => item.category);
      // Remove duplicate category names:
      this.categories = allCategories.filter(
        (category: string, i: number, categories: string[]) => {
          return category && categories.indexOf(category) === i;
        }
      );
    });
  }

  private get latestData(): Observable<SkySelectField[]> {
    return this.data.pipe(take(1));
  }

  private getSelectedIds(): string[] {
    const context = this.context;
    const selectedValue = context.selectedValue;

    if (selectedValue) {
      if (context.selectMode === 'single') {
        return [context.selectedValue.id];
      }

      return context.selectedValue.map((item: SkySelectField) => item.id);
    }

    return [];
  }
}
