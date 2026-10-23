import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyDataManagerSortOptionComponent } from './data-manager-sort-option.component';

@Component({
  selector: 'sky-test-host',
  template: `
    <sky-data-manager-sort-option
      id="az"
      propertyName="name"
      labelText="Name (A - Z)"
    />
  `,
  imports: [SkyDataManagerSortOptionComponent],
})
class TestHostComponent {}

describe('SkyDataManagerSortOptionComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  function getSortOption(): SkyDataManagerSortOptionComponent {
    return fixture.debugElement.children[0].injector.get(
      SkyDataManagerSortOptionComponent,
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
  });

  it('exposes its inputs and defaults descending to false', async () => {
    await fixture.whenStable();
    const sortOption = getSortOption();

    expect(sortOption.id()).toBe('az');
    expect(sortOption.propertyName()).toBe('name');
    expect(sortOption.labelText()).toBe('Name (A - Z)');
    expect(sortOption.descending()).toBeFalse();
  });

  it('converts itself to a SkyDataManagerSortOption', async () => {
    await fixture.whenStable();

    expect(getSortOption().toSortOption()).toEqual({
      id: 'az',
      propertyName: 'name',
      label: 'Name (A - Z)',
      descending: false,
    });
  });
});
