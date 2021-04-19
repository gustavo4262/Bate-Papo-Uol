let username;
let intervalConn, intervalMsg, intervalPart;
let selection = {contacts: "Todos", visibility: "público"}
let keyFunction = startSession;


function startSession(){
    username = loadSession();
    let msg = { name: username };
    let server = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants";
    let request = axios.post(server, msg);
    request.then(enterSession);
    request.catch(errorStartSession);
}

function errorStartSession(){
    let input = document.querySelector(".start-page input");
    input.classList.remove("hidden");
    input.value = "";
    let button = document.querySelector(".start-page button");
    button.classList.remove("hidden");
    let load = document.querySelector(".start-page .load");
    load.classList.add("hidden");
    let text = document.querySelector(".start-page h1");
    text.classList.add("hidden");
    let warning = document.querySelector(".start-page h2");
    warning.classList.remove("hidden");
}

function loadSession(){
    let input = document.querySelector(".start-page input");
    input.classList.add("hidden");
    let button = document.querySelector(".start-page button");
    button.classList.add("hidden");
    let load = document.querySelector(".start-page .load");
    load.classList.remove("hidden");
    let text = document.querySelector(".start-page h1");
    text.classList.remove("hidden");
    keyFunction = sendMessage;
    return input.value;
}

function enterSession(){
    let startPage = document.querySelector(".start-page");
    if ( !startPage.classList.contains("hidden") )
        startPage.classList.add("hidden"); 
    
    loadMessages();
    intervalMsg = setInterval(loadMessages, 3000);
    loadsParticipants();
    intervalPart = setInterval(loadsParticipants, 10000);
    intervalConn = setInterval(keepSession , 5000);
}

function keepSession(){
    let msg = { name: username };
    let server = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status";
    let request = axios.post(server, msg);
    request.catch( () => { clearInterval(intervalConn), clearInterval(intervalMsg),  clearInterval(intervalPart)} );
}

function loadMessages(){
    let server = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages";
    let request = axios.get(server);
    request.then(updateMessages);
    request.catch(errorConn);
}

function updateMessages(messages){
    let content = document.querySelector(".content");
    content.innerHTML = "";
    
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
        else if( (message.type === "private_message") && ( (message.to === username) || (message.from === username))){
            msgHTML = `<div class="${message.type} box">
            <span class="time">${message.time}</span>
            <span><strong>${message.from}</strong> reservadamente para <strong>${message.to}</strong>: ${message.text}</span>
            </div>`;
        }
        if (msgHTML)
            content.innerHTML += msgHTML;
    });

    let lastMsg = document.querySelector(".content .box:last-child");
    lastMsg.scrollIntoView();
    
}

function toggleParticipantPage(){
    let participantPage = document.querySelector(".participant-page");
    participantPage.classList.toggle("hidden");
    let obscured = document.querySelector(".obscured");
    obscured.classList.toggle("hidden");
}

function loadsParticipants(){
    let server = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants";
    let request = axios.get(server);
    request.then(updateParticipants);
    request.catch(errorConn);
}

function updateParticipants(participants){
    let partList = document.querySelector(".contacts");
    let firstItem = partList.querySelector(":first-child");
    Array.from(partList.children).forEach( item => {
        if (item != firstItem){
            item.remove();
        }
    })

    participants.data.forEach( part => {
        let selectionHTML = ""
        if ( part.name === selection["contacts"] )
            selectionHTML = `<ion-icon name="checkmark-outline" class="selected"></ion-icon>`; 
        let partHTML = `<div class="item" onclick="selectItem(this)">
            <ion-icon name="person-circle"></ion-icon>
            <h2>${part.name}</h2>
            ${selectionHTML}
        </div>`;
        partList.innerHTML += partHTML;
    })

}

function selectItem(element){
    let elementSelected = element.querySelector("h2").innerHTML;
    if( (elementSelected === "Reservadamente") && ( selection["contacts"] === "Todos") )
        return;

    let parent = element.parentNode;
    Array.from(parent.children).forEach( item => {
        let icon = item.querySelector("ion-icon:last-child");
        try{
            if (icon.classList.contains("selected")){
                icon.remove();
            }
        }
        catch(err){    
        }
        if ( (parent.classList[0] == "visibility") ) {
            let iconElement = item.querySelector(".lock");
            iconElement.setAttribute("name", "lock-closed");
        }
    })
    
    let iconHTML = `<ion-icon name="checkmark-outline" class="selected"></ion-icon>`;
    element.innerHTML += iconHTML;

    selection[ parent.classList[0] ] = elementSelected.toLowerCase();

    if (parent.classList[0] == "visibility"){
        let iconElement = element.querySelector(".lock");
        iconElement.setAttribute("name", "lock-open");
    }

    updateChatBox();
}

function updateChatBox(){
    let textElement = document.querySelector(".chatbox span");
    let text = `Enviando para ${selection["contacts"]} (${selection["visibility"]})`
    textElement.innerHTML = text;
}


function sendMessage(){
    let server = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages";
    let type = "private_message";
    if ( selection["visibility"] === "público" )
        type = "message"
    let text = document.querySelector(".chatbox input").value;
    document.querySelector(".chatbox input").value = "";
    let msg = {
        from: username,
        to: selection["contacts"],
        text: text,
        type: type
    }
    let request = axios.post(server, msg);
    request.then(enterSession);
    request.catch(errorConn);
}

function errorConn(){
    window.location.reload();
}

document.onkeypress = function(e){
    e = e || window.event;
    var key = e.which || e.keyCode;
    if(key===13){
        keyFunction();
    }
}