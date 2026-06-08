/* eslint-disable @typescript-eslint/no-unused-vars */
import { Observable, of } from 'rxjs';

import { λ2 } from './foo.directive';

export class FooBaseClass {}

export class FooBasicTypeParamClass<T> {
  public ref!: T;
  public refOrUndefined: T | undefined;
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
   * This is a static getter without a setter.
   * @deprecated
   */
  public static get count(): number {
    return 1;
  }

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

  public closureType!: () => void;

  public closureTypeOrUndefined: (() => void) | undefined;

  public intrinsicType: string | undefined;

  public lambdaRef!: λ2;

  public literalType: 1 | 0 | undefined;

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

  public unionType: 'a' | 'b' | true | null | undefined;

  /**
   * Describes an internal property.
   * @internal
   */
  public internalProperty: string | undefined;

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
  public methodWithoutParameters(): void {
    return;
  }
}

/**
 * This describes the foo abstract class.
 *
 * It has multiple paragraphs in its description.
 */
export abstract class FooWithStaticPropertiesClass {
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

  /**
   * This describes the abstract method.
   */
  public abstract someAbstractMethod(): void;
}

/**
 * @docsId docs-id-override
 */
export class FooWithDocsIdOverrideClass {}

/**
 * @title This is a sample title
 * @foobar This is an unrecognized tag
 */
export class FooWithExtraTagsClass {}

/**
 * This class has Angular lifecycle methods that should be excluded.
 */
export class FooWithAngularLifecycleClass {
  /**
   * This is ngOnInit and should not appear in the manifest.
   */
  public ngOnInit(): void {
    return;
  }

  /**
   * This is ngOnDestroy and should not appear in the manifest.
   */
  public ngOnDestroy(): void {
    return;
  }

  /**
   * This is a regular method that should appear in the manifest.
   */
  public regularMethod(): void {
    return;
  }
}

/**
 * This is an empty class with no properties or methods.
 */
export class FooEmptyClass {}
