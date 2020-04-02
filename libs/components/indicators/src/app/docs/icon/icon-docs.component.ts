import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyIconDocsIconItem
} from './icon-item';

import {
  SkyIconDocsManifestService
} from './icon-manifest.service';

@Component({
  selector: 'app-icon-docs',
  templateUrl: './icon-docs.component.html',
  providers: [SkyIconDocsManifestService]
})
export class IconDocsComponent implements OnInit {

  public faIcons: SkyIconDocsIconItem[] = [
    {
      name: 'plus-circle',
      usage: ['Add']
    },
    {
      name: 'pencil',
      usage: ['Edit']
    },
    {
      name: 'save',
      usage: ['Save']
    },
    {
      name: 'folder-open-o',
      usage: ['Open']
    },
    {
      name: 'trash-o',
      usage: ['Delete']
    },
    {
      name: 'close',
      usage: ['Close', 'Cancel']
    },
    {
      name: 'times-circle',
      usage: ['Clear']
    },
    {
      name: 'chevron-down',
      usage: ['Expand']
    },
    {
      name: 'chevron-up',
      usage: ['Collapse']
    },
    {
      name: 'angle-double-down',
      usage: ['Expand all']
    },
    {
      name: 'angle-double-up',
      usage: ['Collapse all']
    },
    {
      name: 'question-circle',
      usage: ['Help']
    },
    {
      name: 'gear',
      usage: ['Settings', 'Setup']
    },
    {
      name: 'phone',
      usage: ['Phone']
    },
    {
      name: 'envelope-o',
      usage: ['Email']
    },
    {
      name: 'calendar',
      usage: ['Calendar', 'Date']
    },
    {
      name: 'ban',
      usage: ['Do not contact', 'Wll not attend']
    },
    {
      name: 'warning',
      usage: ['Inactive', 'Warning']
    },
    {
      name: 'comments',
      usage: ['Conversation', 'Meeting']
    },
    {
      name: 'search',
      usage: ['Search']
    },
    {
      name: 'filter',
      usage: ['Filter']
    },
    {
      name: 'paperclip',
      usage: ['Attach', 'Attachment']
    },
    {
      name: 'credit-card',
      usage: ['Credit card']
    },
    {
      name: 'caret-down',
      usage: ['Selection (dropdown)']
    },
    {
      name: 'star',
      usage: ['Primary', 'Rating']
    },
    {
      name: 'caret-right',
      usage: ['Next']
    },
    {
      name: 'caret-left',
      usage: ['Previous']
    },
    {
      name: 'table',
      usage: ['Grid view', 'Table']
    },
    {
      name: 'list',
      usage: ['Repeater view']
    },
    {
      name: 'th-large',
      usage: ['Card view']
    },
    {
      name: 'map-marker',
      usage: ['Map view']
    },
    {
      name: 'check',
      usage: ['Complete', 'Success']
    },
    {
      name: 'file-image-o',
      usage: ['Image', 'Image file']
    },
    {
      name: 'ellipsis-h',
      usage: ['Context menu', 'Overflow menu']
    },
    {
      name: 'arrows',
      usage: ['Draggable']
    },
    {
      name: 'thumbs-o-up',
      usage: ['Thumbs up']
    },
    {
      name: 'thumbs-o-down',
      usage: ['Thumbs down']
    },
    {
      name: 'caret-up',
      usage: ['Sort ascending']
    },
    {
      name: 'caret-down',
      usage: ['Sort descending']
    },
    {
      name: 'sticky-note-o',
      usage: ['Note']
    },
    {
      name: 'search-plus',
      usage: ['Zoom in']
    },
    {
      name: 'search-minus',
      usage: ['Zoom out']
    },
    {
      name: 'print',
      usage: ['Print']
    },
    {
      name: 'bell-o',
      usage: ['Notification']
    },
    {
      name: 'cloud',
      usage: ['Cloud', 'Knowledgebase']
    },
    {
      name: 'info-circle',
      usage: ['More information']
    },
    {
      name: 'cloud-upload',
      usage: ['Attach', 'Upload']
    },
    {
      name: 'file-video-o',
      usage: ['Video file']
    },
    {
      name: 'file-pdf-o',
      usage: ['PDF file']
    },
    {
      name: 'file-word-o',
      usage: ['Microsoft Word file']
    },
    {
      name: 'file-excel-o',
      usage: ['Microsoft Excel file']
    },
    {
      name: 'file-o',
      usage: ['Generic file']
    },
    {
      name: 'globe',
      usage: ['Website']
    },
    {
      name: 'facebook',
      usage: ['Facebook profile']
    },
    {
      name: 'twitter',
      usage: ['Twitter profile']
    },
    {
      name: 'linkedin',
      usage: ['LinkedIn profile']
    },
    {
      name: 'building-o',
      usage: ['Business', 'Organization']
    },
    {
      name: 'arrow-right',
      usage: ['Contact information is in season']
    }
  ];

  public skyuxIcons: SkyIconDocsIconItem[];

  constructor(private svc: SkyIconDocsManifestService) { }

  public ngOnInit(): void {
    this.svc.getSkyUxIconManifest()
      .subscribe((manifest) => {
        this.skyuxIcons = manifest.glyphs;
      });
  }

}
