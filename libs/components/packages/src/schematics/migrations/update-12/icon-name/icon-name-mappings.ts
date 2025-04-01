/**
 * Information about a legacy icon replacement
 */
export interface IconReplacement {
  newName: string;
  variant?: 'solid' | 'line';
}

/**
 * A map of legacy icons to their replacements.
 */
export const IconNameMappings: Record<string, IconReplacement> = {
  add: { newName: 'add' },
  'address-book': { newName: 'book-contacts', variant: 'solid' },
  'address-card': { newName: 'contact-card', variant: 'solid' },
  'align-center': { newName: 'text-align-center' },
  'align-left': { newName: 'text-align-left' },
  'align-right': { newName: 'text-align-right' },
  'angle-double-down': { newName: 'chevron-double-down' },
  'angle-double-up': { newName: 'chevron-double-up' },
  'angle-down': { newName: 'chevron-down' },
  'angle-left': { newName: 'chevron-left' },
  'angle-right': { newName: 'chevron-right' },
  'angle-up': { newName: 'chevron-up' },
  apple: { newName: 'apple' },
  'arrow-circle-left': { newName: 'arrow-circle-left' },
  'arrow-circle-right': { newName: 'arrow-circle-right' },
  'arrow-down': { newName: 'arrow-down' },
  'arrow-left': { newName: 'arrow-left' },
  'arrow-right': { newName: 'arrow-right' },
  arrows: { newName: 'arrow-move' },
  'arrows-v': { newName: 'arrow-bidirectional-up-down' },
  'arrow-up-right-dots': { newName: 'arrow-trending-lines' },
  at: { newName: 'mention' },
  ban: { newName: 'prohibited' },
  'bar-chart': { newName: 'data-bar-vertical-ascending' },
  bars: { newName: 'navigation' },
  'bars-2': { newName: 'navigation' },
  'bars-progress': { newName: 'data-bar-horizontal-descending' },
  'bb-diamond-2': { newName: 'bb-diamond' },
  'bb-diamond-2-solid': { newName: 'bb-diamond', variant: 'solid' },
  bell: { newName: 'alert', variant: 'solid' },
  binoculars: { newName: 'eye' },
  'birthday-cake': { newName: 'food-cake', variant: 'solid' },
  bold: { newName: 'text-bold' },
  bolt: { newName: 'flash', variant: 'solid' },
  book: { newName: 'book', variant: 'solid' },
  bookmark: { newName: 'bookmark', variant: 'solid' },
  building: { newName: 'building', variant: 'solid' },
  'building-o': { newName: 'building' },
  bullhorn: { newName: 'megaphone' },
  bullseye: { newName: 'target' },
  calculator: { newName: 'calculator' },
  calendar: { newName: 'calendar-ltr' },
  'caret-down': { newName: 'chevron-down', variant: 'solid' },
  'caret-left': { newName: 'chevron-left' },
  'caret-right': { newName: 'chevron-right', variant: 'solid' },
  'caret-up': { newName: 'chevron-up' },
  'cash-payment-bill-2': { newName: 'cash-payment-bill' },
  'cash-register': { newName: 'money-hand' },
  certificate: { newName: 'ribbon', variant: 'solid' },
  'chalkboard-teacher': { newName: 'share-screen-person' },
  'chart-bar': { newName: 'data-bar-horizontal' },
  'chart-column': { newName: 'data-bar-vertical-ascending' },
  'chart-gantt': { newName: 'gantt-chart' },
  'chart-line': { newName: 'data-trending' },
  'chart-pie': { newName: 'data-pie' },
  'chart-simple': { newName: 'data-histogram' },
  check: { newName: 'checkmark' },
  'check-circle': { newName: 'success' },
  'check-square': { newName: 'checkmark-square', variant: 'solid' },
  'check-square-o': { newName: 'checkmark-square' },
  chess: { newName: 'chess', variant: 'solid' },
  'chevron-down': { newName: 'chevron-down' },
  'chevron-left': { newName: 'chevron-left', variant: 'solid' },
  'chevron-right': { newName: 'chevron-right', variant: 'solid' },
  'chevron-up': { newName: 'chevron-up', variant: 'solid' },
  circle: { newName: 'circle', variant: 'solid' },
  'circle-o-notch': { newName: 'spinner-ios' },
  clipboard: { newName: 'clipboard-multiple' },
  'clipboard-check': { newName: 'clipboard-checkmark', variant: 'solid' },
  'clipboard-list': { newName: 'clipboard-bullet-list' },
  'clock-o': { newName: 'clock' },
  clone: { newName: 'copy' },
  close: { newName: 'close' },
  cloud: { newName: 'cloud', variant: 'solid' },
  'cloud-download': { newName: 'arrow-download' },
  'cloud-upload': { newName: 'arrow-upload' },
  code: { newName: 'code' },
  'code-branch': { newName: 'branch-fork' },
  'code-fork': { newName: 'branch-fork' },
  cog: { newName: 'settings', variant: 'solid' },
  'cog-2': { newName: 'settings' },
  cogs: { newName: 'settings-cog-multiple' },
  columns: { newName: 'layout-column-three' },
  comment: { newName: 'chat-empty', variant: 'solid' },
  'comment-o': { newName: 'chat-empty' },
  comments: { newName: 'chat-multiple', variant: 'solid' },
  'comments-o': { newName: 'chat-multiple' },
  compass: { newName: 'compass-northwest' },
  copy: { newName: 'copy' },
  'copy-to-clipboard': { newName: 'clipboard-multiple' },
  'credit-card': { newName: 'payment', variant: 'solid' },
  crop: { newName: 'crop' },
  cubes: { newName: 'cube-multiple' },
  cutlery: { newName: 'food', variant: 'solid' },
  dashboard: { newName: 'top-speed' },
  database: { newName: 'database-stack' },
  'database-2': { newName: 'database-stack' },
  desktop: { newName: 'desktop' },
  'diagram-predecessor': { newName: 'text-arrow-down-right-column' },
  'divider-line': { newName: 'insert' },
  'doc-file': { newName: 'document-doc' },
  dollar: { newName: 'dollar' },
  'double-chevron-down': { newName: 'chevron-double-down' },
  'double-chevron-left': { newName: 'chevron-double-left', variant: 'solid' },
  'double-chevron-right': { newName: 'chevron-double-right' },
  'double-chevron-up': { newName: 'chevron-double-up' },
  download: { newName: 'arrow-download' },
  edit: { newName: 'edit' },
  ellipsis: { newName: 'more-actions' },
  'ellipsis-h': { newName: 'more-actions' },
  'ellipsis-v': { newName: 'more-vertical' },
  envelope: { newName: 'mail' },
  'envelope-o': { newName: 'mail' },
  eraser: { newName: 'eraser', variant: 'solid' },
  'exclamation-circle': { newName: 'error-circle' },
  'exclamation-triangle': { newName: 'warning' },
  expand: { newName: 'arrow-maximize' },
  'external-link': { newName: 'open' },
  'external-link-alt': { newName: 'open' },
  eye: { newName: 'eye' },
  f: { newName: 'letter-f' },
  facebook: { newName: 'facebook' },
  'fas fa-plus-circle': { newName: 'add' },
  'fa-solid fa-map-pin': { newName: 'location', variant: 'solid' },
  'feather-alt': { newName: 'bookmark', variant: 'solid' },
  file: { newName: 'document' },
  'file-alt': { newName: 'document-text', variant: 'solid' },
  'file-code': { newName: 'document-chevron-double' },
  'file-code-o': { newName: 'document-chevron-double' },
  'file-contract': { newName: 'document-contract' },
  'file-excel-o': { newName: 'document-xls' },
  'file-image-o': { newName: 'document-image' },
  'file-invoice': { newName: 'document-table' },
  'file-o': { newName: 'document' },
  'file-pdf-o': { newName: 'document-pdf' },
  'files-o': { newName: 'document-multiple' },
  'file-text-o': { newName: 'document-text' },
  filter: { newName: 'filter' },
  flag: { newName: 'flag', variant: 'solid' },
  'folder-open-o': { newName: 'folder-open' },
  gavel: { newName: 'gavel', variant: 'solid' },
  gear: { newName: 'settings', variant: 'solid' },
  gift: { newName: 'gift', variant: 'solid' },
  git: { newName: 'git' },
  github: { newName: 'github' },
  'git-square': { newName: 'git' },
  globe: { newName: 'globe' },
  google: { newName: 'google' },
  'graduation-cap': { newName: 'hat-graduation', variant: 'solid' },
  group: { newName: 'people-team' },
  'hammer-wrench-2': { newName: 'wrench-screwdriver' },
  'hand-paper-o': { newName: 'hand-left' },
  handshake: { newName: 'handshake', variant: 'solid' },
  'handshake-o': { newName: 'handshake' },
  'hands-helping': { newName: 'handshake', variant: 'solid' },
  help: { newName: 'question-circle' },
  hide: { newName: 'eye-off' },
  history: { newName: 'history' },
  'hourglass-start': { newName: 'hourglass-half' },
  'id-card': { newName: 'contact-card', variant: 'solid' },
  image: { newName: 'image' },
  images: { newName: 'image-multiple', variant: 'solid' },
  inbox: { newName: 'mail-inbox', variant: 'solid' },
  info: { newName: 'info' },
  'info-circle': { newName: 'info', variant: 'solid' },
  'info-circle info-circle-icon': { newName: 'info' },
  institution: { newName: 'building-bank', variant: 'solid' },
  italic: { newName: 'text-italic' },
  key: { newName: 'key', variant: 'solid' },
  'keyboard-o': { newName: 'keyboard' },
  laptop: { newName: 'laptop' },
  'laptop-code': { newName: 'code' },
  'life-ring': { newName: 'person-support' },
  lightbulb: { newName: 'lightbulb', variant: 'solid' },
  'lightbulb-o': { newName: 'lightbulb' },
  'line-chart': { newName: 'data-trending' },
  link: { newName: 'link' },
  linkedin: { newName: 'linkedin' },
  list: { newName: 'text-bullet-list' },
  'list-check': { newName: 'task-list-ltr' },
  'list-ol': { newName: 'text-number-list-ltr' },
  'list-ul': { newName: 'text-bullet-list-ltr' },
  lock: { newName: 'lock-closed' },
  'lock-2': { newName: 'lock-closed' },
  'long-arrow-down': { newName: 'arrow-down' },
  'long-arrow-up': { newName: 'arrow-up' },
  m: { newName: 'letter-m' },
  magic: { newName: 'wand' },
  map: { newName: 'map', variant: 'solid' },
  'map-marker': { newName: 'location', variant: 'solid' },
  'map-o': { newName: 'map' },
  'map-signs': { newName: 'street-sign', variant: 'solid' },
  microphone: { newName: 'mic', variant: 'solid' },
  minus: { newName: 'subtract' },
  'minus-circle': { newName: 'subtract-circle' },
  mobile: { newName: 'phone' },
  money: { newName: 'money' },
  'newspaper-o': { newName: 'news' },
  'object-group': { newName: 'group' },
  'open-new-tab': { newName: 'open' },
  'open-new-tab-line': { newName: 'open' },
  paintbrush: { newName: 'paint-brush', variant: 'solid' },
  paperclip: { newName: 'attach' },
  'paper-plane': { newName: 'send', variant: 'solid' },
  'pdf-file': { newName: 'document-pdf' },
  pencil: { newName: 'edit' },
  'pencil-alt': { newName: 'edit' },
  'pencil-square-o': { newName: 'note-edit' },
  'pen-to-square': { newName: 'window-edit' },
  'people-group': { newName: 'people-team', variant: 'solid' },
  phone: { newName: 'call' },
  'phone-square': { newName: 'call' },
  'pie-chart': { newName: 'data-pie', variant: 'solid' },
  play: { newName: 'play', variant: 'solid' },
  'play-circle': { newName: 'play-circle', variant: 'solid' },
  plug: { newName: 'plug-disconnected' },
  plus: { newName: 'add' },
  'plus-circle': { newName: 'add' },
  'plus-square': { newName: 'add-square', variant: 'solid' },
  'power-off': { newName: 'power' },
  print: { newName: 'print' },
  printer: { newName: 'print' },
  'puzzle-piece': { newName: 'puzzle-piece', variant: 'solid' },
  question: { newName: 'question' },
  'question-circle': { newName: 'question-circle', variant: 'solid' },
  'question-circle-o': { newName: 'question-circle' },
  recycle: { newName: 'recycle' },
  redo: { newName: 'arrow-redo' },
  refresh: { newName: 'arrow-clockwise' },
  road: { newName: 'road' },
  robot: { newName: 'bot', variant: 'solid' },
  rocket: { newName: 'rocket', variant: 'solid' },
  s: { newName: 'letter-s' },
  save: { newName: 'save' },
  search: { newName: 'search' },
  send: { newName: 'send', variant: 'solid' },
  server: { newName: 'server' },
  settings: { newName: 'settings' },
  shapes: { newName: 'shapes', variant: 'solid' },
  share: { newName: 'share' },
  'share-alt': { newName: 'share-android' },
  'share-square-o': { newName: 'share' },
  shield: { newName: 'shield', variant: 'solid' },
  'shield-alt': { newName: 'shield' },
  'shield-virus': { newName: 'shield-keyhole' },
  show: { newName: 'eye' },
  'sign-in': { newName: 'arrow-enter' },
  'sign-in-alt': { newName: 'arrow-enter' },
  sitemap: { newName: 'cube-tree' },
  slack: { newName: 'slack' },
  sliders: { newName: 'options' },
  sort: { newName: 'arrow-sort' },
  'sparkles-2': { newName: 'sparkles' },
  spinner: { newName: 'spinner-ios' },
  'square-o': { newName: 'square' },
  star: { newName: 'star' },
  'sticky-note': { newName: 'note', variant: 'solid' },
  'sticky-note-o': { newName: 'note' },
  stop: { newName: 'stop', variant: 'solid' },
  sync: { newName: 'arrow-sync' },
  t: { newName: 'letter-t' },
  table: { newName: 'table' },
  tablet: { newName: 'tablet' },
  'tachometer-alt': { newName: 'top-speed' },
  tag: { newName: 'tag' },
  tags: { newName: 'tag-multiple' },
  tasks: { newName: 'task-list-ltr' },
  th: { newName: 're-order-dots-vertical' },
  'thermometer-half': { newName: 'temperature' },
  'th-large': { newName: 'grid' },
  'thumbs-o-down': { newName: 'thumb-dislike' },
  'thumbs-o-up': { newName: 'thumb-like' },
  'thumbs-up': { newName: 'thumb-like' },
  ticket: { newName: 'ticket-diagonal', variant: 'solid' },
  'tile-drag': { newName: 're-order-dots-vertical' },
  times: { newName: 'close', variant: 'solid' },
  'times-circle': { newName: 'dismiss-circle' },
  toolbox: { newName: 'toolbox' },
  tools: { newName: 'wrench-screwdriver' },
  train: { newName: 'vehicle-subway' },
  trash: { newName: 'delete' },
  'trash-o': { newName: 'delete' },
  truck: { newName: 'vehicle-truck-profile', variant: 'solid' },
  twitter: { newName: 'twitter' },
  underline: { newName: 'text-underline' },
  'universal-access': { newName: 'accessibility' },
  university: { newName: 'building-bank' },
  'unlock-alt': { newName: 'lock-open', variant: 'solid' },
  upload: { newName: 'arrow-upload' },
  usd: { newName: 'dollar' },
  user: { newName: 'person' },
  'user-check': { newName: 'person-available' },
  'user-circle': { newName: 'person-circle', variant: 'solid' },
  'user-lock': { newName: 'person-lock', variant: 'solid' },
  'user-o': { newName: 'person' },
  'user-plus': { newName: 'person-add', variant: 'solid' },
  users: { newName: 'people-team' },
  'user-tag': { newName: 'person-tag', variant: 'solid' },
  video: { newName: 'video', variant: 'solid' },
  'volume-off': { newName: 'speaker-mute', variant: 'solid' },
  w: { newName: 'letter-w' },
  wallet: { newName: 'wallet', variant: 'solid' },
  'wand-sparkles': { newName: 'wand' },
  warehouse: { newName: 'building-factory' },
  warning: { newName: 'warning' },
  'window-close': { newName: 'dismiss-square', variant: 'solid' },
  windows: { newName: 'windows' },
  wrench: { newName: 'wrench', variant: 'solid' },
  'xls-file': { newName: 'document-xls' },
  youtube: { newName: 'youtube' },
};
