document.getElementById('checkCodeAndProvideCode').addEventListener('click', async (e) => {
    e.preventDefault();
    const getCode = document.getElementById("code-display-section");
    const selectCodeExtractionMethod = document.getElementById("select-extraction-method").value;

    const getInsertedCode = document.getElementById("get-inserted-code").value;
    getCode.innerHTML = getInsertedCode === '' || getInsertedCode === ' ' ? "Please Insert Valid Code" : `Inserted Code: <span style="color: #3794FF; "> ${getInsertedCode} </span>`;
    document.getElementById("code-displaying-method").innerHTML = `Code Recive Method : <span style="color: #3794FF;"> ${selectCodeExtractionMethod.toUpperCase()} </span>`;

    try {
        if (selectCodeExtractionMethod === "offline") {
            const firstIpAddressLetter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
            const secondIpAddressLetter = ["N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

            const enteredHashedCode = getInsertedCode;

            for (let i = 0; i < firstIpAddressLetter.length; i++) {
                let splitPort = enteredHashedCode.split(firstIpAddressLetter[i]);
                console.log(splitPort);

                if (splitPort.length === 2) {
                    if (splitPort[1]) {
                        for (let j = 0; j < secondIpAddressLetter.length; j++) {
                            let secondSplit = splitPort[1].split(secondIpAddressLetter[j]);
                            if (secondSplit.length === 2) {

                                // seprate and arrange the code

                                // port 
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                let Pfirst, Psecond, Pthird, Pfourth;
                                if (splitPort[0]) {
                                    Pfirst = Math.floor((splitPort[0] * 1) / 1000);
                                    Psecond = Math.floor((splitPort[0] * 1) / 100) % 10;
                                    Pfourth = Math.floor((splitPort[0] * 1) % 10);
                                    Pthird = Math.floor(((splitPort[0] * 1) % 100 - (Pfourth)) / 10);
                                }

                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                // 217
                                if (secondSplit[0] > 100) {
                                    Ifirst = Math.floor((secondSplit[0] * 1) / 100);
                                    Isecond = ((secondSplit[0] * 1) % 10);
                                    Ithird = (((secondSplit[0] * 1) % 100) - Isecond) / 10;
                                }

                                // arrange
                                const arrangedIp = `192.168.${secondSplit[1]}.${Ithird}${Isecond}${Ifirst}:${Psecond}${Pfourth}${Pfirst}${Pthird}`;
                                console.log(arrangedIp);
                                const sendData = await axios.get(`http://${arrangedIp}/vscode/sendcode/data`);
                                if (!sendData) {
                                    document.getElementById("send-code-display-section").innerText = "Failed To Extract Data! Please Connect Both Device with the same internet";
                                    break;
                                } else {
                                    document.getElementById("send-code-display-section").innerText = sendData.data;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

        } else if (selectCodeExtractionMethod === "online") {
            const sendData = await axios({
                method: "GET",
                url: `https://extension-online-database-host.onrender.com/api/vscodeExtensions/v1/sendandstore/extractSendData/${getInsertedCode}`,
                data: {
                    code: getInsertedCode
                }
            });

            if (!sendData) {
                document.getElementById("send-code-display-section").innerText = "🤔 | please check your internet connection";
            } else if (sendData.data.status === "success") {
                document.getElementById("send-code-display-section").innerText = sendData.data.message.text;
            }
        }
    } catch (err) {
        document.getElementById("send-code-display-section").innerHTML = `<span style="color: #d4d4d4;">🤔 | Cannot Find Data With That Code : <span style="color: #3794FF;"> ${getInsertedCode} </span> </span>`;
    }
});