import { AsyncPipe, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { SkyGridColumnComponent } from './grid-column.component';

@Component({
  template: `
    <sky-grid-column width="123">
      <ng-container *ngIf="(selector | async) === 'one'">
        <ng-template>
          <div>Test one</div>
        </ng-template>
      </ng-container>
      <ng-container *ngIf="(selector | async) === 'two'">
        <ng-template>
          <div>Test two</div>
        </ng-template>
      </ng-container>
    </sky-grid-column>
  `,
  imports: [SkyGridColumnComponent, NgIf, AsyncPipe],
})
class TestComponent {
  public selector = new BehaviorSubject<'one' | 'two'>('one');

  @ViewChild(SkyGridColumnComponent)
  public column: SkyGridColumnComponent;
}

describe('SkyGridColumnComponent', () => {
  let fixture: ComponentFixture<SkyGridColumnComponent>;
  let component: SkyGridColumnComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyGridColumnComponent, TestComponent],
    });
    fixture = TestBed.createComponent(SkyGridColumnComponent);
    component = fixture.componentInstance;
  });

  it('should define a column', () => {
    component.id = 'test';
    component.field = 'test';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should define a column with a template', async () => {
    const fixture = TestBed.createComponent(TestComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    let changeCount = 0;
    const subscription = component.column.changes.subscribe(() => {
      changeCount++;
    });
    component.selector.next('two');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(changeCount).toEqual(1);
    subscription.unsubscribe();
  });

  it('should emit changes', async () => {
    const changes = firstValueFrom(component.changes);
    component.ngOnChanges({
      heading: {
        firstChange: false,
        isFirstChange: () => false,
        previousValue: 'test',
        currentValue: 'test2',
      },
      description: {
        firstChange: false,
        isFirstChange: () => false,
        previousValue: 'test',
        currentValue: 'test2',
      },
      inlineHelpPopover: {
        firstChange: false,
        isFirstChange: () => false,
        previousValue: 'test',
        currentValue: 'test2',
      },
    });
    expect(await changes).toBeUndefined();
  });
});
