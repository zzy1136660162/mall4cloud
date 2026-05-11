package com.mall4j.cloud.platform.model;

import java.io.Serial;
import java.io.Serializable;

import com.mall4j.cloud.common.model.BaseModel;

/**
 * 用户角色关联表
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
public class UserRole extends BaseModel implements Serializable {
    
    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 角色ID
     */
    private Long roleId;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    @Override
    public String toString() {
        return "UserRole{" +
                "userId=" + userId +
                ", roleId=" + roleId +
                '}';
    }
}
