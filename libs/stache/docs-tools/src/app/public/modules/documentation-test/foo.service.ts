import {
  Injectable
} from '@angular/core';

/**
 * This is the description for FooService.
 */
@Injectable()
export class FooService {

  /**
   * This is the description for FOOS.
   */
  public FOOS: string[] = [];

  /**
   * This is the description for createFoo().
   */
  public createFoo(bar: string, baz?: string): string[] {
    this.FOOS.push(`${bar}${baz}`);
    return this.FOOS;
  }
}
