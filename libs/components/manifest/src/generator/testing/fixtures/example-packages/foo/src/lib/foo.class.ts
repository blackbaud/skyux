export class FooBaseClass {}

export class FooBasicTypeParamClass<T> {
  public ref: T | undefined;
}

export class FooBasicTypeParamDefaultValueClass<T = boolean> {
  public ref: T | undefined;
}

/**
 * This is the foo class.
 */
export class FooClass<TClass extends FooBaseClass> {
  public arrayOfFunctionTypes: (() => void)[] | undefined;
  public arrayOfIntrinsicTypes: string[] | undefined;
  public arrayOfReflectionTypes: { a: boolean; b: string }[] | undefined;
  public literalType: 1 | 0 | undefined;
  public intrinsicType: string | undefined;
  public mapType: Map<string, number> | undefined;
  public referenceType: TClass | undefined;
  public reflectionType:
    | {
        a: boolean;
        b?: string;
      }
    | undefined;
  public closureType: (() => void) | undefined;
  public unionType: 'a' | 'b' | true | null | undefined;
}

export class FooWithStaticPropertiesClass {
  /**
   * This describes the static property.
   */
  public static someStaticProperty = false;

  /**
   * This describes the static method.
   */
  public static someStaticMethod(): boolean {
    return true;
  }
}
