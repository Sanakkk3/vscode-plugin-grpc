// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-plugin-grpc" is now active!');

	// Load the protobuf
	// 获取 greeter.proto 文件的相对路径
	const protoPathRelative = path.join(__dirname, '..', 'proto', 'greeter.proto');
	// 将相对路径转换为 Uri 文件路径，并获得文件系统路径
    const protoPath = vscode.Uri.file(protoPathRelative).fsPath;
    const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

	const greeterProto = grpc.loadPackageDefinition(packageDefinition).Greeter;

    // Define gRPC client
    const client = new greeterProto('localhost:50051', grpc.credentials.createInsecure());

    // Function to call gRPC method
    function callGrpcMethod() {
        const request = {
            name: 'World'
        };

        client.sayHello(request, (error: any, response: any) => {
            if (!error) {
                vscode.window.showInformationMessage('Greeting: ' + response.message);
            } else {
                vscode.window.showErrorMessage('Error: ' + error.message);
            }
        });
    }

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vscode-plugin-grpc.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-plugin-grpc!');
		// 调用grpc服务
		callGrpcMethod();
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
