package com.diarpy.realtimechat.controller;

import com.diarpy.realtimechat.model.ChatMessage;
import com.diarpy.realtimechat.model.User;
import com.diarpy.realtimechat.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.time.LocalDateTime;

/**
 * @author Mack_TB
 * @since 01/09/2024
 * @version 1.0.5
 */

@Component
public class WebSocketEventListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketEventListener.class);
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;
    @Autowired
    private UserService userService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        LOGGER.info("Received a new web socket connection");
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
        LOGGER.info("Received a new web socket subscribe event");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        User username = (User) accessor.getSessionAttributes().get("username");
        if (username != null) {
            LOGGER.info("Disconnected from user {}", username);

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSender(username.getUsername());
            chatMessage.setType(ChatMessage.MessageType.LEAVE);
            chatMessage.setCreatedAt(LocalDateTime.now());
            userService.removeUser(username);

            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}