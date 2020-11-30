import * as vscode from 'vscode';
import { Receiver } from './receiver';


export class InterfaceStubsGenerator {
  pattern: RegExp;

  constructor(private editor: vscode.TextEditor | undefined) {
    this.pattern = new RegExp('^([a-zA-Z_][a-zA-Z0-9_]*) (\\*?[a-zA-Z_][a-zA-Z0-9]*)$');
  }

  receiver(): Receiver | undefined {
    let line = this.editor?.document.lineAt(this.editor.selection.active.line).text.trim();
    let matches = line?.match(this.pattern);
    if (!matches) {
      return undefined;
    }
    return { name: matches[1], type_: matches[2] };
  }
}