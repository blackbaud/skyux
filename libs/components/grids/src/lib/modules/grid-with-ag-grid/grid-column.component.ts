import { coerceNumberProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';

import {
  SkyGridColumnModelInterface,
  SkyGridColumnType,
} from './grid-column.model';
import { SkyGridColumnAlignment } from './types/grid-column-alignment';
import { SkyGridColumnDescriptionModelChange } from './types/grid-column-description-model-change';
import { SkyGridColumnHeadingModelChange } from './types/grid-column-heading-model-change';
import { SkyGridColumnInlineHelpPopoverModelChange } from './types/grid-column-inline-help-popover-model-change';

/**
 * Specifies the column information.
 */
@Component({
  selector: 'sky-grid-column',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyGridColumnComponent
  implements AfterViewInit, OnChanges, OnDestroy, SkyGridColumnModelInterface
{
  /**
   * The horizontal alignment of the column's data and header.
   * Options include: `"left"`, `"center"`, and `"right"`.
   * @default "left"
   */
  @Input()
  public alignment: SkyGridColumnAlignment = 'left';

  /**
   * The description for the column.
   */
  @Input()
  public description: string | undefined;

  /**
   * Whether to disable the highlighting of search text in the column.
   * @default false
   */
  @Input()
  public excludeFromHighlighting = false;

  /**
   * The property to retrieve cell information from an entry on the grid `data` array.
   * You must provide either the `id` or `field` property for every column,
   * but do not provide both. If `id` does not exist on a column, then `field` is the entry
   * for the grid `selectedColumnIds` array.
   */
  @Input()
  public field: string | undefined;

  /**
   * Text to display in the column header.
   */
  @Input()
  public heading: string | undefined;

  /**
   * Whether the column is initially hidden when grid `selectedColumnIds` are not provided.
   * @default false
   */
  @Input()
  public hidden = false;

  /**
   * The unique ID for the column. You must provide either the `id` or `field` property
   * for every column, but do not provide both. If `field` does not exist on a column,
   * then the `id` property retrieves cell information from an entry on the grid `data` array.
   */
  @Input()
  public id: string | undefined;

  /**
   * The template to display inside an inline help popup for this column.
   */
  @Input()
  public inlineHelpPopover: TemplateRef<unknown> | any | undefined;

  /**
   * Whether the column sorts the grid when users click the column header.
   * @default true
   */
  @Input()
  public isSortable = true;

  /**
   * Whether the column is locked. The intent is to display locked columns first
   * on the left side of the grid. If set to `true`, then users cannot drag the column
   * to another position and or drag other columns before the locked column.
   * @default false
   */
  @Input()
  public locked = false;

  /**
   * The search function to apply for the specific column. By default,
   * the column executes a string compare on the column data.
   * @default (value, searchText) => value.toString().toLowerCase().indexOf(searchText) !== -1
   */
  @Input()
  public search?: (value: any, searchText: string) => boolean;

  /**
   * The template for a column. This can be assigned as a reference
   * to the `template` attribute, or it can be assigned as a child of the `template` element
   * inside the `sky-grid-column` component. The template has access to the `value` variable,
   * which contains the value passed to the column, and the `row` variable, which contains
   * the entire row data.
   */
  @Input()
  public template: TemplateRef<unknown> | undefined;

  /**
   * Type of column. This field is used to choose how to render values in this column.
   */
  @Input()
  public type: SkyGridColumnType = 'text';

  /**
   * The width of the column in pixels.
   * If undefined, the column width is evenly distributed.
   */
  @Input({ transform: (value: unknown) => coerceNumberProperty(value) })
  public width: number | undefined;

  public readonly changes: Observable<void>;

  public descriptionChanges: EventEmitter<string> = new EventEmitter<string>();

  public descriptionModelChanges =
    new EventEmitter<SkyGridColumnDescriptionModelChange>();

  public headingChanges: EventEmitter<string> = new EventEmitter<string>();

  public headingModelChanges =
    new EventEmitter<SkyGridColumnHeadingModelChange>();

  public inlineHelpPopoverModelChanges =
    new EventEmitter<SkyGridColumnInlineHelpPopoverModelChange>();

  @ContentChildren(TemplateRef)
  private templates: QueryList<TemplateRef<unknown>>;

  #changes = new Subject<void>();
  #subscription = new Subscription();

  constructor() {
    this.changes = this.#changes.asObservable();
  }

  public ngAfterViewInit(): void {
    if (this.templates.first) {
      this.template = this.templates.first;
      this.#changes.next();
    }
    this.#subscription.add(
      this.templates.changes.subscribe(() => {
        if (this.templates.first) {
          this.template = this.templates.first;
          this.#changes.next();
        }
      }),
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['heading'] && changes['heading'].firstChange === false) {
      this.headingChanges.emit(this.heading);
      this.headingModelChanges.emit({
        value: this.heading,
        id: this.id,
        field: this.field,
      });
    }
    if (
      changes['description'] &&
      changes['description'].firstChange === false
    ) {
      this.descriptionChanges.emit(this.description);
      this.descriptionModelChanges.emit({
        value: this.description,
        id: this.id,
        field: this.field,
      });
    }
    if (
      changes['inlineHelpPopover'] &&
      changes['inlineHelpPopover'].firstChange === false
    ) {
      this.inlineHelpPopoverModelChanges.emit({
        value: this.inlineHelpPopover,
        id: this.id,
        field: this.field,
      });
    }
    this.#changes.next();
  }

  public ngOnDestroy(): void {
    this.#subscription.unsubscribe();
  }
}
