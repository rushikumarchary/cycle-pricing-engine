package com.itrosys.cycle_engine.config;

import com.itrosys.cycle_engine.service.RoleService;
import com.itrosys.cycle_engine.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class DataSetupConfig {

    private final RoleService roleService;
    private final UserService userService;

    public DataSetupConfig(RoleService roleService, UserService userService) {
        this.roleService = roleService;
        this.userService = userService;
    }

    @Bean
    CommandLineRunner setupData() {
        return args -> {
            roleService.createRoleIfNotExist("ADMIN");
            roleService.createRoleIfNotExist("MANAGER");
            roleService.createRoleIfNotExist("EMPLOYEE");
            roleService.createRoleIfNotExist("USER");
            userService.createAdminUserIfNotExist();
        };
    }
}