import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

import { map } from 'rxjs/operators';

import { LipsumComponent } from '../../../../shared/lipsum/lipsum.component';
import { DataManagerLargeComponent } from '../../../ag-grid/data-manager-large/data-manager-large.component';
import { CourseCatalogComponent } from '../shared/course-catalog/course-catalog';

@Component({
  selector: 'app-blocks-page-data-grid',
  imports: [
    CourseCatalogComponent,
    DataManagerLargeComponent,
    LipsumComponent,
    RouterLink,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyPageModule,
  ],
  templateUrl: './blocks-page-data-grid.component.html',
  styles: `
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
    }
  `,
})
export class BlocksPageDataGridComponent {
  protected readonly options = [
    ['courseCatalog', 'Course catalog'],
    ['courseCatalogNoDm', 'Course catalog without data manager'],
    ['baseball', 'Baseball'],
  ];
  protected readonly show = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map((params) => params.get('show') || 'courseCatalog'),
    ),
  );
}
export default BlocksPageDataGridComponent;
