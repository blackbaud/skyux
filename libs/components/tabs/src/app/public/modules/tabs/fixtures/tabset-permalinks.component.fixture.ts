import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-tabset-permalinks-test',
  templateUrl: './tabset-permalinks.component.fixture.html'
})
export class SkyTabsetPermalinksFixtureComponent {

  public activeIndex: number;

  public permalinkId: string;

  public permalinkValue: string;

  public secondTabDisabled = false;

  public onActiveChange(index: number): void {
    this.activeIndex = index;
  }

  public disableSecondTab(): void {
    this.secondTabDisabled = true;
  }

}
