import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyLogService } from '@skyux/core';
import { SkyModalService } from '@skyux/modals';

import { SkyModalLinkListComponent } from './modal-link-list.component';
import { SkyModalLinkListModule } from './modal-link-list.module';

@Component({
  template: '',
  standalone: false,
})
class MockComponent {}

@Component({
  standalone: true,
  template: '',
})
class MockStandaloneComponent {}

describe('SkyModalLinkListComponent', () => {
  let component: SkyModalLinkListComponent;
  let fixture: ComponentFixture<SkyModalLinkListComponent>;
  let openModalSpy: jasmine.Spy;

  beforeEach(() => {
    openModalSpy = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [SkyModalLinkListModule, MockStandaloneComponent],
      providers: [
        {
          provide: SkyModalService,
          useValue: {
            open: openModalSpy,
          },
        },
      ],
    });
    fixture = TestBed.createComponent(SkyModalLinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.openModal({
      label: 'Link 1',
      modal: { component: MockStandaloneComponent, config: {} },
    });
    expect(openModalSpy).toHaveBeenCalledWith(MockStandaloneComponent, {});
  });

  it('should log when modal is not standalone', () => {
    const logger = TestBed.inject(SkyLogService);
    spyOn(logger, 'deprecated');
    expect(component).toBeTruthy();
    component.openModal({
      label: 'Link 1',
      modal: { component: MockComponent, config: {} },
    });
    expect(logger.deprecated).toHaveBeenCalled();
    expect(openModalSpy).toHaveBeenCalledWith(MockComponent, {});
  });

  it('should handle empty input', () => {
    expect(component).toBeTruthy();
    component.links = undefined;
    expect(component.links).toBeUndefined();
  });
});
