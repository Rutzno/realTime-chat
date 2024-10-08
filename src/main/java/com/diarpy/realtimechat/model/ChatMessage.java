package com.diarpy.realtimechat.model;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * @author Mack_TB
 * @since 01/09/2024
 * @version 1.0.7
 */

public class ChatMessage {
    private MessageType type;
    private String sender;
    private String content;
    private String createdAt;
    private String recipient; // for private messaging

    public enum MessageType {CHAT, JOIN, LEAVE, PRIVATE_CHAT}

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        LocalDateTime formattedDate = ZonedDateTime.parse(createdAt).toLocalDateTime();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a | MMM dd");
        this.createdAt = formattedDate.format(formatter);
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a | MMM dd");
        this.createdAt = createdAt.format(formatter);
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }
}