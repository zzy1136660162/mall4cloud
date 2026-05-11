package com.mall4j.cloud.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.support.ConfigurableConversionService;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 配置全局类型转换器，处理字符串 "null" 转换为 Long 的情况
 * 
 * @author FrozenWatermelon
 * @date 2020/09/22
 */
@Configuration
public class StringToLongConverterConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToLongConverter());
    }

    /**
     * 将字符串转换为 Long，处理 "null" 字符串
     */
    public static class StringToLongConverter implements Converter<String, Long> {
        @Override
        public Long convert(String source) {
            if (source == null || "null".equals(source) || "".equals(source)) {
                return null;
            }
            try {
                return Long.parseLong(source);
            } catch (NumberFormatException e) {
                return null;
            }
        }
    }
}
