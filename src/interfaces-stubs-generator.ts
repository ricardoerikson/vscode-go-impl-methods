import * as vscode from 'vscode';
import { Receiver } from './receiver';
import * as cp from 'child_process';


export class InterfaceStubsGenerator {
  pattern: RegExp;

  constructor(private editor: vscode.TextEditor | undefined) {
    this.pattern = new RegExp('^([a-zA-Z_][a-zA-Z0-9_]*) (\\*?[a-zA-Z_][a-zA-Z0-9]*)$');
  }

  receiver(): Receiver | undefined {

    let line = this.editor?.document.lineAt(this.editor.selection.active.line);
    let matches = line?.text.trim().match(this.pattern);
    if (!matches) {
      return undefined;
    }
    return { name: matches[1], type_: matches[2], range: line?.range };
  }

  parse(): Receiver | undefined {
    const receiver = this.receiver();
    if (!receiver) {
      vscode.window.showWarningMessage('Receiver is not in the correct format. Examples of receiver format: "f *File", "m MyType", "s string"');
      return;
    }
    return receiver;
  }

  implement(interface_: string): void {

  }

  generate(interface_: string): void {
    let receiver = this.receiver();
    if (receiver) {
      const impl = cp.exec(`impl '${receiver?.name} ${receiver?.type_}' ${interface_}`, (error, stdout, stderr) => {
        if (error) {
          vscode.window.showInformationMessage(stderr);
          return;
        }
        console.log(stdout);
      });
    }
  }




}