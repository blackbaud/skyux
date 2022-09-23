import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TileDashboardModule } from '../tile-dashboard.module';

import { Tile2Component } from './tile2.component';

describe('Tile2Component', () => {
  let component: Tile2Component;
  let fixture: ComponentFixture<Tile2Component>;

  beforeEach(async () => {
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

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TileDashboardModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tile2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
