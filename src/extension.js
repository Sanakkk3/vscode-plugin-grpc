"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');
const PROTO_PATH = __dirname + '/../protos/api.proto';
function activate(context) {
    console.log('PROTO_PATH: ', PROTO_PATH);
    const parkageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const grpcObject = grpc.loadPackageDefinition(parkageDefinition);
    const greeterService = grpcObject.pb_v1.SayHello;
    const greeterClient = new greeterService('localhost:50051', grpc.credentials.createInsecure());
    greeterClient.SayHello({ name: 'user' }, (error, response) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.log('Response:', response);
    });
    console.log('Congratulations, your extension "vscode-plugin-grpc" is now active!');
    const disposable = vscode.commands.registerCommand('vscode-plugin-grpc.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from vscode-plugin-grpc!');
    });
    context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map