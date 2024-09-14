/**
 * @author Mack_TB
 * @since 01/09/2024
 * @version 1.0.4
 */

let usernamePage = document.getElementById("username-page")
let sendUsernameBtn = document.getElementById("send-username-btn")
let chatPage = document.getElementById("chat-page")
let inputMsg = document.getElementById("input-msg")
let sendMsgBtn = document.getElementById("send-msg-btn")
let connectingElement = document.querySelector(".connecting")
let stompClient = null
let username = null

function connect() {
    username = document.getElementById("input-username").value.trim()
    if (username) {
        usernamePage.classList.add("hidden")
        chatPage.classList.remove("hidden")

        let socket = new SockJS("/ws")
        stompClient = Stomp.over(socket)
        stompClient.connect({}, onConnected, onError)
    }
}

function onConnected() {
    stompClient.subscribe("/topic/public", onMessageReceived)

    // tell your username to the server
    stompClient.send("/app/chat.addUser", {},
        JSON.stringify({sender: username, type: "JOIN", createdAt: new Date()}))
    fetchOldMessages()

    connectingElement.classList.add("hidden")
}

function onError() {
    connectingElement.textContent = "Could not connect to WebSocket server. Please refresh this page to retry"
    connectingElement.style.color = "red"
    connectingElement.style.display = "block"
}

function onMessageReceived(payload) {
    let message = JSON.parse(payload.body)
    createNode(message)
}

function createNode(message) {
    let container = document.getElementById("messages")
    if (message.type === "CHAT") {
        let messageContainer = document.createElement("div")
        messageContainer.classList.add("message-container")

        let messageHeader = document.createElement("div")
        messageHeader.classList.add("message-header")

        let senderTag = document.createElement("div")
        senderTag.classList.add("sender")
        senderTag.textContent = message.sender
        messageHeader.appendChild(senderTag)

        let createdAtTag = document.createElement("div")
        createdAtTag.classList.add("date")
        createdAtTag.textContent = message.createdAt
        messageHeader.appendChild(createdAtTag)

        messageContainer.appendChild(messageHeader)

        let messageTag = document.createElement("div")
        messageTag.classList.add("message")
        messageTag.textContent = message.content
        messageContainer.appendChild(messageTag)

        container.appendChild(messageContainer)

        messageContainer.scrollIntoView({"behavior": "smooth"})
    }
}

function sendMessage() {
    // event.preventDefault()
    let messageContent = inputMsg.value.trim()
    if (messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            content: messageContent,
            createdAt: new Date(),
            type: "CHAT"
        }
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage))
        inputMsg.value = ""
    }
}

function fetchOldMessages() {
    fetch("api/messages/history")
        .then(responses => responses.json())
        .then(messages => {
            messages.forEach(message => createNode(message))
        })
}

sendUsernameBtn.addEventListener("click", connect)
sendMsgBtn.addEventListener("click",  sendMessage)