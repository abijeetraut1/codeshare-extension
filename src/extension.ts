import * as vscode from 'vscode';
import axios from 'axios';
import path = require('path');
import * as http from "http";
import * as mongoose from "mongoose";
const ip = '127.155.101.1';
const min = 1000;
const max = 9999;

export async function activate(context: vscode.ExtensionContext, webview: vscode.Webview, extensionUri: vscode.Uri) {

	let onSendCodes = vscode.commands.registerCommand('with-express.sendcode', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);

			const port = Math.floor(Math.random() * (max - min + 1)) + min;

			const sendMethod = await vscode.window.showInformationMessage("Choose method: ", "Online", "Offline");

			// while sending file onine
			if (sendMethod === "Online") {
				const sendText = await axios({
					method: "POST",
					url: "https://extension-online-database-host.onrender.com/api/vscodeExtensions/v1/sendandstore/saveTheSendData",
					data: {
						code: port,
						text: selectedText
					}
				});

				if (sendText.data.status === "success") {
					vscode.window.showInformationMessage(`${port}`);
				} else {
					vscode.window.showInformationMessage("🤔 | please check your internet connect! ");
				}

			} else if (sendMethod === "Offline") {
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
			}

		} else {
			vscode.window.showInformationMessage("please select the text");
		}
	});

	let onReciveCodes = vscode.commands.registerCommand('with-express.recivecode', async () => {

		const panel = vscode.window.createWebviewPanel(
			'ReciveCode',
			'Recived Code',
			vscode.ViewColumn.One,  // Editor column to show the new webview panel in.
			{
				enableScripts: true
			}
		);

		const onDiskPathGetJs = vscode.Uri.joinPath(context.extensionUri, 'media', 'main.js');
		const onDiskpathGetCss = vscode.Uri.joinPath(context.extensionUri, "media", "vscode.css");

		const script = panel.webview.asWebviewUri(onDiskPathGetJs);
		const vscodeCss = panel.webview.asWebviewUri(onDiskpathGetCss);

		panel.webview.html = getWebviewContent(script, vscodeCss);
	});

	context.subscriptions.push(onSendCodes);
	context.subscriptions.push(onReciveCodes);
}

function getWebviewContent(script: any, vscodeCss: any) {

	const nonce = getNonce();
	return `<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Document</title>
		<link rel="stylesheet" ref=${vscodeCss}>
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
        	<select id="select-extraction-method"> 
				<option selected value="offline"> Offline </option>
				<option value="online"> Online </option>
			</select>
			<button id="checkCodeAndProvideCode">Get Code</button>
		</div>

		
		
		<h1 id="code-display-section"></h1>
		<h2 id="code-displaying-method"></h2>
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