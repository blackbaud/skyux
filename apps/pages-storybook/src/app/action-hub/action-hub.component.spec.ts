import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionHubComponent } from './action-hub.component';
import { ActionHubModule } from './action-hub.module';

describe('ActionHubComponent', () => {
  let component: ActionHubComponent;
  let fixture: ComponentFixture<ActionHubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActionHubModule],
    });
    fixture = TestBed.createComponent(ActionHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
