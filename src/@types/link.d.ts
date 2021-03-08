declare module 'quill/formats/link' {
  import Parchment from 'parchment';
  class Link extends Parchment.Inline {}
  export function sanitize(url: string, protocols: string[]): string;
  export default Link;
}

declare module 'quill/formats/bold' {
  import Parchment from 'parchment';
  class Bold extends Parchment.Inline {}
  export default Bold;
}

declare module 'quill/formats/italic' {
  import Parchment from 'parchment';
  class Italic extends Parchment.Inline {}
  export default Italic;
}

declare module 'quill/formats/align' {
  import Parchment from 'parchment';
  export class AlignClass extends Parchment.Attributor.Class {}
}
