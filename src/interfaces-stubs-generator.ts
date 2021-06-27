import * as cp from 'child_process';
import { dirname } from 'path';
import * as vscode from 'vscode';
import { Receiver } from './receiver';

export class InterfaceStubsGenerator {
  pattern: RegExp;

  constructor(private editor: vscode.TextEditor | undefined) {
    this.pattern = /^\/\/\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+(\*?(?:[a-zA-Z_][a-zA-Z0-9]*\.)?[a-zA-Z_][a-zA-Z0-9_]*)$/;
  }

  findMatches(line: string): RegExpMatchArray | null {
    return line.match(this.pattern);
  }

  receiver(): Receiver | undefined {
    let line = this.editor?.document.lineAt(this.editor.selection.active.line);
    let matches = this.findMatches(line?.text.trim() as string);
    if (!matches) {
      return undefined;
    }
    return { name: matches[1], type_: matches[2], range: line?.range };
  }

  parse(): Receiver | undefined {
    const receiver = this.receiver();
    if (!receiver) {
      vscode.window.showWarningMessage(`Receiver is not in the correct format.
      Please, comment the line and use the following format for receiver:
      "f *File", "m MyType", "c CustomType"`);
      return;
    }
    return receiver;
  }

  implement(interface_: string, receiver: Receiver, callback?: (stubs: string) => void): void {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Generating stub methods..."
    }, (progress, token) => {
      return new Promise((resolve) => {
        const impl = cp.exec(`impl "${receiver?.name} ${receiver?.type_}" ${interface_}`,
          { cwd: dirname((this.editor as vscode.TextEditor).document.fileName) },
          (error, stdout, stderr) => {
            if (error) {
              vscode.window.showInformationMessage(stderr);
              return resolve(true);
            }
            const position = this.editor?.selection.active;
            const previousPosition = position?.with(position.line, 0);

            this.editor?.edit(editBuilder => {
              editBuilder.replace(receiver?.range as vscode.Range, stdout);
              const newPosition = this.editor?.selection.active;
              const newSelection = new vscode.Selection(previousPosition as vscode.Position, newPosition as vscode.Position);
              (this.editor as vscode.TextEditor).selection = newSelection;
              if (callback) {
                callback(stdout);
              }
            });
            resolve(true);
          });
      });
    });
  }

}
