/**
 * @author Mack_TB
 * @since 01/09/2024
 * @version 1.0.2
 */

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

let sendMsgBtn = document.getElementById("send-msg-btn")
sendMsgBtn.addEventListener("click",  (event) => {
    // event.preventDefault()
    let inputMsg = document.getElementById("input-msg")
    let message = inputMsg.value
    if (message != null && message !== "") {
        createNode(message)
        inputMsg.value = ""
    }
})