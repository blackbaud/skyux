import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  createSkyInstrumentationUserEventEmitter,
  SkyInstrumentationContext,
  SkyInstrumentationUserEvent,
} from '@skyux/core';
import { provideSkyInstrumentationUserEventTesting } from './provide-user-event-testing';
import { SkyInstrumentationUserEventTestController } from './user-event-controller';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'test-button',
  template: ` <button type="button" (click)="doSomething()">Click me</button> `,
})
class TestButton {
  readonly #userEvt = createSkyInstrumentationUserEventEmitter();

  protected doSomething(): void {
    this.#userEvt.emit('foo.bar');
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
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestButtonHost],
      providers: [provideSkyInstrumentationUserEventTesting()],
    });
  });

  it('should', () => {
    const fixture = TestBed.createComponent(TestButtonHost);
    const controller = TestBed.inject(
      SkyInstrumentationUserEventTestController,
    );

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    const expectedEvt: SkyInstrumentationUserEvent = {
      eventName: 'foo.bar',
      eventProperties: undefined,
      context: { productId: 'foo123' },
    };

    controller.expectUserEvent(expectedEvt);
    controller.expectUserEventCount(expectedEvt, 1);
  });
});
