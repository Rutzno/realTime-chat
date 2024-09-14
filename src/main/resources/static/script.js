/**
 * @author Mack_TB
 * @since 01/09/2024
 * @version 1.0.6
 */

let usernamePage = document.getElementById("username-page")
let sendUsernameBtn = document.getElementById("send-username-btn")
let chatWith = document.getElementById("chat-with")
let container = document.getElementById("messages")
let users = document.getElementById("users")
let userButtons = users.getElementsByClassName("user");
let publicChatBtn = document.getElementById("public-chat-btn")
let chatPage = document.getElementById("chat-page")
let inputMsg = document.getElementById("input-msg")
let sendMsgBtn = document.getElementById("send-msg-btn")
let connectingElement = document.querySelector(".connecting")
let stompClient = null
let username = null
let currentChat = "Public chat"

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
    fetchOnlineUsers()

    connectingElement.classList.add("hidden")
}

function onError() {
    connectingElement.textContent = "Could not connect to WebSocket server. Please refresh this page to retry"
    connectingElement.style.color = "red"
    connectingElement.style.display = "block"
}

function onMessageReceived(payload) {
    let message = JSON.parse(payload.body)
    switch (message.type) {
        case "JOIN":
            if (username !== message.sender) {
                createUserNode(message.sender)
            }
            break
        case "LEAVE":
            removeUserByName(message.sender)
            break
        case "CHAT":
            if (chatWith.textContent === "Public chat") {
                createMessageNode(message)
            }
            break
    }
}

function createMessageNode(message) {
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

function createUserNode(user) {
    let userButton = document.createElement("button")
    userButton.classList.add("user")
    userButton.textContent = user
    users.appendChild(userButton)
    /*let hrTag = document.createElement("hr")
    userTag.appendChild(hrTag)*/
    userButton.addEventListener("click", () => handleUserButton(user))
}

function removeUserByName(userName) {
    for (let i = 0; i < userButtons.length; i++) {
        if (userButtons[i].textContent === userName) {
            userButtons[i].remove();  // Remove the user with matching text content
            break;  // Stop once the user is found and removed
        }
    }
}

function handleUserButton(username) {
    publicChatBtn.classList.remove("primary")
    chatWith.textContent = username
    container.replaceChildren()
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
            messages.forEach(message => createMessageNode(message))
        }).catch(err => console.log("Error when fetching message in Backend", err))
}

function fetchOnlineUsers() {
    fetch("/api/users")
        .then(responses => responses.json())
        .then(users => {
            users.forEach(onlineUser => {
                if (onlineUser.username !== username) {
                    createUserNode(onlineUser.username)
                }
            })
        })
}

sendUsernameBtn.addEventListener("click", connect)
sendMsgBtn.addEventListener("click",  sendMessage)
publicChatBtn.addEventListener("click", () => {
    publicChatBtn.classList.add("primary")
    chatWith.textContent = "Public chat"
    fetchOldMessages()
})