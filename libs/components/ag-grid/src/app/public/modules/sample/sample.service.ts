import {
  Injectable
} from '@angular/core';

@Injectable()
export class MyLibraryService {
  public sayGoodbye(): string {
    return 'Goodbye!';
  }
}
