import { Injectable } from '@angular/core';

import { SkyViewkeeperOptions } from './viewkeeper-options';

@Injectable()
export class SkyViewkeeperHostOptions implements SkyViewkeeperOptions {
  public boundaryEl?: HTMLElement;

  public el?: HTMLElement;

  public scrollableHost?: HTMLElement;

  public setWidth?: boolean;

  public verticalOffset?: number;

  public verticalOffsetEl?: HTMLElement;

  public viewportMarginTop?: number;
}
