document.getElementById('checkCodeAndProvideCode').addEventListener('click', async () => {
    const getCode = document.getElementById("code-display-section");
    const getInsertedCode = document.getElementById("get-inserted-code").value;
    getCode.innerText = getInsertedCode === '' || getInsertedCode === ' ' ? "Please Insert Valid Code" : `Inserted Code: ${getInsertedCode}`;

    try{
        const sendData = await axios.get(`http://127.155.101.1:${getInsertedCode}`);
        if(!sendData){
            document.getElementById("send-code-display-section").innerText = "Failed To Extract Data! Please Connect Both Device with the same internet";
        }else{
            document.getElementById("send-code-display-section").innerText = sendData.data;
        }
    } catch(err){
        document.getElementById("send-code-display-section").innerText =  "err.message : " + err.message + "\n err.name : " + err.name;
    }
});
