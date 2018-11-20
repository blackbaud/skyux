import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  SkyListFilterInlineModel
} from '@skyux/list-builder/modules/list-filters/list-filter-inline.model';

import {
  SkyListViewChecklistComponent
} from '@skyux/list-builder-view-checklist';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkySelectField,
  SkySelectFieldSelectMode
} from './types';

import { SkySelectFieldPickerContext } from './select-field-picker-context';

@Component({
  selector: 'sky-select-field-picker',
  templateUrl: './select-field-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySelectFieldPickerComponent implements OnInit, AfterContentInit {
  public categories: string[];
  public data: Observable<any>;
  public selectMode: SkySelectFieldSelectMode;
  public headingText: string;

  public readonly defaultCategory = 'any';
  public selectedCategory = this.defaultCategory;
  public selectedIds: any[] = [];

  @ViewChild(SkyListViewChecklistComponent)
  private listViewChecklist: SkyListViewChecklistComponent;

  constructor(
    private context: SkySelectFieldPickerContext,
    private instance: SkyModalInstance,
    private elementRef: ElementRef,
    private windowRef: SkyWindowRefService
  ) { }

  public ngOnInit() {
    this.data = this.context.data;
    this.headingText = this.context.headingText;
    this.selectMode = this.context.selectMode;
    this.selectedIds = this.getSelectedIds();
    this.assignCategories();
  }

  public ngAfterContentInit() {
    this.windowRef.getWindow().setTimeout(() => {
      this.elementRef.nativeElement.querySelector('.sky-search-input').focus();
    });
  }

  public save() {
    this.latestData.subscribe((items: SkySelectField[]) => {
      const results = items.filter((item: SkySelectField) => {
        return (this.selectedIds.indexOf(item.id) > -1);
      });
      this.instance.save(results);
    });
  }

  public close() {
    this.instance.close();
  }

  public filterByCategory(model: ListItemModel, category: string) {
    return (category === this.defaultCategory || model.data.category === category);
  }

  public onCategoryChange(change: SkyListFilterInlineModel, filter: any) {
    // Reset the selected values when the category changes.
    this.listViewChecklist.clearSelections();
    filter.changed(change);
  }

  public onSelectedIdsChange(selectedMap: Map<string, boolean>) {
    this.latestData.subscribe((items: SkySelectField[]) => {
      this.selectedIds = items.filter(item => selectedMap.get(item.id))
        .map(item => item.id);
    });
  }

  private assignCategories() {
    this.latestData.subscribe((items: SkySelectField[]) => {
      const allCategories = items.map(item => item.category);
      // Remove duplicate category names:
      this.categories = allCategories.filter((category: string, i: number, categories: string[]) => {
        return (category && categories.indexOf(category) === i);
      });
    });
  }

  private get latestData(): Observable<SkySelectField[]> {
    return this.data.take(1);
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
