package com.diarpy.realtimechat.service;

import com.diarpy.realtimechat.model.ChatMessage;
import org.springframework.stereotype.Service;

import java.util.Deque;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * @author Mack_TB
 * @since 01/09/2024
 * @version 1.0.4
 */

@Service
public class ChatService {

    private final Deque<ChatMessage> messages = new ConcurrentLinkedDeque<>();

    public void addMessage(ChatMessage message) {
        messages.add(message);
    }

    public Deque<ChatMessage> getMessages() {
        return messages;
    }
}
