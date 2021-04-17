let name = startSession();
setInterval(() => {keepConnection(name) }, 5000);

function startSession(){
    let name = prompt("Digite seu nome");
    let msg = `{
        name: "${name}"
    }`
    let server = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants";
    let request = axios.post(server, msg);
    console.log(msg);
    request.then(enterSession);
    request.catch(errorEnterSession);
    return name;
}

function enterSession(){
    console.log("entering session");
}

function errorEnterSession(){
    console.error();
}

function keepConnection(name){
    let msg = `{
        name: "${name}"
    }`;
    let server = "https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status";
    let request = axios.post(server, msg);
    request.then( () => {console.log("OK")} );
    request.catch( () => {console.log("Saiu da sala")} );
}


