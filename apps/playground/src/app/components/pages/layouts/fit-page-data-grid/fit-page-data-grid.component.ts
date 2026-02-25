import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SkyPageModule } from '@skyux/pages';

import { map } from 'rxjs/operators';

import { DataManagerLargeComponent } from '../../../ag-grid/data-manager-large/data-manager-large.component';
import { CourseCatalogComponent } from '../shared/course-catalog/course-catalog';

type Show = 'courseCatalog' | 'courseCatalogNoDm' | 'museum';

@Component({
  selector: 'app-fit-page-data-grid',
  imports: [
    SkyPageModule,
    DataManagerLargeComponent,
    CourseCatalogComponent,
    RouterLink,
  ],
  templateUrl: './fit-page-data-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FitPageDataGridComponent {
  protected readonly options: readonly [Show, string][] = [
    ['courseCatalog', 'Course catalog'],
    ['courseCatalogNoDm', 'Course catalog without data manager'],
    ['museum', 'Museum data'],
  ];
  protected readonly show = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map((params) => (params.get('show') as Show | null) ?? 'courseCatalog'),
    ),
    { initialValue: 'courseCatalog' as Show },
  );
}
export default FitPageDataGridComponent;
