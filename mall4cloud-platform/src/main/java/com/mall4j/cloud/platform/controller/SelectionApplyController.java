package com.mall4j.cloud.platform.controller;

import com.mall4j.cloud.common.database.vo.PageVO;
import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.platform.dto.SelectionApplyDTO;
import com.mall4j.cloud.platform.dto.SelectionApplyPageDTO;
import com.mall4j.cloud.platform.dto.SelectionAuditDTO;
import com.mall4j.cloud.platform.service.SelectionApplyService;
import com.mall4j.cloud.platform.vo.SelectionApplyVO;
import com.mall4j.cloud.platform.vo.SelectionStatisticsVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 选品申请控制器
 * 包含APP端和管理端的所有接口
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
@RestController
@Tag(name = "选品申请管理")
public class SelectionApplyController {

    @Autowired
    private SelectionApplyService selectionApplyService;

    // ==================== APP端接口 ====================

    /**
     * 申请选品商品（APP端）
     */
    @PostMapping("/app/selection/apply")
    @Operation(summary = "申请选品商品")
    public ServerResponseEntity<Long> applySelection(@Valid @RequestBody SelectionApplyDTO dto) {
        Long applyId = selectionApplyService.applySelection(dto);
        return ServerResponseEntity.success(applyId);
    }

    /**
     * 获取我的申请列表（APP端）
     */
    @GetMapping("/app/selection/my-applies")
    @Operation(summary = "获取我的选品申请列表")
    public ServerResponseEntity<PageVO<SelectionApplyVO>> getMyApplies(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") Integer pageSize) {
        PageVO<SelectionApplyVO> page = selectionApplyService.getMyApplies(pageNum, pageSize);
        return ServerResponseEntity.success(page);
    }

    /**
     * 获取申请详情（APP端）
     */
    @GetMapping("/app/selection/detail/{applyId}")
    @Operation(summary = "获取选品申请详情")
    public ServerResponseEntity<SelectionApplyVO> getApplyDetail(
            @Parameter(description = "申请ID") @PathVariable Long applyId) {
        SelectionApplyVO detail = selectionApplyService.getApplyDetail(applyId);
        return ServerResponseEntity.success(detail);
    }

    // ==================== 管理端接口 ====================

    /**
     * 获取申请列表（管理端）
     */
    @GetMapping("/admin/selection/list")
    @Operation(summary = "获取选品申请列表")
    public ServerResponseEntity<PageVO<SelectionApplyVO>> getApplyList(SelectionApplyPageDTO pageDTO) {
        PageVO<SelectionApplyVO> page = selectionApplyService.getApplyList(pageDTO);
        return ServerResponseEntity.success(page);
    }

    /**
     * 审核申请（管理端）
     */
    @PutMapping("/admin/selection/audit/{applyId}")
    @Operation(summary = "审核选品申请")
    public ServerResponseEntity<Void> auditSelection(
            @Parameter(description = "申请ID") @PathVariable Long applyId,
            @Valid @RequestBody SelectionAuditDTO dto) {
        selectionApplyService.auditSelection(applyId, dto);
        return ServerResponseEntity.success();
    }

    /**
     * 填写物流信息（管理端）
     */
    @PutMapping("/admin/selection/ship/{applyId}")
    @Operation(summary = "填写物流信息")
    public ServerResponseEntity<Void> fillLogistics(
            @Parameter(description = "申请ID") @PathVariable Long applyId,
            @Parameter(description = "快递公司") @RequestParam String expressCompany,
            @Parameter(description = "快递单号") @RequestParam String expressNo) {
        selectionApplyService.fillLogistics(applyId, expressCompany, expressNo);
        return ServerResponseEntity.success();
    }

    /**
     * 获取统计数据（管理端）
     */
    @GetMapping("/admin/selection/statistics")
    @Operation(summary = "获取选品统计数据")
    public ServerResponseEntity<SelectionStatisticsVO> getStatistics() {
        SelectionStatisticsVO statistics = selectionApplyService.getStatistics();
        return ServerResponseEntity.success(statistics);
    }
}
