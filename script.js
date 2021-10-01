let compile = document.getElementById("Sumbit");
let reset = document.getElementById("Reset");
let input = document.getElementById("input");
let code_id = document.getElementById("code_id");
let output1 = document.getElementById("output");

reset.addEventListener("click", function(){
    output1.value = "Output: ";
    compile.value = "Compile";
});

compile.addEventListener("click", function(){
    compile.value = "Compiling";
    getCodeId();
});

function getCodeId(){
    let codeId;

    let data_object = new Object();
    data_object.code = input.value;
    data_object.langId = code_id.options[code_id.selectedIndex].value;

    let data_send = new XMLHttpRequest();
    let data_receive = new XMLHttpRequest();

    data_send.open("POST","https://codequotient.com/api/executeCode",true);
    data_send.setRequestHeader("content-Type","application/json");
    data_send.onload = function(){ 
        let codedata = JSON.parse(data_send.responseText);
        if(Object.keys(codedata) == "error"){
            output1.innerHTML = "Error: " + codedata.error;
            compile.value = "Compile";
            return;
        }

        console.log(codedata.codeId);
        codeId = codedata.codeId;

        response = setInterval(function(){
            data_receive.open("GET",`https://codequotient.com/api/codeResult/${codeId}`,true);
            console.log(codeId);
            data_receive.onload = function(){
            let outputdata = JSON.parse(JSON.parse(data_receive.responseText).data);
            clearInterval(response);
            console.log(outputdata);
            if(outputdata.errors !== "")
            {
                output1.innerHTML = "Error: " + outputdata.errors;
            }
            else{
                output1.innerHTML = outputdata.output;
            }
            compile.value="Compile";
        }
        data_receive.send();

        }, 3000); 
    }
    data_send.send(JSON.stringify(data_object));
}