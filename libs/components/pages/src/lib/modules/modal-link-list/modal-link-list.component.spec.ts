import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
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
    const clickSpy = jasmine.createSpy('click');
    fixture.componentRef.setInput('links', [
      {
        label: 'Link 1',
        modal: { component: MockStandaloneComponent, config: {} },
      },
      {
        label: 'Link 2',
        click: clickSpy,
      },
    ]);
    fixture.detectChanges();
    const modalLinks = Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('button.sky-link-list-item'),
    );
    expect(modalLinks).toHaveSize(2);
    SkyAppTestUtility.fireDomEvent(modalLinks[0], 'click');
    expect(openModalSpy).toHaveBeenCalledWith(MockStandaloneComponent, {});
    SkyAppTestUtility.fireDomEvent(modalLinks[1], 'click');
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should log when modal is not standalone', () => {
    const logger = TestBed.inject(SkyLogService);
    spyOn(logger, 'deprecated');
    expect(component).toBeTruthy();
    fixture.componentRef.setInput('links', [
      {
        label: 'Link 1',
        modal: { component: MockComponent, config: {} },
      },
    ]);
    fixture.detectChanges();
    const link = Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('button.sky-link-list-item'),
    );
    expect(link.length).toBe(1);
    SkyAppTestUtility.fireDomEvent(link[0], 'click');
    expect(logger.deprecated).toHaveBeenCalled();
    expect(openModalSpy).toHaveBeenCalledWith(MockComponent, {});
  });

  it('should handle empty input', () => {
    expect(component).toBeTruthy();
    fixture.componentRef.setInput('links', undefined);
    fixture.detectChanges();
    expect(component.links()).toBeUndefined();
    expect(fixture.nativeElement.querySelector('ul.sky-link-list')).toBeFalsy();
  });
});
