import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  _injectSkyInstrumentationEmitter,
  SkyInstrumentationContext,
  SkyInstrumentationEvent,
} from '@skyux/core';
import { provideSkyInstrumentationTesting } from './provide-testing';
import { SkyInstrumentationTestingController } from './testing-controller';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'test-button',
  template: ` <button type="button" (click)="doSomething()">Click me</button> `,
})
class TestButton {
  readonly #instr = _injectSkyInstrumentationEmitter();

  protected doSomething(): void {
    this.#instr.emit('foo.bar');
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyInstrumentationContext, TestButton],
  template: `
    <div
      [skyInstrumentationContext]="{
        name: 'products',
        detail: { productId: 'foo123' },
      }"
    >
      <test-button />
    </div>
  `,
})
class TestButtonHost {}

describe('instrumentation controller', () => {
  const expectedEvt: SkyInstrumentationEvent = {
    context: { name: 'products', detail: { productId: 'foo123' } },
    eventName: 'foo.bar',
  };

  function clickButton(): SkyInstrumentationTestingController {
    const fixture = TestBed.createComponent(TestButtonHost);
    const controller = TestBed.inject(SkyInstrumentationTestingController);

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    return controller;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestButtonHost],
      providers: [provideSkyInstrumentationTesting()],
    });
  });

  it('should verify a user event and its count', () => {
    const controller = clickButton();

    controller.expectEvent(expectedEvt);
    controller.expectEventCount(expectedEvt, 1);
  });

  it('should ignore the order of the expected properties', () => {
    const controller = clickButton();

    controller.expectEvent({
      eventName: 'foo.bar',
      context: { detail: { productId: 'foo123' }, name: 'products' },
    });
  });

  it('should fail when a user event was not logged', () => {
    const controller = clickButton();

    expect(() =>
      controller.expectEvent({ eventName: 'other.event' }),
    ).toThrowError(
      'Expected an event to be logged with {"eventName":"other.event"}.',
    );
  });

  it('should fail when a user event was logged a different number of times', () => {
    const controller = clickButton();

    expect(() => controller.expectEventCount(expectedEvt, 2)).toThrowError(
      'Expected an event {"context":{"detail":{"productId":"foo123"},"name":"products"},"eventName":"foo.bar"} to be logged 2 time(s), but it was logged 1 time(s).',
    );
  });
});
