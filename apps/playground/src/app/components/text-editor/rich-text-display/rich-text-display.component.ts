import { Component } from '@angular/core';

@Component({
  selector: 'app-rich-text-display',
  templateUrl: './rich-text-display.component.html',
  standalone: false,
})
export class RichTextDisplayComponent {
  public richText = `<font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u><a href="javascript:alert(1)">Super</a> styled text</u></i></b></font><div><font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u>Even more text</u></i></b></font></div><div><font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u>Another line<br></u></i></b></font>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line</div>`;
}
