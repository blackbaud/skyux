import { Observable, ReplaySubject } from 'rxjs';

/**
 * @internal
 * An API to provide default input values to child components.
 */
export class SkyDefaultInputProvider {
  #props: Record<string, Record<string, ReplaySubject<unknown>>> = {};

  public setValue(
    componentName: string,
    inputName: string,
    value: unknown
  ): void {
    const subject = this.#getSubject(componentName, inputName);
    subject.next(value);
  }

  public getObservable<T>(
    componentName: string,
    inputName: string
  ): Observable<T> | undefined {
    const test = this.#getSubject(componentName, inputName);
    return test.asObservable() as Observable<T>;
  }

  #getSubject(
    componentName: string,
    inputName: string
  ): ReplaySubject<unknown> {
    const inputSubject = this.#props[componentName]?.[inputName];

    if (!inputSubject) {
      const componentSubjects = this.#props[componentName] || {};
      componentSubjects[inputName] = new ReplaySubject(1);

      this.#props[componentName] = componentSubjects;
    }

    return this.#props[componentName][inputName];
  }
}
