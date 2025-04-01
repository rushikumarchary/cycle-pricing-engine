package com.itrosys.cycle_engine.config;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.itrosys.cycle_engine.entity.CustomUserDetails;

public class UserInfo {
    
    public static Long getLoggedInUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getId();
        } else {
            throw new IllegalStateException("User ID not found in authentication context");
        }
    }

    // Helper method to get the logged-in username
    public static String getLoggedInUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        } else {
            return principal.toString();
        }
    }
}
