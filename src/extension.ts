import * as vscode from 'vscode';
import { sayHello } from "./pbv1/pb_v1_client";
import { authenticate } from "./pbv1/pb_v1_client";

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vscode-plugin-grpc" is now active!');

	const disposable = vscode.commands.registerCommand('vscode-plugin-grpc.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from vscode-plugin-grpc!');
		authenticate("zsx","123");
		sayHello("zhousaixing");
		console.log('1111111111!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
