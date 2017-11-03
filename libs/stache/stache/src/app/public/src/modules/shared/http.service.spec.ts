import { StacheHttpService } from './http.service';

describe('Http Service', () => {
  it('should have a post method', () => {
    let httpService = new StacheHttpService();
    expect(typeof httpService.post).toBe('function');
  });
  it('should have a get method', () => {
    let httpService = new StacheHttpService();
    expect(typeof httpService.get).toBe('function');
  });
});
