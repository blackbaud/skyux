import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyStandaloneDataManagerComponent } from './data-manager.component';

describe('DataManagerComponent', () => {
  let component: SkyStandaloneDataManagerComponent;
  let fixture: ComponentFixture<SkyStandaloneDataManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyStandaloneDataManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyStandaloneDataManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
