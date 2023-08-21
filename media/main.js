document.getElementById('checkCodeAndProvideCode').addEventListener('click', async () => {
    const getCode = document.getElementById("code-display-section");
    const selectCodeExtractionMethod = document.getElementById("select-extraction-method").value;
    
    const getInsertedCode = document.getElementById("get-inserted-code").value;
    getCode.innerHTML = getInsertedCode === '' || getInsertedCode === ' ' ? "Please Insert Valid Code" : `Inserted Code: <span style="color: #3794FF; "> ${getInsertedCode} </span>`;
    document.getElementById("code-displaying-method").innerHTML = `Code Recive Method : <span style="color: #3794FF;"> ${selectCodeExtractionMethod.toUpperCase()} </span>`;
    
    try {
        if (selectCodeExtractionMethod === "offline") {
            const sendData = await axios.get(`http://127.155.101.1:${getInsertedCode}`);
            if (!sendData) {
                document.getElementById("send-code-display-section").innerText = "Failed To Extract Data! Please Connect Both Device with the same internet";
            } else {
                document.getElementById("send-code-display-section").innerText = sendData.data;
            }
        }else if(selectCodeExtractionMethod === "online"){
            const sendData = await axios({
                method: "GET",
                url: `https://extension-online-database-host.onrender.com/api/vscodeExtensions/v1/sendandstore/extractSendData/${getInsertedCode}`,
                data:{
                    code: getInsertedCode
                }
            });

            if (!sendData) {
                document.getElementById("send-code-display-section").innerText = "🤔 | please check your internet connection";
            }else if (sendData.data.status === "success"){
                document.getElementById("send-code-display-section").innerText = sendData.data.message.text;
            }
        }
    } catch (err) {
        document.getElementById("send-code-display-section").innerHTML = `<span style="color: #d4d4d4;">🤔 | Cannot Find Data With That Code : <span style="color: #3794FF;"> ${getInsertedCode} </span> </span>` ;
    }
});