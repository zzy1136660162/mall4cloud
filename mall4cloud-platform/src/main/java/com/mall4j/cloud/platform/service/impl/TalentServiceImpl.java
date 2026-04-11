package com.mall4j.cloud.platform.service.impl;

import com.mall4j.cloud.common.exception.Mall4cloudException;
import com.mall4j.cloud.platform.mapper.UserRoleMapper;
import com.mall4j.cloud.platform.model.UserRole;
import com.mall4j.cloud.platform.service.TalentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 达人服务实现
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
@Service
public class TalentServiceImpl implements TalentService {

    /**
     * 达人角色ID
     */
    private static final Long TALENT_ROLE_ID = 100L;

    @Autowired
    private UserRoleMapper userRoleMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void applyToBeTalent() {
        Long userId = getUserId();
        
        // 检查是否已是达人
        if (checkTalentStatus()) {
            throw new Mall4cloudException("您已经是达人了");
        }
        
        // 在user_role表增加达人角色记录
        UserRole userRole = new UserRole();
        userRole.setUserId(userId);
        userRole.setRoleId(TALENT_ROLE_ID);
        userRoleMapper.insert(userRole);
    }

    @Override
    public boolean checkTalentStatus() {
        Long userId = getUserId();
        return userRoleMapper.existsByUserIdAndRoleId(userId, TALENT_ROLE_ID);
    }

    private Long getUserId() {
        // 实际从上下文获取用户ID
        // 这里简化处理，返回1L
        return 1L;
    }
}
