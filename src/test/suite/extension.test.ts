import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { expect } from 'chai';
import { InterfaceStubsGenerator } from '../../interfaces-stubs-generator';

suite('test receiver', () => {
  vscode.window.showInformationMessage('Start all tests.');
  const generator = new InterfaceStubsGenerator(vscode.window.activeTextEditor);

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
      expect(matches, `Null for entry: "${entry}"`).not.to.be.null;
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
