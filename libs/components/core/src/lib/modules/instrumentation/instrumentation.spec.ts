import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  createSkyUserEventEmitter,
  provideSkyUserEventListener,
  SkyInstrumentationContext,
  SkyUserEvent,
  SkyUserEventListener,
} from './instrumentation';

@Injectable()
class MyUserEventListener extends SkyUserEventListener {
  readonly #analytics = inject(TestAnalyticsService);

  public onUserEvent(evt: SkyUserEvent): void {
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
  imports: [SkyInstrumentationContext],
  template: `
    <button
      type="button"
      [skyInstrumentationContext]="{ productId: 'foo123' }"
      (click)="doSomething()"
    >
      Click me
    </button>
  `,
})
class TestButton {
  readonly #emitter = createSkyUserEventEmitter();

  protected doSomething(): void {
    this.#emitter.emit('foo.bar');
  }
}

fdescribe('instrumentation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestButton],
      providers: [provideSkyUserEventListener(MyUserEventListener)],
    });
  });

  it('should', () => {
    const fixture = TestBed.createComponent(TestButton);
    const svc = TestBed.inject(TestAnalyticsService);

    const spy = spyOn(svc, 'logClickEvent');

    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    btn.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      eventName: 'foo.bar',
      context: { productId: 'foo123' },
    });
  });
});
