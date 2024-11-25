/* eslint-disable @typescript-eslint/no-unused-vars */
import { Observable, of } from 'rxjs';

import { λ2 } from './foo.directive';

export class FooBaseClass {}

export class FooBasicTypeParamClass<T> {
  public ref: T | undefined;
}

export class FooBasicTypeParamDefaultValueClass<T = boolean> {
  public ref: T | undefined;
}

type ResourceKey = string;
type TemplatedResource = [ResourceKey, ...unknown[]];
type ResourceDictionary = Record<string, ResourceKey | TemplatedResource>;

/**
 * This is the foo class.
 */
export class FooClass<TClass extends FooBaseClass> {
  /**
   * @param a This describes the param 'a'.
   * @param b This describes the param 'b'.
   */
  public arrayOfFunctionTypes!: ((a: boolean, b?: string) => void)[];
  public arrayOfFunctionTypesOrUndefined:
    | ((a: boolean, b?: string) => void)[]
    | undefined;
  public arrayOfIntrinsicTypes: string[] | undefined;
  public arrayOfReflectionTypes: { a: boolean; b: string }[] | undefined;
  public literalType: 1 | 0 | undefined;
  public intrinsicType: string | undefined;
  public mapType: Map<string, number> | undefined;
  public referenceType: TClass | undefined;
  public reflectionType!: {
    a: boolean;
    b?: string;
  };
  public reflectionTypeOrUndefined:
    | {
        a: boolean;
        b?: string;
      }
    | undefined;
  public reflectionIndexSignatureType:
    | {
        [key: string]: boolean;
      }
    | undefined;

  public closureType!: () => void;
  public closureTypeOrUndefined: (() => void) | undefined;
  public unionType: 'a' | 'b' | true | null | undefined;
  public lambdaRef!: λ2;

  /**
   * Describes a method which returns a MappedType (e.g. `{ [K in keyof T]: string }`).
   */
  public getStrings<TResource extends ResourceDictionary>(
    dictionary: TResource,
  ): Observable<{ [K in keyof TResource]: string }> {
    return of();
  }

  /**
   * Describes a method without any parameters.
   */
  public sayHello(): void {
    return;
  }
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
