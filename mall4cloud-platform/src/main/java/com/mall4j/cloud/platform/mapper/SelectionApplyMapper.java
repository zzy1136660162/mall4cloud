package com.mall4j.cloud.platform.mapper;

import com.mall4j.cloud.platform.dto.SelectionApplyPageDTO;
import com.mall4j.cloud.platform.model.SelectionApply;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 选品申请Mapper
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
public interface SelectionApplyMapper {

    /**
     * 插入选品申请记录
     *
     * @param selectionApply 选品申请信息
     * @return 影响行数
     */
    int insert(@Param("selectionApply") SelectionApply selectionApply);

    /**
     * 更新选品申请记录
     *
     * @param selectionApply 选品申请信息
     * @return 影响行数
     */
    int update(@Param("selectionApply") SelectionApply selectionApply);

    /**
     * 根据ID查询选品申请记录
     *
     * @param applyId 申请ID
     * @return 选品申请信息
     */
    SelectionApply getById(@Param("applyId") Long applyId);

    /**
     * 分页查询选品申请列表
     *
     * @param pageDTO 查询条件
     * @return 选品申请列表
     */
    List<SelectionApply> listByPage(@Param("pageDTO") SelectionApplyPageDTO pageDTO);

    /**
     * 统计选品申请数量
     *
     * @param pageDTO 查询条件
     * @return 数量
     */
    int count(@Param("pageDTO") SelectionApplyPageDTO pageDTO);

    /**
     * 检查用户是否对某商品有有效的申请
     *
     * @param userId 用户ID
     * @param spuId  商品ID
     * @return 申请记录
     */
    SelectionApply checkUserApply(@Param("userId") Long userId, @Param("spuId") Long spuId);

    /**
     * 根据用户ID查询申请列表
     *
     * @param userId   用户ID
     * @param pageNum  页码
     * @param pageSize 每页数量
     * @return 申请列表
     */
    List<SelectionApply> listByUserId(@Param("userId") Long userId,
                                      @Param("pageNum") Integer pageNum,
                                      @Param("pageSize") Integer pageSize);

    /**
     * 统计用户申请数量
     *
     * @param userId 用户ID
     * @return 数量
     */
    int countByUserId(@Param("userId") Long userId);
}
