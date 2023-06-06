import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionListComponent } from './description-list.component';
import { DescriptionListModule } from './description-list.module';

describe('DescriptionListComponent', () => {
  let component: DescriptionListComponent;
  let fixture: ComponentFixture<DescriptionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DescriptionListModule],
    });
    fixture = TestBed.createComponent(DescriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
