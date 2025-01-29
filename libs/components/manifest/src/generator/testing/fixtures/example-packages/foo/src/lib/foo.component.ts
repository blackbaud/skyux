import {
  Component,
  EventEmitter,
  Input,
  Output,
  input,
  output,
} from '@angular/core';

@Component({
  imports: [],
  selector: 'lib-foo',
  standalone: true,
  template: ``,
})
export class FooComponent {
  /**
   * This describes the foo input.
   */
  public foo = input<string | undefined>(undefined);

  /**
   * This describes the fooRequired input.
   */
  public fooRequired = input.required<string>();

  /**
   * This describes the bar input.
   * @default 'baz'
   * @required
   */
  @Input()
  public bar: string | undefined;

  /**
   * This describes the onClick output.
   */
  public onClick = output<void>();

  /**
   * This describes the onTouch output.
   */
  @Output()
  public onTouch = new EventEmitter<void>();
}

/**
 * This is a non-standalone component with a Sky prefix. We need to include the
 * prefix so that it's included in the owning module's docsIncludeIds array.
 */
@Component({
  selector: 'sky-foo-non-standalone',
  standalone: false,
  template: ``,
})
export class SkyFooNonStandaloneComponent {}

/**
 * This is a standalone component with a Sky prefix and an overridden docsId.
 * We need to include the prefix so that it's included in the owning module's
 * docsIncludeIds array.
 * @docsId sky-foo-standalone-override
 */
@Component({
  selector: 'sky-foo-standalone',
  template: ``,
})
export class SkyFooStandaloneComponent {}
