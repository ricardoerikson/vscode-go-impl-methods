import { Range } from 'vscode';

export interface Receiver {
  name: string
  type_: string
  range: Range | undefined
}