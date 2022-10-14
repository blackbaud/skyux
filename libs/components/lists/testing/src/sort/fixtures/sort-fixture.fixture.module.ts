import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkySortModule } from '@skyux/lists';

import { SortFixtureTestComponent } from './sort-fixture.component.fixture';

/**
 * @internal
 */
@NgModule({
  declarations: [SortFixtureTestComponent],
  imports: [CommonModule, SkySortModule],
})
export class SkySortTestingModule {}
