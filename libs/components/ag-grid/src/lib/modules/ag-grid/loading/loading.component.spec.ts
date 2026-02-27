import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { ILoadingOverlayParams } from 'ag-grid-community';

import {
  Loading,
  SkyAgGridFixtureComponent,
} from '../fixtures/ag-grid.component.fixture';

import { SkyAgGridLoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  it('should create', async () => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridLoadingComponent],
    });
    const fixture = TestBed.createComponent(SkyAgGridLoadingComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    expect(() =>
      fixture.componentInstance.agInit({} as ILoadingOverlayParams),
    ).not.toThrow();
    expect(() =>
      fixture.componentInstance.refresh({} as ILoadingOverlayParams),
    ).not.toThrow();
  });

  it('should show in loading grid', async () => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: Loading,
          useValue: true,
        },
      ],
    });
    const fixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.agGridWrapper).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('sky-ag-grid-loading')),
    ).toBeTruthy();
  });
});
