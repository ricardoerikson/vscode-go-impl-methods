# Implement Method Stubs for Golang Interfaces - Visual Studio Code Extension

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/ricardoerikson/vscode-go-impl-methods/build-and-release/main)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/ricardoerikson/vscode-go-impl-methods?sort=semver)](https://github.com/ricardoerikson/vscode-go-impl-methods/releases)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![GitHub](https://img.shields.io/github/license/ricardoerikson/vscode-go-impl-methods)
[![Version](https://vsmarketplacebadge.apphb.com/version-short/ricardoerikson.vscode-go-impl-methods.svg
)](https://marketplace.visualstudio.com/items?itemName=ricardoerikson.vscode-go-impl-methods)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/ricardoerikson.vscode-go-impl-methods.svg
)](https://marketplace.visualstudio.com/items?itemName=ricardoerikson.vscode-go-impl-methods)

VS Code extension that automatically generates method stubs for Golang interfaces. Just inform the receiver and the interface. The extension will generate the method stubs.

![Usage](https://raw.githubusercontent.com/ricardoerikson/vscode-go-impl-methods/main/img/usage.gif)

## Requirements

First, you will need to have your Go environment correctly configured. The path folder for your Go binaries must also be added to the environment variable `$PATH` in your operating system. Please, find below some guidelines on how to do that in your operating system: 
  * [Windows](https://github.com/golang/go/wiki/SettingGOPATH), 
  * [Linux](https://golang.org/doc/gopath_code.html), 
  * and [macOS](https://golangbyexample.com/understand-etc-paths-pathsd-mac/)

Then, you will need to install the `impl` package as follows:

```
go get -u github.com/josharian/impl
```

**Obs**: make sure your `$GOPATH/bin` is in your `$PATH` so that you can access the `impl` binary.

## Usage
 * Inform the receiver as a comment (see some examples below):
   * `// mt MyType`
   * `// mp *MyPointer`
 * Open the **Command Palette**
   * `Ctrl+Shift+P` (Linux and Windows)
   * `Shift+Command+P` (macOS)
 * Look for *Go: Implement Interface Methods*
 * Start typing the name of the interface and pick it from the list (ex: `io.Reader`)
 * Hit Enter!

## Author

[Ricardo Erikson](https://github.com/ricardoerikson)

## Comments

The extension is working, but there are a few things to improve. Any suggestions are welcomed. Please, feel free to contribute.

**Enjoy!**
