import {
  Component
} from '@angular/core';

import {
  TestBed
} from '@angular/core/testing';

import {
  SkyWaitModule
} from '@skyux/indicators';

import {
  SkyWaitFixture
} from './wait-fixture';

@Component({
  selector: 'wait-test',
  template: `
    <sky-wait [isWaiting]="isWaiting"
              [isFullPage]="isFullPage"
              [isNonBlocking]="isNonBlocking"
              [ariaLabel]="label"
              data-sky-id="test-wait"
    ></sky-wait>
  `
})
class TestComponent {
  public isWaiting: boolean = true;
  public isFullPage: boolean = true;
  public isNonBlocking: boolean = false;
  public label: string = 'test label';
}

describe('Wait fixture', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ],
      imports: [
        SkyWaitModule
      ]
    });
  });

  it('should expose expected properties', () => {
    const fixture = TestBed.createComponent(
      TestComponent
    );

    fixture.detectChanges();
    const waitFixture: SkyWaitFixture = new SkyWaitFixture(
      fixture,
      'test-wait'
    );

    expect(waitFixture.isWaiting).toEqual(true);
    expect(waitFixture.isFullPage).toEqual(true);
    expect(waitFixture.isNonBlocking).toEqual(false);
    expect(waitFixture.ariaLabel).toEqual('test label');
  });
});
