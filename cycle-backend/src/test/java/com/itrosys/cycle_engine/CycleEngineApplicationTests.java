package com.itrosys.cycle_engine;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest // Load full Spring context
@ActiveProfiles("test") // Use application-test.properties
@Transactional // Rollback DB changes after each test
class CycleEngineApplicationTests {

	@Test
	void contextLoads() {
		System.out.println("CycleEnginApplication Started");
	}

}
