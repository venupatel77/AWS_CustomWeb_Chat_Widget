# Amazon Connect Custom Chat Widget (Frontend + StartChat Integration)

##  Project Overview

This project is a **custom web-based chat widget** built using **HTML, CSS, and JavaScript**, integrated with **AWS Amazon Connect** using a backend powered by **API Gateway + AWS Lambda (Python)**.

The goal is to simulate a real-time customer support chat system where:
- A user clicks a chat button
- A chat popup opens
- A chat session is initiated with Amazon Connect
- Backend starts a chat contact using Amazon Connect APIs

---

##  Current Architecture (Implemented Phase)

User Browser (HTML + JS Chat Widget)
        |
        |  Click "Start Chat"
        v
API Gateway (POST /start-chat)
        |
        v
AWS Lambda (Python)
        |
        |  StartChatContact API
        v
Amazon Connect Instance
        |
        v
Returns:
- ContactId
- ParticipantId
- ParticipantToken

## Tech Stack

### Frontend

* HTML
* CSS
* Vanilla JavaScript

### Backend

* AWS Lambda (Python)
* Amazon API Gateway

### AWS Service

* Amazon Connect (Start Chat Contact API)

---

##  Features Implemented

### Frontend

* Floating chat button 
* Chat popup UI (modern messenger style)
* Send message UI
* Message rendering inside chat window
* Basic user interaction handling

### Backend

* API Gateway endpoint `/start-chat`
* Lambda function integration
* Amazon Connect `StartChatContact` API call
* Returns chat session identifiers

---

## User Flow (Current State)

1. User opens web page
2. Clicks  chat button
3. Chat popup opens
4. User types a message
5. First message triggers backend API
6. API Gateway invokes Lambda
7. Lambda calls Amazon Connect StartChatContact
8. Amazon Connect returns session tokens
9. Frontend stores session details


##  Project Structure

AmazonConnectChat/
│
├── index.html        # Chat UI
├── style.css         # Chat styling (popup UI)
├── script.js         # Chat logic + API call integration
└── README.md



##  AWS Backend API

### Endpoint


POST /start-chat

### Request Body

json
{
  "displayName": "Customer"
}

### Response

json
{
  "ContactId": "xxx",
  "ParticipantId": "xxx",
  "ParticipantToken": "xxx"
}




## Lambda Function (Python)

The Lambda function:

* Receives request from API Gateway
* Calls Amazon Connect StartChatContact
* Returns chat session details to frontend



##  What is NOT implemented yet (Next Phase)

The following features are planned:

### 1. Real-time messaging

* CreateParticipantConnection API
* WebSocket integration

### 2. Message exchange

* SendMessage API
* ReceiveMessage handling

### 3. Contact Flow logic

* Amazon Connect Contact Flow routing
* Lex bot integration (optional)
* Lambda-based business logic (e.g., account balance)


##  Future Architecture (Next Phase)


Frontend Chat Widget
        |
        | Start Chat
        v
API Gateway → Lambda → StartChatContact
        |
        v
Amazon Connect Contact Flow
        |
        v
CreateParticipantConnection
        |
        v
WebSocket Channel
        |
        v
Real-time Chat Messaging (Customer ↔ Agent/Bot)


---

## Purpose of Project

This project demonstrates:

* How to build a **custom chat UI**
* How to integrate with **Amazon Connect Chat APIs**
* How to use **serverless backend (Lambda + API Gateway)**
* How to design a **real-world customer support chat system**

---

##  Author

Built for learning and implementation of:

* AWS Amazon Connect Chat
* Serverless backend architecture
* Custom web chat widgets

---

##  Status


Phase 1: UI + StartChatContact Integration ✅Completed
Phase 2: Real-time Messaging (WebSocket) 🔄 In Progress
Phase 3: Contact Flow + Bot Integration ⏳ Planned



## 📌 Notes

* Frontend is built without React for simplicity
* Backend is fully serverless using AWS Lambda
* Designed to be extended into production-grade chat system

```
