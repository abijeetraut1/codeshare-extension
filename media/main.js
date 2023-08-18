document.getElementById('checkCodeAndProvideCode').addEventListener('click', async () => {
    const getCode = document.getElementById("code-display-section");
    const getInsertedCode = document.getElementById("get-inserted-code").value;
    getCode.innerText = getInsertedCode === '' || getInsertedCode === ' ' ? "Please Insert Valid Code" : `Inserted Code: ${getInsertedCode}`;

    
});