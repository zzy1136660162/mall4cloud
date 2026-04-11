package com.mall4j.cloud.platform.mapper;

import com.mall4j.cloud.platform.model.UserRole;
import org.apache.ibatis.annotations.Param;

/**
 * 用户角色Mapper
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
public interface UserRoleMapper {

    /**
     * 插入用户角色关联
     *
     * @param userRole 用户角色信息
     * @return 影响行数
     */
    int insert(@Param("userRole") UserRole userRole);

    /**
     * 检查用户是否有某角色
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 是否存在
     */
    boolean existsByUserIdAndRoleId(@Param("userId") Long userId, @Param("roleId") Long roleId);
}
