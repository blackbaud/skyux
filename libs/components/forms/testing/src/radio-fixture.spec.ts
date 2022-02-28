import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SkyRadioModule } from '@skyux/forms';

import { SkyRadioFixture } from './radio-fixture';

//#region Test component
@Component({
  selector: 'sky-radio-test',
  template: `
    <sky-radio-group
      data-sky-id="test-radio"
      name="favoriteSeason"
      [value]="favoriteSeason"
      [(ngModel)]="favoriteSeason"
    >
      <ul class="sky-list-unstyled">
        <li *ngFor="let season of seasons">
          <sky-radio [disabled]="season.disabled" [value]="season.id">
            <sky-radio-label>
              {{ season.name }}
            </sky-radio-label>
          </sky-radio>
        </li>
      </ul>
    </sky-radio-group>
  `,
})
class TestComponent {
  public seasons = [
    { name: 'Spring', id: '1', disabled: false },
    { name: 'Summer', id: '2', disabled: false },
    { name: 'Fall', id: '3', disabled: true },
    { name: 'Winter', id: '4', disabled: false },
  ];

  public favoriteSeason = this.seasons[0].id;
}
//#endregion Test component

describe('Radio fixture', () => {
  let fixture: ComponentFixture<TestComponent>;
  let radioGroup: SkyRadioFixture;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyRadioModule, FormsModule],
    });

    fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();
    tick();

    radioGroup = new SkyRadioFixture(fixture, 'test-radio');
    fixture.detectChanges();
  }));

  it('should expose the provided properties', () => {
    const springSeason = fixture.componentInstance.seasons[0];
    expect(radioGroup.disabled).toBeFalse();
    expect(radioGroup.value).toEqual(springSeason.id);
  });

  it('should select the radio button with the given value', () => {
    const springSeason = fixture.componentInstance.seasons[0];
    const summerSeason = fixture.componentInstance.seasons[1];

    expect(radioGroup.value).toEqual(springSeason.id);

    radioGroup.value = summerSeason.id;

    expect(radioGroup.value).toEqual(summerSeason.id);
  });

  it('should set the disabled state for all radio buttons', () => {
    expect(radioGroup.disabled).toBeFalse();

    radioGroup.disabled = true;

    expect(radioGroup.disabled).toBeTrue();
  });
});
