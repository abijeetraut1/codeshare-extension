import * as vscode from 'vscode';
import axios from 'axios';
import * as fs from "fs";
import path = require('path');

export function activate(context: vscode.ExtensionContext, webview: vscode.Webview, extensionUri: vscode.Uri) {
	let storeData;

	let onSendCodes = vscode.commands.registerCommand('with-express.sendcode', async () => {
		vscode.window.showInformationMessage('send code!');
	});

	let onReciveCodes = vscode.commands.registerCommand('with-express.recivecode', async () => {
		const panel = vscode.window.createWebviewPanel(
			'ReciveCode', // Identifies the type of the webview. Used internally
			'Recived Code', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{
				enableScripts: true
			}
		);

		const onDiskPathGetJs = vscode.Uri.joinPath(context.extensionUri, 'media', 'main.js');
		const script = panel.webview.asWebviewUri(onDiskPathGetJs);


		// const code = await axios.get("http://192.168.1.217:1137");
		let code = { data: "one" };
		panel.webview.html = getWebviewContent(code.data, script);
	});

	context.subscriptions.push(onSendCodes);
	context.subscriptions.push(onReciveCodes);
}

function getWebviewContent(code: any, script: any) {

	const nonce = getNonce();
	console.log(code);
	return `<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Document</title>
		<style>
			#get-code {
				width: 90%;
			}

			#getCode {
				width: 10%;
			}

			.input-container {
				display: flex;
				justify-content: center;
			}

			.code-display-section{
				border: 2px solid darkblue;
				padding: 1em;
			}
    </style>
	</head>
	
	<body>
		<div class="main" data-vscode-context='{"webviewSection": "main", "mouseCount": 4}'>
			<h1 id="insert">Insert Code </h1>
		
			<input data-vscode-context='{"webviewSection": "editor", "preventDefaultContextMenuItems": true}' type="text" name="code-input" id="get-inserted-code" />
        	<button id="checkCodeAndProvideCode" onClick="${getFetchData(9435)}">Get Code</button>
		</div>

		
		
		<h1 id="code-display-section"></h1>

		<script nonce="${nonce}" src="${script}"></script>
	</body>
	
	</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() { }

async function getFetchData(code: any){
	let data = await axios.get(`http://192.168.1.217:${code}`);
	console.log(data);
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}