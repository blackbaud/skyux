import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SkyInputBoxPopulateArgs } from './input-box-populate-args';
import { SkyInputBoxComponent } from './input-box.component';

/**
 * @internal
 */
@Injectable()
export class SkyInputBoxHostService {
  #host: SkyInputBoxComponent | undefined;

  public get controlId(): string {
    return this.#host?.controlId ?? '';
  }

  public get labelText(): string {
    return this.#host?.labelText ?? '';
  }

  public get ariaDescribedBy(): Observable<string | undefined> | undefined {
    return this.#ariaDescribedBy;
  }

  #ariaDescribedBy: Observable<string | undefined> | undefined;

  public init(host: SkyInputBoxComponent): void {
    this.#host = host;
    this.#ariaDescribedBy = host.ariaDescribedBy.asObservable();
  }

  public populate(args: SkyInputBoxPopulateArgs): void {
    if (!this.#host) {
      throw new Error(
        'Cannot populate the input box because `SkyInputBoxHostService` has not yet been initialized. Try running the `populate` method within an Angular lifecycle hook, such as `ngOnInit`.',
      );
    }

    this.#host.populate(args);
  }
}
