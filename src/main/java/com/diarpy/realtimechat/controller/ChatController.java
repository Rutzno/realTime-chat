package com.diarpy.realtimechat.controller;

import com.diarpy.realtimechat.model.ChatMessage;
import com.diarpy.realtimechat.model.User;
import com.diarpy.realtimechat.service.ChatService;
import com.diarpy.realtimechat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Deque;
import java.util.Set;

/**
 * @author Mack_TB
 * @since 01/09/2024
 * @version 1.0.7
 */

@RestController
public class ChatController {
    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatService chatService;
    private final UserService userService;

    @Autowired
    public ChatController(SimpMessageSendingOperations messagingTemplate, ChatService chatService, UserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
        this.userService = userService;
    }

    @MessageMapping("/chat.sendMessage")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        chatService.addMessage(chatMessage);
        if (chatMessage.getRecipient() != null && !chatMessage.getRecipient().isEmpty()) {
            // Private message
            messagingTemplate.convertAndSendToUser(
                    chatMessage.getRecipient(),
                    "/private",
                    chatMessage);
            messagingTemplate.convertAndSendToUser(
                    chatMessage.getSender(),
                    "/private",
                    chatMessage);
        } else { // Public message
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        }
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        User user = new User();
        user.setUsername(chatMessage.getSender());

        headerAccessor.getSessionAttributes().put("username", user);

        userService.addUser(user);
        return chatMessage;
    }

    @GetMapping("/api/messages/history")
    public Deque<ChatMessage> getMessageHistory() {
        return chatService.getPublicMessages();
    }

    @GetMapping("/api/messages/private")
    public Deque<ChatMessage> getPrivateMessages(@RequestParam String sender, @RequestParam String recipient) {
        return chatService.getPrivateMessages(sender, recipient);
    }

    @GetMapping("/api/users")
    public Set<User> getOnlineUsers() {
        return userService.getUsers();
    }
}