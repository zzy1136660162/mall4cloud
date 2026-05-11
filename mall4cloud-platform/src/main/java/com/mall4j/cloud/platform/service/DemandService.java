package com.mall4j.cloud.platform.service;

import com.mall4j.cloud.platform.dto.DemandHandleDTO;
import com.mall4j.cloud.platform.dto.DemandPageDTO;
import com.mall4j.cloud.platform.dto.DemandSubmitDTO;
import com.mall4j.cloud.platform.vo.DemandVO;
import com.mall4j.cloud.common.database.vo.PageVO;

import java.util.List;

/**
 * 研发需求Service
 *
 * @author mall4j
 */
public interface DemandService {

    /**
     * 获取需求列表
     * @return 需求列表
     */
    List<DemandVO> list();

    /**
     * 分页查询需求
     * @param demand 查询参数
     * @return 分页结果
     */
    PageVO<DemandVO> page(DemandPageDTO demand);

    /**
     * 根据ID获取需求
     * @param id 需求ID
     * @return 需求详情
     */
    DemandVO getById(Long id);

    /**
     * 提交需求
     * @param demandSubmitDTO 需求信息
     * @return 需求ID
     */
    Long submit(DemandSubmitDTO demandSubmitDTO);

    /**
     * 处理需求
     * @param demandHandleDTO 处理信息
     */
    void handle(DemandHandleDTO demandHandleDTO);

    /**
     * 撤回需求
     * @param demandId 需求ID
     * @param submitterId 提交人ID
     */
    void withdraw(Long demandId, String submitterId);

    /**
     * 重新申请
     * @param demandId 需求ID
     * @param submitterId 提交人ID
     */
    void reapply(Long demandId, String submitterId);

    /**
     * 删除需求
     * @param demandId 需求ID
     * @param submitterId 提交人ID
     */
    void delete(Long demandId, String submitterId);

    /**
     * 根据提交人ID获取需求列表
     * @param submitterId 提交人ID
     * @return 需求列表
     */
    List<DemandVO> listBySubmitterId(String submitterId);
}
