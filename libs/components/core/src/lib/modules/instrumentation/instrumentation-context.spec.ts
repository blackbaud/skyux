import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SkyInstrumentationContext } from './instrumentation-context';
import { SkyInstrumentationUserEvent } from './user-event';
import { createSkyInstrumentationUserEventEmitter } from './user-event-emitter';
import {
  provideSkyInstrumentationUserEventListener,
  SkyInstrumentationUserEventListener,
} from './user-event-listener';

@Injectable()
class MyUserEventListener extends SkyInstrumentationUserEventListener {
  readonly #analytics = inject(TestAnalyticsService);

  public onUserEvent(evt: SkyInstrumentationUserEvent): void {
    this.#analytics.logClickEvent(evt);
  }
}

@Injectable({
  providedIn: 'root',
})
class TestAnalyticsService {
  public logClickEvent(data: unknown): void {
    /* */
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // imports: [SkyInstrumentationContext],
  // providers: [provideSkyInstrumentationContext({ productId: 'foo123' })],
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

fdescribe('instrumentation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestButtonHost],
      providers: [
        provideSkyInstrumentationUserEventListener(MyUserEventListener),
      ],
    });
  });

  it('should', () => {
    const fixture = TestBed.createComponent(TestButtonHost);
    const svc = TestBed.inject(TestAnalyticsService);

    const spy = spyOn(svc, 'logClickEvent');

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      eventName: 'foo.bar',
      eventProperties: undefined,
      context: { productId: 'foo123' },
    });
  });
});
