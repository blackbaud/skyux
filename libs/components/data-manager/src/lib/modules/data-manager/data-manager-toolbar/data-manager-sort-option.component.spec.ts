import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyDataManagerSortOptionComponent } from './data-manager-sort-option.component';

@Component({
  selector: 'sky-test-host',
  template: `
    <sky-data-manager-sort-option
      id="az"
      propertyName="name"
      label="Name (A - Z)"
    />
  `,
  imports: [SkyDataManagerSortOptionComponent],
})
class TestHostComponent {}

describe('SkyDataManagerSortOptionComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let sortOption: SkyDataManagerSortOptionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    sortOption = fixture.debugElement.children[0].injector.get(
      SkyDataManagerSortOptionComponent,
    );
  });

  it('exposes its inputs and defaults descending to false', () => {
    expect(sortOption.id()).toBe('az');
    expect(sortOption.propertyName()).toBe('name');
    expect(sortOption.label()).toBe('Name (A - Z)');
    expect(sortOption.descending()).toBeFalse();
  });

  it('converts itself to a SkyDataManagerSortOption', () => {
    expect(sortOption.toSortOption()).toEqual({
      id: 'az',
      propertyName: 'name',
      label: 'Name (A - Z)',
      descending: false,
    });
  });
});
