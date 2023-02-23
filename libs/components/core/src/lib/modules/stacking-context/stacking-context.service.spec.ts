import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { SkyStackingContextService } from './stacking-context.service';

describe('SkyStackingContextService', () => {
  it('should create with static z-index', async () => {
    const service = new SkyStackingContextService({ zIndex: 1000 });
    await expectAsync(
      service.getZIndex().pipe(take(1)).toPromise()
    ).toBeResolvedTo(1000);
  });

  it('should create with observable z-index', async () => {
    const service = new SkyStackingContextService({
      zIndex: new BehaviorSubject(1000).asObservable(),
    });
    await expectAsync(
      service.getZIndex().pipe(take(1)).toPromise()
    ).toBeResolvedTo(1000);
  });
});
