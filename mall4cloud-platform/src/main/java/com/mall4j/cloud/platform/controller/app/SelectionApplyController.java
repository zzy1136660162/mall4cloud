package com.mall4j.cloud.platform.controller.app;

import com.mall4j.cloud.common.database.vo.PageVO;
import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.platform.dto.SelectionApplyDTO;
import com.mall4j.cloud.platform.service.SelectionApplyService;
import com.mall4j.cloud.platform.vo.app.SelectionApplyVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * APP端选品申请控制器
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
@RestController
@RequestMapping("/app/selection")
@Tag(name = "APP端-选品申请")
public class SelectionApplyController {

    @Autowired
    private SelectionApplyService selectionApplyService;

    /**
     * 申请选品商品
     */
    @PostMapping("/apply")
    @Operation(summary = "申请选品商品")
    public ServerResponseEntity<Long> applySelection(@Valid @RequestBody SelectionApplyDTO dto) {
        Long applyId = selectionApplyService.applySelection(dto);
        return ServerResponseEntity.success(applyId, "申请成功，请等待审核");
    }

    /**
     * 获取我的选品申请列表
     */
    @GetMapping("/my-applies")
    @Operation(summary = "获取我的选品申请列表")
    public ServerResponseEntity<PageVO<SelectionApplyVO>> getMyApplies(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") Integer pageSize) {
        PageVO<SelectionApplyVO> page = selectionApplyService.getMyApplies(pageNum, pageSize);
        return ServerResponseEntity.success(page);
    }

    /**
     * 获取选品申请详情
     */
    @GetMapping("/detail/{applyId}")
    @Operation(summary = "获取选品申请详情")
    public ServerResponseEntity<SelectionApplyVO> getApplyDetail(
            @Parameter(description = "申请ID") @PathVariable Long applyId) {
        SelectionApplyVO detail = selectionApplyService.getApplyDetail(applyId);
        return ServerResponseEntity.success(detail);
    }
}
