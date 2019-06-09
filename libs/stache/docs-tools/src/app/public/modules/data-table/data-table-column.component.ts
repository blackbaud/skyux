import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-data-table-column',
  templateUrl: './data-table-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDataTableColumnComponent {

  /**
   * The data property key to reference.
   */
  @Input()
  public dataPropertyReference: string;

  @Input()
  public heading: string;

  /**
   * The foo for the baz!
   */
  @Input()
  public set foo(value: string) {
    this._foo = value;
  }

  /**
   * @defaultValue baz
   */
  public get foo(): string {
    return this._foo || 'baz';
  }

  private _foo: string;

}
