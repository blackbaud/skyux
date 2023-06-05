import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontLoadingService } from '@skyux/storybook';

import { BehaviorSubject } from 'rxjs';

import { ErrorComponent } from './error.component';
import { ErrorModule } from './error.module';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ErrorModule],
      providers: [
        {
          provide: FontLoadingService,
          useValue: {
            ready: () => new BehaviorSubject(false),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
