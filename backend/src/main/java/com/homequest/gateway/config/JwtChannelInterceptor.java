package com.homequest.gateway.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.homequest.auth.security.JwtUtil;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            Object tokenAttr = accessor.getSessionAttributes().get("token");
            if (tokenAttr instanceof String token && token != null && !token.isBlank()) {
                try {
                    if (jwtUtil.isTokenValid(token)) {
                        String uid = jwtUtil.extractUid(token);
                        String role = jwtUtil.extractRole(token);
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                uid,
                                null,
                                role != null ? List.of(new SimpleGrantedAuthority(role)) : List.of());
                        accessor.setUser(authentication);
                    }
                } catch (Exception e) {
                    // token invalid — leave unauthenticated
                }
            }
        }

        return message;
    }
}
