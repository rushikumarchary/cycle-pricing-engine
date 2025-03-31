package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.dto.CartResponse;
import com.itrosys.cycle_engine.dto.CycleComparisonResponse;
import com.itrosys.cycle_engine.entity.CycleComparison;
import com.itrosys.cycle_engine.service.CycleComparisonService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

