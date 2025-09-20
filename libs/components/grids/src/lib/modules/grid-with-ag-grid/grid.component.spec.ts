import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SkyGridColumnComponent } from './grid-column.component';
import { SkyGridComponent } from './grid.component';

@Component({
  template: `
    <sky-grid page="2" width="123">
      <sky-grid-column field="test" width="123" />
    </sky-grid>
  `,
  imports: [SkyGridComponent, SkyGridColumnComponent],
})
class TestComponent {
  @ViewChild(SkyGridComponent)
  public grid: SkyGridComponent<Record<string, unknown>>;
}

describe('SkyGridComponent', () => {
  let component: SkyGridComponent<Record<string, unknown>>;
  let fixture: ComponentFixture<SkyGridComponent<Record<string, unknown>>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyGridComponent,
        RouterTestingModule.withRoutes([]),
        TestComponent,
      ],
    });
    fixture = TestBed.createComponent(SkyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should coerce inputs', async () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.grid.page).toEqual(2);
  });
});
