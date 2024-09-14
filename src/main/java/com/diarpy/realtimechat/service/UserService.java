package com.diarpy.realtimechat.service;

import com.diarpy.realtimechat.model.User;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * @author Mack_TB
 * @since 01/09/2024
 * @version 1.0.5
 */

@Service
public class UserService {
    private final Set<User> users = new CopyOnWriteArraySet<>();

    public void addUser(User user) {
        users.add(user);
    }

    public void removeUser(User user) {
        users.remove(user);
    }

    public Set<User> getUsers() {
        return users;
    }
}
