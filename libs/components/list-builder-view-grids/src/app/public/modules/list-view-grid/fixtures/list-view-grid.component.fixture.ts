import {
  Component,
  ContentChildren,
  OnInit,
  TemplateRef,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SkyListViewGridComponent } from '../list-view-grid.component';

@Component({
  selector: 'sky-test-cmp',
  template: require('./list-view-grid.component.fixture.html')
})
export class ListViewGridTestComponent implements OnInit {
  public hiddenColumns: string[] = ['hiddenCol1', 'hiddenCol2'];
  public asyncHeading = new BehaviorSubject<string>('');
  public asyncDescription = new BehaviorSubject<string>('');

  @ViewChild(SkyListViewGridComponent)
  public grid: SkyListViewGridComponent;

  @ContentChildren(TemplateRef)
  public templates: QueryList<TemplateRef<any>>;

  @ViewChildren(TemplateRef)
  public viewtemplates: QueryList<TemplateRef<any>>;

  public rowHighlightedId: string;

  public searchFn: (data: any, searchText: string) => boolean;

  public showNgIfCol: boolean = false;

  public ngOnInit() {
    setTimeout(() => {
      this.asyncHeading.next('Column1');
      this.asyncDescription.next('Column1 Description');
    }, 100);
  }
}
