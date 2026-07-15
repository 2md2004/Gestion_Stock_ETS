package com.sn.namora.backend.controller;


import com.sn.namora.backend.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class StatsController {
    private final StatsService statsService;
    @GetMapping
    public ResponseEntity<Map<String,Object>> getStats(){
        return ResponseEntity.ok(statsService.getStats());
    }
}
