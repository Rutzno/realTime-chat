/**
 * @author Mack_TB
 * @since 01/09/2024
 * @version 1.0.3
 */

let inputMsg = document.getElementById("input-msg")
let connectingElement = document.querySelector(".connecting")
let stompClient = null

function connect() {
    let socket = new SockJS("/ws")
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnected, onError)
}

function onConnected() {
    stompClient.subscribe("/topic/public", onMessageReceived)
    connectingElement.classList.add("hidden")
}

function onError() {
    connectingElement.textContent = "Could not connect to WebSocket server. Please refresh this page to retry"
    connectingElement.style.color = "red"
    connectingElement.style.display = "block"
}

function onMessageReceived(payload) {
    let message = JSON.parse(payload.body)
    createNode(message.content)
}

function createNode(message) {
    let container = document.getElementById("messages")
    let hrTag = document.createElement("hr")
    container.appendChild(hrTag)
    let messageTag = document.createElement("div")
    messageTag.classList.add("message")
    messageTag.textContent = message
    container.appendChild(messageTag)
    messageTag.scrollIntoView({"behavior": "smooth"})
}

function sendMessage() {
    // event.preventDefault()
    let messageContent = inputMsg.value.trim()
    if (messageContent && stompClient) {
        let chatMessage = {
            content: messageContent
        }
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage))
        inputMsg.value = ""
    }
}

connect()
let sendMsgBtn = document.getElementById("send-msg-btn")
sendMsgBtn.addEventListener("click",  sendMessage)