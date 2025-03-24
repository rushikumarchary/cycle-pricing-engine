package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.entity.User;
import com.itrosys.cycle_engine.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "User Controller", description = "APIs related to user Management")
public class UserController {
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Sing up as user", description = "with this user can sing up")
    @PostMapping("/signUp")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @Operation(summary = "Sing In as user", description = "with this user can sing in")
    @PostMapping("/signIn")
    public String singIn(@RequestBody User user) {
        return userService.verify(user);
    }
}
