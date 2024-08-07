import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {


	console.log('Congratulations, your extension "vscode-plugin-grpc" is now active!');

	const disposable = vscode.commands.registerCommand('vscode-plugin-grpc.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from vscode-plugin-grpc!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
