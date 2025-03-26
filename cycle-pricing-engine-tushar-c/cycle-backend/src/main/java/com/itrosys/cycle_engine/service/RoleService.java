package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.entity.Role;
import com.itrosys.cycle_engine.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleService {

    private final RoleRepository roleRepo;

    public RoleService(RoleRepository roleRepo) {
        this.roleRepo = roleRepo;
    }

    @Transactional
    public void createRoleIfNotExist(String roleName) {
        if (roleRepo.findByName(roleName) == null) {
            roleRepo.save(new Role(null, roleName));
        }
    }
}
