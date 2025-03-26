package com.itrosys.cycle_engine.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itrosys.cycle_engine.entity.Role;
import com.itrosys.cycle_engine.entity.User;
import com.itrosys.cycle_engine.exception.BadCredentials;
import com.itrosys.cycle_engine.exception.EmailAlreadyExists;
import com.itrosys.cycle_engine.exception.UsernameAlreadyExists;
import com.itrosys.cycle_engine.exception.UsernameAndEmailAlreadyExists;
import com.itrosys.cycle_engine.repository.RoleRepository;
import com.itrosys.cycle_engine.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthenticationManager authManager;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, AuthenticationManager authManager, JWTService jwtService, PasswordEncoder passwordEncoder,RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository=roleRepository;
    }

//    public User register(User user) {
//
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        return userRepository.save(user);
//    }
public User register(User user) {
    List<User> existingUsers = userRepository.findByUsernameOrEmail(user.getUsername(), user.getEmail());

    if (!existingUsers.isEmpty()) {
        boolean usernameExists = existingUsers.stream().anyMatch(u -> u.getUsername().equals(user.getUsername()));
        boolean emailExists = existingUsers.stream().anyMatch(u -> u.getEmail().equals(user.getEmail()));

        if (usernameExists && emailExists) {
            throw new UsernameAndEmailAlreadyExists("Both username and email already have different you can't Use");
        } else if (usernameExists) {
            throw new UsernameAlreadyExists("Username already have different account");
        } else {
            throw new EmailAlreadyExists("Email already have different account");
        }
    }

    Role defaultRole = user.getEmail().contains("@itrosys.com")
            ? roleRepository.findByName("EMPLOYEE")
            : roleRepository.findByName("USER");

    user.setRole(defaultRole);
    user.setRegisterDate(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
    user.setPassword(passwordEncoder.encode(user.getPassword()));

    return userRepository.save(user);
}



    public String verify(User user) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal(); // Get authenticated user details
            return jwtService.generateToken(userDetails); // Pass userDetails to include role
        } catch (Exception e) {
            throw new BadCredentials("Authentication failed: " + e.getMessage());
        }
    }

    @Transactional
    public void createAdminUserIfNotExist() {
        Role adminRole = roleRepository.findByName("ADMIN");

        if (adminRole != null) {
            User adminUser = userRepository.findByUsername("ADMIN");

            if (adminUser == null) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin@1234"));
                admin.setEmail("admin@itrosys.com");
                admin.setRegisterDate(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
                admin.setRole(adminRole);
                userRepository.save(admin);
            }
        } else {
            System.out.println("ADMIN role not found. Please ensure roles are created.");
        }
    }


//    public String verify(User user) {
//        try {
//            Authentication authentication = authManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
//            );
//            return jwtService.generateToken(user.getUsername());
//        } catch (Exception e) {
//            throw new BadCredentials("Authentication failed: " + e.getMessage());
//
//        }
//    }

}
