import {
  Component
} from '@angular/core';

@Component({
  selector: 'page-summary-visual',
  templateUrl: './page-summary-visual.component.html'
})
export class PageSummaryVisualComponent {
  public name = 'Robert C. Hernandez';

  public showAlert = false;

  public showImage = false;

  public showTitle = false;

  public showSubtitle = false;

  public showStatus = false;

  public showContent = false;

  public showKeyInfo = false;

  [key: string]: boolean | string;

  public get itemsToShow(): string {
    return this._itemsToShow;
  }

  public set itemsToShow(value: string) {
    let itemsToShow = value.split(',');

    /* tslint:disable */
    itemsToShow.forEach((itemToShow) => {
        this['show' + itemToShow] = true;
    });
    /* tslint:enable */
    this._itemsToShow = value;
  }

  private _itemsToShow = '';
}
