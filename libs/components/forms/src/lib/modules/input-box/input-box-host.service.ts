import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyInputBoxPopulateArgs } from './input-box-populate-args';
import { SkyInputBoxComponent } from './input-box.component';

/**
 * @internal
 */
@Injectable()
export class SkyInputBoxHostService {
  #host: SkyInputBoxComponent | undefined;
  #requiredSubject = new BehaviorSubject<boolean>(false);

  public required = this.#requiredSubject.asObservable();

  public get controlId(): string {
    return this.#host?.controlId ?? '';
  }

  public get labelId(): string {
    return this.#host?.labelText ? this.#host.labelId : '';
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

  public setHintText(hintText: string | undefined): void {
    if (!this.#host) {
      throw new Error(
        'Cannot set hint text on the input box because `SkyInputBoxHostService` has not yet been initialized.',
      );
    }

    this.#host.setHostHintText(hintText);
  }

  public setHintTextHidden(hide: boolean): void {
    if (!this.#host) {
      throw new Error(
        'Cannot hide hint text on the input box because `SkyInputBoxHostService` has not yet been initialized.',
      );
    }

    this.#host.setHintTextHidden(hide);
  }

  public setHintTextScreenReaderOnly(hide: boolean): void {
    if (!this.#host) {
      throw new Error(
        'Cannot remove hint text on the input box because `SkyInputBoxHostService` has not yet been initialized.',
      );
    }

    this.#host.setHintTextScreenReaderOnly(hide);
  }

  public setRequired(required: boolean): void {
    this.#requiredSubject.next(required);
  }
}
