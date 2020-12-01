// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as path from 'path';
import { expect } from 'chai';
import { InterfaceStubsGenerator } from '../../interfaces-stubs-generator';
import { sleep } from './util';
import { Receiver } from '../../receiver';

suite('test receiver', () => {
  vscode.window.showInformationMessage('Start all tests.');
  const generator = new InterfaceStubsGenerator(vscode.window.activeTextEditor);

  test('should reject invalid receiver formats', () => {
    const entries = [
      '// a * ConcreteImpl',
      '//a* ConcreteImpl',
      '//   *a    ConcreteImpl',
      '// a ConcreteImpl*',
      '// a* *ConcreteImpl',
      '// ConcreteImpl',
      '// a ',
      'a ConcreteImpl'
    ];
    for (const entry of entries) {
      const matches = generator.findMatches(entry);
      expect(matches, `matches for entry "${entry}" should be null`).to.be.null;
    }

  });

  test('should accept valid receiver formats', () => {
    const entries = [
      '// a ConcreteImpl',
      '//a   ConcreteImpl',
      '//    a    ConcreteImpl',
      '//    a ConcreteImpl',
      '// a *ConcreteImpl',
      '//a *ConcreteImpl',
      '//  a   *ConcreteImpl',
    ];
    for (const entry of entries) {
      const matches = generator.findMatches(entry);
      expect(matches, `matches for entry "${entry}" should not be null`).not.to.be.null;
    }
  });

  test('should validate a receiver with valid format', () => {
    const matches = generator.findMatches('// a CustomType');
    expect(matches).not.to.be.null;
    expect((matches as RegExpMatchArray)[1]).to.equal('a');
    expect((matches as RegExpMatchArray)[2]).to.equal('CustomType');
  });

  test('should validate a receiver with pointer and a valid format', () => {
    const matches = generator.findMatches('// a *CustomType');
    expect(matches).to.have.lengthOf(3);
    expect((matches as RegExpMatchArray)[1]).to.equal('a');
    expect((matches as RegExpMatchArray)[2]).to.be.a('string').and.to.have.string('*');
    expect((matches as RegExpMatchArray)[2].startsWith('*')).to.be.true;
  });

  test('should be null when reiver has wrong pattern', () => {
    const matches = generator.findMatches('a CustomType');
    expect(matches).to.be.null;
  });

  test('should validate a receiver with leading package name and correct format', () => {
    const matches = generator.findMatches('// b mypackage.CustomType');
    expect(matches).not.to.be.null;
    expect((matches as RegExpMatchArray)[1]).to.equal('b');
    expect((matches as RegExpMatchArray)[2]).to.equal('mypackage.CustomType');
    expect((matches as RegExpMatchArray)[2].startsWith('mypackage')).to.be.true;
  });

  test('should return null when receiver has a leading package name with invalid format', () => {
    const matches = generator.findMatches('// c my.package.Test');
    expect(matches).to.be.null;
  });

});

suite('end-to-end tests', () => {

  test('should implement interface method stubs', async () => {
    const testFolderLocation = '../../../../src/test/examples/';
    const uri = vscode.Uri.file(
      path.join(__dirname + testFolderLocation + 'main.go')
    );
    const document = await vscode.workspace.openTextDocument(uri);
    const position = new vscode.Position(5, 0);
    let editor = await vscode.window.showTextDocument(document);
    await sleep(50);
    editor.selection = new vscode.Selection(position, position);
    const generator = new InterfaceStubsGenerator(editor);
    const receiver = generator.parse();
    expect(receiver, 'should not be null').not.to.be.null;
    expect(receiver?.name).to.equal('mStruct');
    expect(receiver?.type_).to.equal('MyStruct');
    generator.implement('pkg.MyInterface', receiver as Receiver, async (output) => {
      await sleep(50);
      const referenceUri = vscode.Uri.file(
        path.join(__dirname + testFolderLocation + 'stubs.test')
      );
      const expectedOutput = vscode.workspace.openTextDocument(referenceUri);
      expect(output, (await expectedOutput).getText());

    });
    vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

});
