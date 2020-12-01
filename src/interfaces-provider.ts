import * as vscode from 'vscode';
import * as _ from 'lodash';

export async function provideInterfaces(keyword: string, callback: (inter: string[]) => void) {
  vscode.commands.executeCommand("vscode.executeWorkspaceSymbolProvider", keyword)
    .then((objects: any) => {
      const interfaces = _.chain(objects as vscode.SymbolInformation[])
        .filter({ 'kind': vscode.SymbolKind.Interface })
        .map((obj) => obj.name)
        .value();
      callback(interfaces);
    });
}