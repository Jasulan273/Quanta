import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';

import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

import List from '@ckeditor/ckeditor5-list/src/list';

import Link from '@ckeditor/ckeditor5-link/src/link';

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Font from '@ckeditor/ckeditor5-font/src/font';

import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';

import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';

import Undo from '@ckeditor/ckeditor5-undo/src/undo';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
  Essentials,
  Bold, Italic, Underline, Strikethrough, Code,
  Heading, Paragraph,
  List,
  Link,
  Alignment,
  Font,
  Image, ImageToolbar, ImageResize, ImageStyle, ImageCaption,
  Table, TableToolbar,
  BlockQuote, CodeBlock,
  Undo,
  SourceEditing
];

ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', 'code', '|',
      'alignment', '|',
      'bulletedList', 'numberedList', '|',
      'link', 'blockQuote', 'insertTable', '|',
      'imageUpload', 'resizeImage', '|',
      'fontColor', 'fontBackgroundColor', '|',
      'undo', 'redo', '|',
      'codeBlock', 'sourceEditing'
    ]
  },
  image: {
    resizeUnit: '%',
    resizeOptions: [
      { name: 'resizeImage:original', label: 'Original', value: null },
      { name: 'resizeImage:25', label: '25%', value: '25' },
      { name: 'resizeImage:50', label: '50%', value: '50' },
      { name: 'resizeImage:75', label: '75%', value: '75' }
    ],
    toolbar: [
      'resizeImage',
      'imageStyle:inline',
      'imageStyle:wrapText',
      'imageStyle:breakText',
      'imageTextAlternative'
    ]
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
  },
  language: 'en'
};