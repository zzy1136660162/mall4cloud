package com.mall4j.cloud.auth.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ConfigPrint {

    @Value("${spring.datasource.url:未读取到}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:未读取到}")
    private String datasourceUsername;

    @PostConstruct
    public void print() {
        System.out.println("spring.datasource.url = " + datasourceUrl);
        System.out.println("spring.datasource.username = " + datasourceUsername);
    }
}