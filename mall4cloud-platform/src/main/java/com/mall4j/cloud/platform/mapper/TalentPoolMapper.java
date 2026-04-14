package com.mall4j.cloud.platform.mapper;

import com.mall4j.cloud.platform.vo.TalentPoolVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 人才库 Mapper 接口
 *
 * @author AI Assistant
 */
public interface TalentPoolMapper {

    /**
     * 获取人才列表（只查询显示状态的，按排序权重倒序）
     *
     * @return 人才列表
     */
    List<TalentPoolVO> list();

    /**
     * 分页查询人才列表
     *
     * @param offset 偏移量
     * @param limit 每页数量
     * @return 人才列表
     */
    List<TalentPoolVO> page(@Param("offset") Integer offset, @Param("limit") Integer limit);

    /**
     * 获取人才总数（只统计显示状态的）
     *
     * @return 总数
     */
    Integer count();

    /**
     * 根据ID获取人才详情
     *
     * @param id 人才ID
     * @return 人才详情
     */
    TalentPoolVO getById(@Param("id") Long id);
}
