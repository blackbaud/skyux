import { MutationObserverService } from './mutation-observer-service';

describe('Mutation observer service', () => {
  it('should return a new instance of a mutation observer', () => {
    const service = new MutationObserverService();
    const observer = service.create(() => 0);

    expect(observer).not.toBeUndefined();
    expect(observer).toEqual(jasmine.any(MutationObserver));
  });
});
