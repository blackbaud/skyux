import { TemplateRef } from '@angular/core';

import { SkyGridColumnAlignment } from './types/grid-column-alignment';

/**
 * @deprecated `SkyGridComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
 */
export class SkyGridColumnModel {
  public template: TemplateRef<unknown>;
  public id: string;
  public field: string;
  public heading: string;
  public inlineHelpPopover: any;
  public type: string;
  public width: number;
  public hidden: boolean;
  public locked: boolean;
  public description: string;
  public isSortable = true;
  public excludeFromHighlighting: boolean;

  /**
   * The horizontal alignment of the column's data and header.
   */
  public alignment: SkyGridColumnAlignment;

  public searchFunction: (data: any, searchText: string) => boolean;

  constructor(template: TemplateRef<unknown>, data?: any) {
    this.template = template;

    if (data) {
      this.id = data.id || data.field;
      this.type = data.type;
      this.field = data.field;
      this.heading = data.heading;
      this.inlineHelpPopover = data.inlineHelpPopover;
      this.width = data.width ? Number(data.width) : undefined;
      this.hidden = data.hidden;
      this.locked = data.locked;
      this.description = data.description;
      this.searchFunction = data.searchFunction;
      this.isSortable = data.isSortable;
      this.excludeFromHighlighting = data.excludeFromHighlighting;
      this.alignment = data.alignment;
    }
  }
}
