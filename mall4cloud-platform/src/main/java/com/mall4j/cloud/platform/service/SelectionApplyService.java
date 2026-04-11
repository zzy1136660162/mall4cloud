package com.mall4j.cloud.platform.service;

import com.mall4j.cloud.common.database.vo.PageVO;
import com.mall4j.cloud.platform.dto.SelectionApplyDTO;
import com.mall4j.cloud.platform.dto.SelectionApplyPageDTO;
import com.mall4j.cloud.platform.dto.SelectionAuditDTO;
import com.mall4j.cloud.platform.vo.admin.SelectionApplyVO;
import com.mall4j.cloud.platform.vo.admin.SelectionStatisticsVO;

/**
 * 选品申请服务接口
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
public interface SelectionApplyService {

    /**
     * 申请选品商品
     *
     * @param dto 申请信息
     * @return 申请ID
     */
    Long applySelection(SelectionApplyDTO dto);

    /**
     * 获取我的选品申请列表
     *
     * @param pageNum  页码
     * @param pageSize 每页数量
     * @return 申请列表
     */
    PageVO<SelectionApplyVO> getMyApplies(Integer pageNum, Integer pageSize);

    /**
     * 获取选品申请详情
     *
     * @param applyId 申请ID
     * @return 申请详情
     */
    SelectionApplyVO getApplyDetail(Long applyId);

    /**
     * 获取选品申请列表（管理端）
     *
     * @param pageDTO 查询条件
     * @return 申请列表
     */
    PageVO<SelectionApplyVO> getApplyList(SelectionApplyPageDTO pageDTO);

    /**
     * 审核选品申请
     *
     * @param applyId 申请ID
     * @param dto     审核信息
     */
    void auditSelection(Long applyId, SelectionAuditDTO dto);

    /**
     * 填写物流信息
     *
     * @param applyId        申请ID
     * @param expressCompany 快递公司
     * @param expressNo      快递单号
     */
    void fillLogistics(Long applyId, String expressCompany, String expressNo);

    /**
     * 获取选品统计数据
     *
     * @return 统计数据
     */
    SelectionStatisticsVO getStatistics();
}
