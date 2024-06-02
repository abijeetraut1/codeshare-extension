import * as vscode from 'vscode';
import axios from 'axios';
import * as http from "http";
import * as fs from "fs";
const min = 1000;
const max = 9999;

// testing offline mode
const {
	networkInterfaces
} = require("os");

import * as express from "express";

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
				try {

					const app = express();
					networkInterfaces().WiFi.forEach((el: any) => {
						if (el.family === "IPv4") {
							const min = 1000;
							const max = 9999;
							let randomPort = Math.floor(Math.random() * (max - min + 1)) + min;

							let ip = el.address;


							// encryption
							let newip = ip.split(".");
							const firstIpAddressLetter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
							const secondIpAddressLetter = ["N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

							const chooseTextFirst = Math.floor(Math.random() * firstIpAddressLetter.length);
							const chooseTextSecond = Math.floor(Math.random() * secondIpAddressLetter.length);

							// eslint-disable-next-line @typescript-eslint/naming-convention
							let Ifirst, Isecond, Ithird;
							// for 3 digit
							if (newip[3] > 100) {
								Ifirst = Math.floor((newip[3] * 1) / 100);
								Isecond = ((newip[3] * 1) % 10);
								Ithird = (((newip[3] * 1) % 100) - Isecond) / 10;
							}

							// eslint-disable-next-line @typescript-eslint/naming-convention
							let Pfirst, Psecond, Pthird, Pfourth;
							// for 4 digit
							if (randomPort) {
								Pfirst = Math.floor((randomPort * 1) / 1000);
								Psecond = Math.floor((randomPort * 1) / 100) % 10;
								Pfourth = Math.floor((randomPort * 1) % 10);
								Pthird = Math.floor(((randomPort * 1) % 100 - (Pfourth)) / 10);
							}

							// portA217B1
							let finalEncode = `${Pthird}${Pfirst}${Pfourth}${Psecond}${firstIpAddressLetter[chooseTextFirst]}${Isecond}${Ifirst}${Ithird}${secondIpAddressLetter[chooseTextSecond]}${newip[2]}`;

							app.use((req, res, next) => {
								res.header('Access-Control-Allow-Origin', '*'); // Change to your desired origin
								res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
								next();
							});

							app.use("/vscode/sendcode/data", (req, res) => {
								res.writeHead(200);
								res.end(selectedText);
							});

							app.listen(randomPort, () => {
								vscode.window.showInformationMessage(`${finalEncode}`);
							});
						}
					});
				} catch(err){
					vscode.window.showInformationMessage(`please install nodejs to use offline method`);
				};
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
		const onDiskPathGetAxios = vscode.Uri.joinPath(context.extensionUri, 'media', 'plugin/axios.js');


		const script = panel.webview.asWebviewUri(onDiskPathGetJs);
		const axios = panel.webview.asWebviewUri(onDiskPathGetAxios);

		panel.webview.html = getWebviewContent(script, axios);
	});

	context.subscriptions.push(onSendCodes);
	context.subscriptions.push(onReciveCodes);
}


function getWebviewContent(script: any, axios: any) {

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
					type="text" name="code-input" id="get-inserted-code" />

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


		<script type="module"> import dgram from https://cdn.jsdelivr.net/npm/dgram@1.0.1/+esm </script>
		<script nonce="${nonce}" src="${axios}"></script>
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


