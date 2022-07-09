import { MarkdownView, App } from "obsidian";
import { parse } from "path";

interface Image {
  path: string;
  name: string;
  source: string;
}
const REGEX_FILE = /\!\[(.*?)\]\((.*?)\)/g;
const REGEX_WIKI_FILE = /\!\[\[(.*?)\]\]/g;

export default class Helper {
  app: App;

  constructor(app: App) {
    this.app = app;
  }
  getFrontmatterValue(key: string, defaultValue: any = undefined) {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      return undefined;
    }
    const path = file.path;
    const cache = this.app.metadataCache.getCache(path);

    let value = defaultValue;
    if (cache?.frontmatter && cache.frontmatter.hasOwnProperty(key)) {
      value = cache.frontmatter[key];
    }
    return value;
  }

  getEditor() {
    const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (mdView) {
      return mdView.editor;
    } else {
      return null;
    }
  }
  getValue() {
    const editor = this.getEditor();
    return editor.getValue();
  }

  setValue(value: string) {
    const editor = this.getEditor();
    const { left, top } = editor.getScrollInfo();

    editor.setValue(value);
    editor.scrollTo(left, top);
  }

  // get all file urls, include local and internet
  getAllFiles(): Image[] {
    const editor = this.getEditor();
    let value = editor.getValue();
    const matches = value.matchAll(REGEX_FILE);
    const WikiMatches = value.matchAll(REGEX_WIKI_FILE);

    let fileArray: Image[] = [];

    for (const match of matches) {
      const name = match[1];
      const path = match[2];
      const source = match[0];

      fileArray.push({
        path: path,
        name: name,
        source: source,
      });
    }

    for (const match of WikiMatches) {
      console.log(match);

      const name = parse(match[1]).name;
      const path = match[1];
      const source = match[0];

      fileArray.push({
        path: path,
        name: name,
        source: source,
      });
    }
    return fileArray;
  }
}
