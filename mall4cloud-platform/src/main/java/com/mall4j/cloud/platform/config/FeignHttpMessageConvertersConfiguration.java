package com.mall4j.cloud.platform.config;

import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.cloud.openfeign.FeignClientFactory;
import org.springframework.cloud.openfeign.support.FeignHttpMessageConverters;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Initializes Feign response converters before concurrent HTTP requests arrive.
 */
@Configuration(proxyBeanMethods = false)
public class FeignHttpMessageConvertersConfiguration {

    @Bean
    public SmartInitializingSingleton feignHttpMessageConvertersWarmer(
            FeignClientFactory feignClientFactory) {
        return () -> feignClientFactory.getContextNames().forEach(contextName -> {
            FeignHttpMessageConverters converters = feignClientFactory.getInstance(
                    contextName, FeignHttpMessageConverters.class);
            if (converters != null) {
                converters.getConverters();
            }
        });
    }
}
