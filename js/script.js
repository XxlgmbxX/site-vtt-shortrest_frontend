// Login elements
const login = document.querySelector(".login");
const loginForm = document.querySelector(".loginForm");
const loginInput = document.querySelector(".loginInput");
// Chat sender elements
const sender = document.querySelector(".sender");  // Corrigido de ".login" para ".sender"
const senderForm = document.querySelector(".senderForm");
const senderInput = document.querySelector(".senderInput");
const messagesArea = document.querySelector(".messagesArea");
const textarea = document.querySelector('.sender textarea');
textarea.addEventListener('keydown', function(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        const textoDigitado = textarea.value.trim();
        if (textoDigitado !== "") {
            // Chama a função sendMessage para enviar a mensagem
            sendMessage(textoDigitado);
        }
    }
});
const user = {id: "", name: ""};
let websocket;
const createMessage = (userName, content) => {
    const div = document.createElement("div");
    const span = document.createElement("span");
    const lineBreak = document.createElement("br");
    const text = document.createElement("p");
    div.classList.add("messages");
    span.classList.add("userSender");
    div.appendChild(span);
    div.appendChild(lineBreak);
    div.appendChild(text);
    span.innerHTML = userName;
    text.innerHTML = content;
    return div;
};
const createRoll = (userName, content) => {
    const div = document.createElement("div");
    const span = document.createElement("span");
    const lineBreak = document.createElement("br");
    const roll = document.createElement("p");
    div.classList.add("messages");
    span.classList.add("userSender");
    div.appendChild(span);
    div.appendChild(lineBreak);
    div.appendChild(roll);
    span.innerHTML = userName
    roll.innerHTML = content
    return div;
};
const scrollScreen = () => {
    const lastMessage = messagesArea.lastElementChild;
    lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
};
const processMessage = ({ data }) => {
    const { type, userId, userName, content} = JSON.parse(data);
    let element;
    if (type === "roll") {
        element = createRoll(userName, content);
    } 
    if (type === "message") {
        element = createMessage(content, userName);
        element = createMessage(userName, content);
    }

    messagesArea.appendChild(element);
    scrollScreen();
};
const handleLogin = (event) => {
    event.preventDefault();
    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    login.style.display = "none";
    websocket = new WebSocket("wss://site-teste-kawk.onrender.com");
    websocket.onmessage = processMessage;
    websocket.onerror = function(error) {
        console.error("Erro ao conectar ao servidor WebSocket:", error);
    };
};
const sendMessage = (messageContent) => {
    event.preventDefault();
    const message = {
        userId: user.id,
        userName: user.name,
        content: messageContent,
        type: "message"
    };
    websocket.send(JSON.stringify(message));
    textarea.value = "";
};
//manda mensagem pra o servidor
const sendRoll = (dice) => {
    const roll = {
        userId: user.id,
        userName: user.name,
        content: Math.floor(Math.random() * dice) + 1,
        type: "roll"
    }
    websocket.send(JSON.stringify(roll));
}
loginForm.addEventListener("submit", handleLogin);