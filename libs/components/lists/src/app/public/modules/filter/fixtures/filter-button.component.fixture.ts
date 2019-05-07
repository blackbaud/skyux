import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './filter-button.component.fixture.html'
})
export class FilterButtonTestComponent {
  public filtersActive: boolean = false;
  public showButtonText: boolean = false;
  public buttonClicked: boolean = false;
  public buttonId: string;
  public ariaExpanded: boolean;
  public ariaControls: string;
  public filterButtonClicked() {
    this.buttonClicked = true;
  }
}
