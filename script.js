let chatStarted = false;

let participantToken = "";
let participantId = "";
let contactId = "";

let connectionToken = "";
let websocketUrl = "";

let socket = null;

// ---------------- UI CONTROLS ----------------
function openChat() {
    document.getElementById("chatPopup").style.display = "block";
}

function closeChat() {
    document.getElementById("chatPopup").style.display = "none";

    if (socket) {
        socket.close();
        socket = null;
    }

    // reset state safely
    chatStarted = false;
    participantToken = "";
    participantId = "";
    contactId = "";
    connectionToken = "";
    websocketUrl = "";
}

// ---------------- SEND MESSAGE ----------------
async function sendMessage() {

    let input = document.getElementById("message");
    let msg = input.value.trim();

    if (!msg) return;

    renderMessage(msg, "user-message");
    input.value = "";

    if (!chatStarted) {
        await startChat();
        chatStarted = true;
    }

    // ensure everything is ready
    if (!connectionToken || !socket || socket.readyState !== WebSocket.OPEN) {
        console.log("Chat not ready yet. Please wait...");
        return;
    }

    await sendToAgent(msg);
}

// ---------------- START CHAT ----------------
async function startChat() {

    try {
        // 1. Start chat
        const response = await fetch(
            "https://dqicwdsr77.execute-api.us-east-1.amazonaws.com/dev/start-chat",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    displayName: "Customer"
                })
            }
        );

        const data = await response.json();

        participantToken = data.ParticipantToken;
        participantId = data.ParticipantId;
        contactId = data.ContactId;

        console.log("Chat Started");

        // 2. Create participant connection
        const participantResponse = await fetch(
            "https://8p4lmns2qa.execute-api.us-east-1.amazonaws.com/dev/create-participant-connection",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ParticipantToken: participantToken
                })
            }
        );

        const participantData = await participantResponse.json();

        connectionToken =
            participantData.ConnectionCredentials.ConnectionToken;

        websocketUrl =
            participantData.Websocket.Url;

        console.log("Connection Token:", connectionToken);
        console.log("WebSocket URL:", websocketUrl);

        // 3. WebSocket connection (wait until ready)
        await connectWebSocket();

    } catch (error) {
        console.log("startChat error:", error);
    }
}

// ---------------- WEBSOCKET ----------------
function connectWebSocket() {

    return new Promise((resolve, reject) => {

        socket = new WebSocket(websocketUrl);

        socket.onopen = function () {
            console.log("WebSocket Connected");
            resolve();
        };

        socket.onmessage = function (event) {
            console.log("Received:", event.data);

            try {
                const data = JSON.parse(event.data);

                if (data.Content) {
                    renderMessage(data.Content, "agent-message");
                }

            } catch (e) {
                // fallback for non-json messages
                console.log("Raw message:", event.data);
            }
        };

        socket.onerror = function (error) {
            console.log("WebSocket Error:", error);
            reject(error);
        };

        socket.onclose = function () {
            console.log("WebSocket Closed");
        };

    });
}

// ---------------- SEND TO AMAZON CONNECT ----------------
async function sendToAgent(message) {

    try {
        const response = await fetch(
            "https://03okis90h8.execute-api.us-east-1.amazonaws.com/dev/send-message",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ConnectionToken: connectionToken,
                    Content: message,
                    ContentType: "text/plain"
                })
            }
        );

        const data = await response.json();
        console.log("SendMessage Success:", data);

    } catch (error) {
        console.log("sendToAgent error:", error);
    }
}

// ---------------- UI HELPER ----------------
function renderMessage(message, className) {

    let chat = document.getElementById("chatMessages");

    let div = document.createElement("div");

    div.className = className;

    // FIX: prevent XSS
    div.textContent = message;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}