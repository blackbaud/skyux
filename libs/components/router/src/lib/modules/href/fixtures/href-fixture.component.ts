import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

import { SkyHrefModule } from '../href.module';
import { SkyHrefQueryParams } from '../types/href-query-params';

@Component({
  selector: 'sky-smart-link-fixture',
  templateUrl: 'href-fixture.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyHrefModule],
})
export class HrefDirectiveFixtureComponent {
  @Input()
  public set dynamicLink(value: string | any[] | undefined) {
    this.#_dynamicLink = value;
    this.#changeDetectorRef.markForCheck();
  }
  public get dynamicLink() {
    return this.#_dynamicLink;
  }

  @Input()
  public set dynamicElse(value: 'hide' | 'unlink') {
    this.#_dynamicElse = value;
    this.#changeDetectorRef.markForCheck();
  }
  public get dynamicElse() {
    return this.#_dynamicElse;
  }

  public queryParams: SkyHrefQueryParams | undefined;
  public testSlowLink = false;

  #_dynamicElse: 'hide' | 'unlink' = 'hide';
  #_dynamicLink: string | any[] | undefined = '1bb-nav://simple-app/';

  #changeDetectorRef: ChangeDetectorRef;

  constructor(changeDetectorRef: ChangeDetectorRef) {
    this.#changeDetectorRef = changeDetectorRef;
  }

  public setSlowLink(value: boolean) {
    this.testSlowLink = value;
    this.#changeDetectorRef.detectChanges();
  }
}
