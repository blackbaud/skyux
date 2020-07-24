import {
  SkyDataViewStateOptions
} from './data-view-state-options';

export class SkyDataViewState {
  public displayedColumnIds: string[] = [];
  public viewId: string;
  public additionalData: any;

  constructor(data: SkyDataViewStateOptions) {
    this.viewId = data.viewId;
    this.displayedColumnIds = data.displayedColumnIds || [];
    this.additionalData = data.additionalData;
  }

  public getViewStateOptions(): SkyDataViewStateOptions {
    return {
      viewId: this.viewId,
      displayedColumnIds: this.displayedColumnIds,
      additionalData: this.additionalData
    };
  }
}
