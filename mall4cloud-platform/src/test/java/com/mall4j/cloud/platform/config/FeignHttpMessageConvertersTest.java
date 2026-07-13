package com.mall4j.cloud.platform.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.openfeign.FeignClientFactory;
import org.springframework.cloud.openfeign.support.FeignHttpMessageConverters;
import org.springframework.context.ApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
        "spring.cloud.nacos.discovery.enabled=false",
        "spring.cloud.nacos.config.enabled=false",
        "spring.config.import="
})
class FeignHttpMessageConvertersTest {

    @Autowired
    private FeignClientFactory feignClientFactory;

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void shouldProvideConverterForFeignResponses() {
        assertThat(applicationContext.containsBean("feignHttpMessageConvertersWarmer")).isTrue();

        FeignHttpMessageConverters converters = feignClientFactory.getInstance(
                "token", FeignHttpMessageConverters.class);

        assertThat(converters).isNotNull();
        assertThat(converters.getConverters()).isNotEmpty();
    }
}
