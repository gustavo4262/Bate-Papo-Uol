let username = startSession();
let intervalConn = setInterval(keepSession , 5000);
let intervalMsg;

function startSession(){
    let name = prompt("Digite seu nome");
    let msg = { name: name };
    let server = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants";
    let request = axios.post(server, msg);
    request.then(enterSession);
    request.catch(errorConn);
    return name;
}

function enterSession(){
    keepLoadMensages();
    intervalMsg = setInterval(keepLoadMensages, 3000);
}

function errorConn(){
    console.error();
    startSession();
}


function loadMessages(messages){
    messages.data.forEach(message => {
        let msgHTML;
        if(message.type === "status"){
            msgHTML = `<div class="${message.type} box">
            <span class="time">${message.time}</span>
            <span><strong>${message.from}</strong> ${message.text}</span>
            </div>`;
        }
        else if (message.type === "message"){
            msgHTML = `<div class="${message.type} box">
            <span class="time">${message.time}</span>
            <span><strong>${message.from}</strong> para <strong>${message.to}</strong>: ${message.text}</span>
            </div>`;
        }
        else if( (message.type === "private_message") && (message.to === username )){
            msgHTML = `<div class="${message.type} box">
            <span class="time">${message.time}</span>
            <span><strong>${message.from}</strong> reservadamente para <strong>${message.to}</strong>: ${message.text}</span>
            </div>`;
        }
        let content = document.querySelector(".content");
        content.innerHTML += msgHTML;
    });

    let lastMsg = document.querySelector(".content .box:last-child");
    lastMsg.scrollIntoView();
    
}

function keepSession(){
    let msg = { name: username };
    let server = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status";
    let request = axios.post(server, msg);
    request.catch( () => { clearInterval(intervalConn), clearInterval(intervalMsg)} );
}

function keepLoadMensages(){
    let server = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages";
    let request = axios.get(server);
    request.then(loadMessages);
    request.catch(errorConn);
}

function sendPublicMessage(){
    let server = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages";
    let destination = "Todos";
    let text = document.querySelector(".chatbox input").value;
    let msg = {
        from: username,
        to: destination,
        text: text,
        type: "message"
    }
    let request = axios.post(server, msg);
    request.then(enterSession);
    request.catch(errorConn);
}

