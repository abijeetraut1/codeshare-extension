import * as vscode from 'vscode';
import axios from 'axios';
import path = require('path');
import * as http from "http";

const ip = '127.155.101.1';
const min = 1000;
const max = 9999;

export function activate(context: vscode.ExtensionContext, webview: vscode.Webview, extensionUri: vscode.Uri) {
	let onSendCodes = vscode.commands.registerCommand('with-express.sendcode', async () => {

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);

			vscode.window.showInformationMessage(`Selected Text: ${selectedText}`);
			const port = Math.floor(Math.random() * (max - min + 1)) + min;
			const server = http.createServer((req, res) => {
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
				res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

				res.writeHead(200);
				res.end(selectedText);
			});

			server.listen(port, ip, () => {
				vscode.window.showInformationMessage(`code : ${port}`);
				console.log(`Server is running at http://${ip}:${port}/`);
			});
		} else {
			vscode.window.showInformationMessage("please select the text");
		}

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

		panel.webview.html = getWebviewContent(script);
	});

	context.subscriptions.push(onSendCodes);
	context.subscriptions.push(onReciveCodes);
}

function getWebviewContent(script: any) {

	const nonce = getNonce();
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
        	<button id="checkCodeAndProvideCode">Get Code</button>
		</div>

		
		
		<h1 id="code-display-section"></h1>

		<h3 id="send-code-display-section">Dipslaying Code</h3>
		

		<script nonce="${nonce}" src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js" integrity="sha512-uMtXmF28A2Ab/JJO2t/vYhlaa/3ahUOgj1Zf27M5rOo8/+fcTUVH0/E0ll68njmjrLqOBjXM3V9NiPFL5ywWPQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
		<script nonce="${nonce}" src="${script}"></script>
	</body>
	
	</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() { }


function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}