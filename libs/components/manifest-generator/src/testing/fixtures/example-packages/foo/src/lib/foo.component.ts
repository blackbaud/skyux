import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  booleanAttribute,
  input,
  model,
  output,
} from '@angular/core';

@Component({
  imports: [],
  selector: 'lib-foo',
  template: ``,
})
export class FooComponent implements OnDestroy {
  /**
   * This describes an input with only a setter.
   *@default false
   */
  @Input({ transform: booleanAttribute })
  public set compact(value: boolean) {
    /* */
  }

  /**
   * This describes the foo input.
   */
  public foo = input<string | undefined>(undefined);

  /**
   * This describes the fooRequired input.
   */
  public fooRequired = input.required<string>();

  /**
   * This describes an input signal with a boolean transformer.
   */
  public fooWithTransformer = input(false, { transform: booleanAttribute });

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

  /**
   * This describes the items model.
   */
  public items = model<string[]>();

  /**
   * This describes the requiredItems model.
   */
  public requiredItems = model.required<string[]>();

  /**
   * This describes a public query property.
   * (The generator should not collect decorator information for this property.)
   */
  @ViewChild('foo')
  public myChild: ElementRef | undefined;

  public ngOnDestroy(): void {
    /* */
  }
}

/**
 * This is a non-standalone component with a Sky prefix.
 */
@Component({
  selector: 'sky-foo-non-standalone',
  standalone: false,
  template: ``,
})
export class SkyFooNonStandaloneComponent {}

/**
 * This is a standalone component with a Sky prefix and an overridden docsId.
 * @docsId sky-foo-standalone-override
 */
@Component({
  selector: 'sky-foo-standalone',
  template: ``,
})
export class SkyFooStandaloneComponent {}
