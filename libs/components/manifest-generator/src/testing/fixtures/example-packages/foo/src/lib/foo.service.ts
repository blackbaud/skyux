import { Injectable, OnDestroy, Type } from '@angular/core';

/**
 * This describes the foo service and everything it does.
 */
@Injectable()
export class FooService implements OnDestroy {
  public foo = '';

  /**
   * This should not be documented.
   */
  public ngOnDestroy(): void {
    /* */
  }

  /**
   * This describes a public method that returns a promise.
   */
  public someMethod(): Promise<Type<string>> {
    return {} as unknown as Promise<Type<string>>;
  }
}
