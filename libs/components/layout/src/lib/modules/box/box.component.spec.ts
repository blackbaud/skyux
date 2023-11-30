import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyContentInfoProvider } from '@skyux/core';

import { SkyBoxComponent } from './box.component';
import { BoxTestComponent } from './fixtures/box.component.fixture';
import { SkyBoxFixturesModule } from './fixtures/box.module.fixture';

function getBoxEl(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-box');
}

describe('BoxComponent', () => {
  let component: BoxTestComponent;
  let fixture: ComponentFixture<BoxTestComponent>;
  let mockContentInfoProvider: SkyContentInfoProvider;

  beforeEach(() => {
    mockContentInfoProvider = jasmine.createSpyObj('SkyContentInfoProvider', [
      'patchInfo',
      'getInfo',
    ]);

    TestBed.configureTestingModule({
      declarations: [BoxTestComponent],
      imports: [SkyBoxFixturesModule],
    });

    fixture = TestBed.overrideComponent(SkyBoxComponent, {
      add: {
        providers: [
          {
            provide: SkyContentInfoProvider,
            useValue: mockContentInfoProvider,
          },
        ],
      },
    }).createComponent(BoxTestComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should assign role attribute when ariaRole is set', () => {
    component.ariaRole = 'region';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('role')).toEqual('region');
  });

  it('should assign label attribute when ariaLabel is set', () => {
    component.ariaLabel = 'my box';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('aria-label')).toEqual('my box');
  });

  it('should assign role attribute when ariaRole is set', () => {
    component.ariaLabelledBy = 'my-header';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('aria-labelledby')).toEqual(
      'my-header'
    );
  });

  it('should set an id on the header and provide it via contentInfoProvider', () => {
    const header = getBoxEl(fixture).querySelector('sky-box-header span');

    fixture.detectChanges();
    expect(header).not.toBeNull();
    if (header) {
      expect(mockContentInfoProvider.patchInfo).toHaveBeenCalledWith({
        descriptor: { type: 'elementId', value: header.id },
      });
    }
  });
});
