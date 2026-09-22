import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  injectSkyInstrumentationEmitter,
  SkyInstrumentationContext,
  SkyInstrumentationUserEvent,
} from '@skyux/core';
import { provideSkyInstrumentationUserEventTesting } from './provide-user-event-testing';
import { SkyInstrumentationUserEventTestingController } from './user-event-controller';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'test-button',
  template: ` <button type="button" (click)="doSomething()">Click me</button> `,
})
class TestButton {
  readonly #instr = injectSkyInstrumentationEmitter();

  protected doSomething(): void {
    this.#instr.emitUserEvent('foo.bar');
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyInstrumentationContext, TestButton],
  template: `
    <div [skyInstrumentationContext]="{ productId: 'foo123' }">
      <test-button />
    </div>
  `,
})
class TestButtonHost {}

describe('instrumentation controller', () => {
  const expectedEvt: SkyInstrumentationUserEvent = {
    context: { productId: 'foo123' },
    eventName: 'foo.bar',
    eventType: 'user',
  };

  function clickButton(): SkyInstrumentationUserEventTestingController {
    const fixture = TestBed.createComponent(TestButtonHost);
    const controller = TestBed.inject(
      SkyInstrumentationUserEventTestingController,
    );

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    return controller;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestButtonHost],
      providers: [provideSkyInstrumentationUserEventTesting()],
    });
  });

  it('should verify a user event and its count', () => {
    const controller = clickButton();

    controller.expectUserEvent(expectedEvt);
    controller.expectUserEventCount(expectedEvt, 1);
  });

  it('should ignore the order of the expected properties', () => {
    const controller = clickButton();

    controller.expectUserEvent({
      context: { productId: 'foo123' },
      eventName: 'foo.bar',
    });
  });

  it('should fail when a user event was not logged', () => {
    const controller = clickButton();

    expect(() =>
      controller.expectUserEvent({ eventName: 'other.event' }),
    ).toThrowError(
      'Expected a user event to be logged with {"eventName":"other.event"}.',
    );
  });

  it('should fail when a user event was logged a different number of times', () => {
    const controller = clickButton();

    expect(() => controller.expectUserEventCount(expectedEvt, 2)).toThrowError(
      'Expected a user event {"context":{"productId":"foo123"},"eventName":"foo.bar"} to be logged 2 time(s), but it was logged 1 time(s).',
    );
  });
});
