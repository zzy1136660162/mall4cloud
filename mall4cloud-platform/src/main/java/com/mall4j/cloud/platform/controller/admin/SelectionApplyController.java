package com.mall4j.cloud.platform.controller.admin;

import com.mall4j.cloud.common.database.vo.PageVO;
import com.mall4j.cloud.platform.vo.admin.SelectionStatisticsVO;
import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.platform.dto.SelectionApplyPageDTO;
import com.mall4j.cloud.platform.dto.SelectionAuditDTO;
import com.mall4j.cloud.platform.service.SelectionApplyService;
import com.mall4j.cloud.platform.vo.admin.SelectionApplyVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 管理端选品申请控制器
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
@RestController
@RequestMapping("/admin/selection")
@Tag(name = "管理端-选品申请管理")
public class SelectionApplyController {

    @Autowired
    private SelectionApplyService selectionApplyService;

    /**
     * 获取选品申请列表
     */
    @GetMapping("/applies")
    @Operation(summary = "获取选品申请列表")
    public ServerResponseEntity<PageVO<SelectionApplyVO>> getApplyList(SelectionApplyPageDTO pageDTO) {
        PageVO<SelectionApplyVO> page = selectionApplyService.getApplyList(pageDTO);
        return ServerResponseEntity.success(page);
    }

    /**
     * 审核选品申请
     */
    @PutMapping("/audit/{applyId}")
    @Operation(summary = "审核选品申请")
    public ServerResponseEntity<Void> auditSelection(
            @Parameter(description = "申请ID") @PathVariable Long applyId,
            @Valid @RequestBody SelectionAuditDTO dto) {
        selectionApplyService.auditSelection(applyId, dto);
        return ServerResponseEntity.success();
    }

    /**
     * 填写物流信息
     */
    @PutMapping("/ship/{applyId}")
    @Operation(summary = "填写物流信息")
    public ServerResponseEntity<Void> fillLogistics(
            @Parameter(description = "申请ID") @PathVariable Long applyId,
            @Parameter(description = "快递公司") @RequestParam String expressCompany,
            @Parameter(description = "快递单号") @RequestParam String expressNo) {
        selectionApplyService.fillLogistics(applyId, expressCompany, expressNo);
        return ServerResponseEntity.success();
    }

    /**
     * 获取选品统计数据
     */
    @GetMapping("/statistics")
    @Operation(summary = "获取选品统计数据")
    public ServerResponseEntity<SelectionStatisticsVO> getStatistics() {
        SelectionStatisticsVO statistics = selectionApplyService.getStatistics();
        return ServerResponseEntity.success(statistics);
    }
}
