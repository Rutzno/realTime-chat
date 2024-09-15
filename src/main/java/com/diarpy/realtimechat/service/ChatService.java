package com.diarpy.realtimechat.service;

import com.diarpy.realtimechat.model.ChatMessage;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * @author Mack_TB
 * @since 01/09/2024
 * @version 1.0.7
 */

@Service
public class ChatService {

    private final Deque<ChatMessage> publicMessages = new ConcurrentLinkedDeque<>();
    private final Map<String, Deque<ChatMessage>> privateMessages = new ConcurrentHashMap<>();

    public void addMessage(ChatMessage message) {
        if (message.getRecipient() == null) {
            publicMessages.add(message);
        } else {
            String chatID = createChatID(message.getSender(), message.getRecipient());
            privateMessages.computeIfAbsent(chatID, k -> new ConcurrentLinkedDeque<>()).add(message);
        }
    }

    public Deque<ChatMessage> getPublicMessages() {
        return publicMessages;
    }

    public Deque<ChatMessage> getPrivateMessages(String sender, String recipient) {
        String chatID = createChatID(sender, recipient);
        return privateMessages.getOrDefault(chatID, new ConcurrentLinkedDeque<>());
    }

    private String createChatID(String sender, String recipient) {
        List<String> users = Arrays.asList(sender, recipient);
        Collections.sort(users);
        return users.get(0) + "-" + users.get(1);
    }
}
