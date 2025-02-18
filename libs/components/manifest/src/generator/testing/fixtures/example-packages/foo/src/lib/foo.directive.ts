import {
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  input,
  output,
} from '@angular/core';

/**
 * This is a directive with a lambda name.
 */
@Directive({
  selector: '[fooLambda]',
  standalone: true,
})
export class λ2 {}

/**
 * This is a directive without any inputs/outputs.
 */
@Directive({
  selector: '[foo]',
  standalone: true,
})
export class FooDirective {}

@Directive({
  selector: '[foo]',
  standalone: true,
})
export class FooWithInputsOutputsDirective {
  /**
   * This describes a decorated input.
   * @required
   */
  @Input()
  public inputA = true;

  /**
   * This describes a signal input.
   * @default true
   */
  public inputB = input<boolean>(true);

  /**
   * This describes an input with a setter.
   * @default true
   * @required
   */
  @Input()
  public set inputC(value: boolean) {
    this.#_inputC = value;
  }

  public get inputC(): boolean {
    return this.#_inputC;
  }

  @Input()
  public set inputD(value: boolean) {
    this.#_inputD = value;
  }

  /**
   * This describes an input with a getter.
   * @required
   * @defaultValue false
   */
  public get inputD(): boolean {
    return this.#_inputD;
  }

  /**
   * This describes an input with an alias.
   */
  @Input('alias1')
  public inputWithAlias1: TemplateRef<unknown> | undefined;

  @Input({ alias: 'alias2' })
  public inputWithAlias2: TemplateRef<unknown> | undefined;

  /**
   * This describes a decorated output.
   */
  @Output()
  public outputA = new EventEmitter<void>();

  /**
   * This describes a signal output.
   */
  public outputB = output<void>();

  #_inputC = true;
  #_inputD = false;
}
