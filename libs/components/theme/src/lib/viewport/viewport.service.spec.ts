import { ReplaySubject } from 'rxjs';

import { SkyAppViewportReservedPositionType } from './viewport-reserve-position-type';
import { SkyAppViewportReservedSpace } from './viewport-reserved-space';
import { SkyAppViewportService } from './viewport.service';

describe('Viewport service', () => {
  let svc!: SkyAppViewportService;

  function validateViewportSpace(
    position: SkyAppViewportReservedPositionType,
    size: number
  ): void {
    expect(
      document.documentElement.style.getPropertyValue(
        `--sky-viewport-${position}`
      )
    ).toBe(`${size}px`);
  }

  beforeEach(() => {
    svc = new SkyAppViewportService(document);
  });

  it('should return an observable when the content is visible', () => {
    expect(svc.visible instanceof ReplaySubject).toEqual(true);
  });

  it('should reserve and unreserve space', () => {
    svc.reserveSpace({
      id: 'left-test',
      position: 'left',
      size: 20,
    });

    svc.reserveSpace({
      id: 'top-test',
      position: 'top',
      size: 30,
    });

    svc.reserveSpace({
      id: 'right-test',
      position: 'right',
      size: 40,
    });

    svc.reserveSpace({
      id: 'bottom-test',
      position: 'bottom',
      size: 50,
    });

    validateViewportSpace('left', 20);
    validateViewportSpace('top', 30);
    validateViewportSpace('right', 40);
    validateViewportSpace('bottom', 50);

    svc.unreserveSpace('left-test');
    svc.unreserveSpace('top-test');
    svc.unreserveSpace('right-test');
    svc.unreserveSpace('bottom-test');

    validateViewportSpace('left', 0);
    validateViewportSpace('top', 0);
    validateViewportSpace('right', 0);
    validateViewportSpace('bottom', 0);
  });

  it('should fire an event when reserved space changes', () => {
    let reservedSpace!: SkyAppViewportReservedSpace;

    function validate(
      top: number,
      right: number,
      bottom: number,
      left: number
    ): void {
      expect(reservedSpace.top).toBe(top);
      expect(reservedSpace.right).toBe(right);
      expect(reservedSpace.bottom).toBe(bottom);
      expect(reservedSpace.left).toBe(left);
    }

    svc.reservedSpaceChange.subscribe((args) => {
      reservedSpace = args.current;
    });

    svc.reserveSpace({
      id: 'left-test',
      position: 'left',
      size: 20,
    });

    validate(0, 0, 0, 20);

    svc.reserveSpace({
      id: 'left-test-2',
      position: 'left',
      size: 40,
    });

    validate(0, 0, 0, 60);

    svc.unreserveSpace('left-test');
    svc.unreserveSpace('left-test-2');

    validate(0, 0, 0, 0);
  });
});
