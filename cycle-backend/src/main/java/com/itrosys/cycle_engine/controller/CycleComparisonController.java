package com.itrosys.cycle_engine.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itrosys.cycle_engine.dto.CycleComparisonResponse;
import com.itrosys.cycle_engine.service.CycleComparisonService;

@RestController
@RequestMapping("/api/comparisons")
public class CycleComparisonController {

    private final CycleComparisonService cycleComparisonService;

    public CycleComparisonController(CycleComparisonService cycleComparisonService) {
        this.cycleComparisonService = cycleComparisonService;
    }

    @PostMapping("/add")
    public ResponseEntity<Integer> addCycleToComparison(@RequestParam Long userId, @RequestParam Long cartId) {

        return ResponseEntity.ok( cycleComparisonService.addCycleToComparison(userId, cartId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CycleComparisonResponse>> getUserComparisons(@PathVariable Long userId) {
        List<CycleComparisonResponse> comparisons = cycleComparisonService.getComparedCycles(userId);
        return ResponseEntity.ok(comparisons);
    }

    @DeleteMapping("/{comparisonId}")
    public ResponseEntity<String> deleteComparison(@PathVariable Long comparisonId) {
        cycleComparisonService.deleteComparisonById(comparisonId);
        return ResponseEntity.ok("Comparison item deleted successfully.");
    }
}

