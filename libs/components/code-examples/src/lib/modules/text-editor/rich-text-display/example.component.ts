import { Component } from '@angular/core';
import { SkyRichTextDisplayModule } from '@skyux/text-editor';

/**
 * @title Rich text display with basic setup
 */
@Component({
  selector: 'app-text-editor-rich-text-display-example',
  templateUrl: './example.component.html',
  imports: [SkyRichTextDisplayModule],
})
export class TextEditorRichTextDisplayExampleComponent {
  protected richText = `<font style="font-size: 18px" face="Arial" color="#a25353"><b>Exclusively committed to your impact</b></font><p>Since day one, Blackbaud has been 100% focused on driving impact for social good organizations.</p><p>We equip change agents with <b>cloud software</b>, <i>services</i>, <u>expertise</u>, and <font color="#a25353">data intelligence</font> designed with unmatched insight and supported with unparalleled commitment. Every day, our <b>customers</b> achieve unmatched impact as they advance their missions.</p><ul><li><a href="#">Build a better world</a></li><li><a href="#">Explore our solutions</a></li></ul>`;
}
