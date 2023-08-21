import * as vscode from 'vscode';
import axios from 'axios';
import path = require('path');
import * as http from "http";
const ip = '127.155.101.1';
const min = 1000;
const max = 9999;


export async function activate(context: vscode.ExtensionContext, webview: vscode.Webview, extensionUri: vscode.Uri) {
	
	let onSendCodes = vscode.commands.registerCommand('sendcode.sendit', async () => {
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

	let onReciveCodes = vscode.commands.registerCommand('sendcode.recive', async () => {
		const panel = vscode.window.createWebviewPanel(
			'ReciveCode',
			'Recived Code',
			vscode.ViewColumn.One,  // Editor column to show the new webview panel in.
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
		.form-container {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
        }

        .form-container *{
            margin: .5rem .2rem;
			background-color: #3C3C3C;
			border-color: transparent;
			border-radius: 3px;
			outline: #3794FF;
        }
		
        .form-container input{
            width: 80%;
            height: 2rem;
            font-size: 1.3rem;
			color: #A6A6A6;
        }

		#send-code-display-section{
			color: #A6A6A6;
		}

        .form-container select, button{
			font-size: .9rem;
			font-weight: 100;
			color: #3794FF;
			padding: 0 .6rem;
        }

        /* for arrow button */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
    </style>
	</head>
	
	<body>
		<div class="main" data-vscode-context='{"webviewSection": "main", "mouseCount": 4}'>
			<h1 id="insert" style="color: #3794FF;">Insert Code To Recive Codes: </h1>

			<div class="form-container">
				<input data-vscode-context='{"webviewSection": "editor", "preventDefaultContextMenuItems": true}'
					type="number" name="code-input" id="get-inserted-code" />

				<select id="select-extraction-method">
					<option selected value="offline"> Offline </option>
					<option value="online"> Online </option>
				</select>
				<button id="checkCodeAndProvideCode" style="background-color: #0E639C; color: #fff;">Get Code</button>
			</div>
		</div>

		<h1 id="code-display-section"></h1>
		<h2 id="code-displaying-method"></h2>
		<h3 id="send-code-display-section"></h3>
		
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