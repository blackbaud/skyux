import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyInputBoxPopulateArgs } from './input-box-populate-args';
import { SkyInputBoxComponent } from './input-box.component';

/**
 * @internal
 */
@Injectable()
export class SkyInputBoxHostService implements OnDestroy {
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

  public ngOnDestroy(): void {
    this.#requiredSubject.complete();
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

  /**
   * Set required so that input box displays the label correctly. When the input is supplied by the consumer it is a content
   * child that input box can read required from and this is unnecessary. When the input is supplied internally by the
   * component the input box does not have a ref to it, so the component needs to inform the input box of its required state.
   */
  public setRequired(required: boolean): void {
    this.#requiredSubject.next(required);
  }
}
