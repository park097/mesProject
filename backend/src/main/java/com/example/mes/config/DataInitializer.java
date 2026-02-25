package com.example.mes.config;

import com.example.mes.user.domain.User;
import com.example.mes.user.domain.UserRole;
import com.example.mes.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            createIfMissing(userRepository, passwordEncoder, "admin", "admin1234", UserRole.ADMIN);
            createIfMissing(userRepository, passwordEncoder, "user", "user1234", UserRole.USER);
            createIfMissing(userRepository, passwordEncoder, "system", "system1234", UserRole.ADMIN);
        };
    }

    private void createIfMissing(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            String username,
            String rawPassword,
            UserRole role
    ) {
        userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.save(
                        new User(username, passwordEncoder.encode(rawPassword), role)
                ));
    }
}
