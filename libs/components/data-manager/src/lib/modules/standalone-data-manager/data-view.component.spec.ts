import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyStandaloneDataViewComponent } from './data-view.component';

describe('DataViewComponent', () => {
  let component: SkyStandaloneDataViewComponent;
  let fixture: ComponentFixture<SkyStandaloneDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyStandaloneDataViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyStandaloneDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
