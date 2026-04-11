package com.mall4j.cloud.platform.service;

/**
 * 达人服务接口
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
public interface TalentService {

    /**
     * 申请成为达人（自动通过）
     */
    void applyToBeTalent();

    /**
     * 检查用户是否为达人
     *
     * @return 是否为达人
     */
    boolean checkTalentStatus();
}
