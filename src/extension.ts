import * as vscode from 'vscode';
import * as net from 'net';
import { SayHello } from "./helloworld_client";
import { Authenticate } from "./helloworld_client";
import { resolve } from 'path';

function checkNetworkConnectivity(ip: string, port: number): Promise<boolean> {
	return new Promise((resolve) => {
		const socket = new net.Socket();
		const timeout = 3000;

		socket.setTimeout(timeout);
		socket.once('connect', () => {
			socket.destroy();
			resolve(true);
		});
		socket.once('timeout', () => {
			socket.destroy();
			resolve(false);
		});
		socket.once('error', () => {
			socket.destroy();
			resolve(false);
		});

		socket.connect(port, ip);
	});
}

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vscode-plugin-grpc" is now active!');

	vscode.commands.registerCommand('vscode-plugin-grpc.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from vscode-plugin-grpc!');
		Authenticate("zsx","123");
		SayHello("zhousaixing");
		console.log('run to the end!');
	});


	vscode.commands.registerCommand('vscode-plugin-grpc.checkConnectivity', async () => {
        const ip = '192.168.0.11'; // Replace with the IP address you want to check
        const port = 50051; // Replace with the port you want to check
        
        try {
            const isConnected = await checkNetworkConnectivity(ip, port);
            vscode.window.showInformationMessage(`Network connectivity to ${ip}:${port} is ${isConnected ? 'successful' : 'unsuccessful'}.`);
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage('Error checking network connectivity: ' + error.message);
            } else {
                vscode.window.showErrorMessage('Error checking network connectivity: An unknown error occurred.');
            }
        }
    });
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('vscode plugin close succuss!');
}
