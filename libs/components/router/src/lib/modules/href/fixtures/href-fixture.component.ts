import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'sky-smart-link-fixture',
  templateUrl: 'href-fixture.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HrefDirectiveFixtureComponent {
  @Input()
  public set dynamicLink(value: string | any[]) {
    this._dynamicLink = value;
    this.changeDetectorRef.markForCheck();
  }
  public get dynamicLink() {
    return this._dynamicLink;
  }

  @Input()
  public set dynamicElse(value: 'hide' | 'unlink') {
    this._dynamicElse = value;
    this.changeDetectorRef.markForCheck();
  }
  public get dynamicElse() {
    return this._dynamicElse;
  }

  public testSlowLink = false;

  private _dynamicElse: 'hide' | 'unlink' = 'hide';
  private _dynamicLink: string | any[] = '1bb-nav://simple-app/';

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public setSlowLink(value: boolean) {
    this.testSlowLink = value;
    this.changeDetectorRef.detectChanges();
  }
}
