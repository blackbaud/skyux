import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TabsComponent } from './tabs.component';
import { TabsModule } from './tabs.module';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TabsModule,
        RouterTestingModule.withRoutes([
          { path: '', component: TabsComponent },
        ]),
      ],
    });
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
