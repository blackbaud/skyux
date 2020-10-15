import {
  inject,
  TestBed
} from '@angular/core/testing';

import { SkyListSecondaryAction } from './list-secondary-action';

import { SkyListSecondaryActionsService } from './list-secondary-actions.service';

describe('List secondary actions service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SkyListSecondaryActionsService
      ]
    });
  });

  it('should add and remove actions', inject(
    [SkyListSecondaryActionsService],
    (service: SkyListSecondaryActionsService) => {
      expect(service.secondaryActionsCount).toEqual(0);
      const action: SkyListSecondaryAction = {
        template: undefined
      };
      service.addSecondaryAction(action);
      expect(service.secondaryActionsCount).toEqual(1);
      service.removeSecondaryAction(action);
      expect(service.secondaryActionsCount).toEqual(0);
    }
  ));
});
