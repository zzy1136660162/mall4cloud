package com.mall4j.cloud.platform.controller.admin;

import com.mall4j.cloud.api.auth.bo.UserInfoInTokenBO;
import com.mall4j.cloud.common.database.vo.PageVO;
import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.common.security.AuthUserContext;
import com.mall4j.cloud.platform.dto.DemandHandleDTO;
import com.mall4j.cloud.platform.dto.DemandPageDTO;
import com.mall4j.cloud.platform.dto.DemandSubmitDTO;
import com.mall4j.cloud.platform.dto.DemandWithdrawDTO;
import com.mall4j.cloud.platform.service.DemandService;
import com.mall4j.cloud.platform.vo.DemandVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 研发需求管理
 *
 * @author mall4j
 */
@Tag(name = "研发需求管理")
@RestController
@RequestMapping("/demand")
public class DemandController {

    @Autowired
    private DemandService demandService;

    @Operation(summary = "获取需求列表")
    @GetMapping("/list")
    public ServerResponseEntity<List<DemandVO>> list() {
        List<DemandVO> list = demandService.list();
        return ServerResponseEntity.success(list);
    }

    @Operation(summary = "分页查询需求")
    @GetMapping("/page")
    public ServerResponseEntity<PageVO<DemandVO>> page(@ModelAttribute DemandPageDTO demand) {
        PageVO<DemandVO> page = demandService.page(demand);
        return ServerResponseEntity.success(page);
    }

    @Operation(summary = "获取需求详情")
    @GetMapping("/detail/{id}")
    public ServerResponseEntity<DemandVO> detail(@PathVariable Long id) {
        DemandVO demand = demandService.getById(id);
        return ServerResponseEntity.success(demand);
    }

    @Operation(summary = "提交需求")
    @PostMapping("/submit")
    public ServerResponseEntity<Long> submit(@RequestBody @Valid DemandSubmitDTO demandSubmitDTO) {
        UserInfoInTokenBO userInfoInToken = AuthUserContext.get();
        demandSubmitDTO.setSubmitterId(String.valueOf(userInfoInToken.getUserId()));
        Long demandId = demandService.submit(demandSubmitDTO);
        return ServerResponseEntity.success(demandId);
    }

    @Operation(summary = "处理需求")
    @PostMapping("/handle")
    public ServerResponseEntity<Void> handle(@RequestBody @Valid DemandHandleDTO demandHandleDTO) {
        demandService.handle(demandHandleDTO);
        return ServerResponseEntity.success();
    }

    @Operation(summary = "撤回需求")
    @PostMapping("/withdraw")
    public ServerResponseEntity<Void> withdraw(@RequestBody DemandWithdrawDTO params) {
        demandService.withdraw(params.getDemandId(), params.getSubmitterId());
        return ServerResponseEntity.success();
    }

    @Operation(summary = "重新申请")
    @PostMapping("/reapply")
    public ServerResponseEntity<Void> reapply(@RequestBody DemandWithdrawDTO params) {
        demandService.reapply(params.getDemandId(), params.getSubmitterId());
        return ServerResponseEntity.success();
    }

    @Operation(summary = "删除需求")
    @PostMapping("/delete")
    public ServerResponseEntity<Void> delete(@RequestBody DemandWithdrawDTO params) {
        demandService.delete(params.getDemandId(), params.getSubmitterId());
        return ServerResponseEntity.success();
    }

    @Operation(summary = "根据提交人获取需求列表")
    @GetMapping("/submitter/list")
    public ServerResponseEntity<List<DemandVO>> listBySubmitter(@RequestParam String submitterId) {
        List<DemandVO> list = demandService.listBySubmitterId(submitterId);
        return ServerResponseEntity.success(list);
    }
}
