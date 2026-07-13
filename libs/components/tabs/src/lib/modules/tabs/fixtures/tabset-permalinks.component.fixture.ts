import { Component, inject, model } from '@angular/core';
import { Router } from '@angular/router';

import { SkyTabIndex } from '../tab-index';

@Component({
  selector: 'sky-tabset-permalinks-test',
  templateUrl: './tabset-permalinks.component.fixture.html',
  standalone: false,
})
export class SkyTabsetPermalinksFixtureComponent {
  public activeIndex = model<SkyTabIndex | undefined>(0);

  public permalinkId: string | undefined;

  public permalinkValue: string | undefined;

  public secondTabDisabled = false;

  public showIt = model<boolean>(true);

  public readonly router = inject(Router);

  public onActiveChange(index: SkyTabIndex): void {
    this.activeIndex.set(index);
  }

  public disableSecondTab(): void {
    this.secondTabDisabled = true;
  }

  public removeFromExistence(): void {
    this.showIt.set(false);
  }
}
