import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TileDashboardComponent } from './tile-dashboard.component';
import { TileDashboardModule } from './tile-dashboard.module';

describe('TileDashboardComponent', () => {
  let component: TileDashboardComponent;
  let fixture: ComponentFixture<TileDashboardComponent>;

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TileDashboardModule],
    });
    fixture = TestBed.createComponent(TileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
    component.ngAfterViewInit();
    tick();
    expect(component.ready$.getValue()).toBeTruthy();
  }));
});
