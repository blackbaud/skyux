import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DataManagerComponent } from './data-manager.component';
import { DataManagerModule } from './data-manager.module';

describe('DataManagerComponent', () => {
  let component: DataManagerComponent;
  let fixture: ComponentFixture<DataManagerComponent>;

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
      imports: [DataManagerModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(DataManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
