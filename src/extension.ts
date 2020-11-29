// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as _ from 'lodash';
import { provideInterfaces } from './interfaces-provider'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
    const quickPick = vscode.window.createQuickPick();

    const debounced = _.debounce((value) => {
      console.log('debouncing')
      provideInterfaces(value, (interfaces) => {
        console.log("value changed:", value);
        const items = _.map(interfaces, (label) => ({ label }));
        console.log(items);
        quickPick.items = items;
        // quickPick.show();
      });
    }, 500, { trailing: true });
    quickPick.onDidChangeValue(value => {

      debounced(value);

    })
    quickPick.onDidChangeSelection(selection => {
      console.log("Accept event")
      if (selection[0])
        console.log(selection[0].label)
      quickPick.hide();
    });
    quickPick.onDidHide(() => {
      quickPick.dispose();
    });
    quickPick.show();
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
