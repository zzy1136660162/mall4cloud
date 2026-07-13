package com.mall4j.cloud.platform.controller.admin;

import com.mall4j.cloud.api.auth.bo.UserInfoInTokenBO;
import com.mall4j.cloud.api.auth.constant.SysTypeEnum;
import com.mall4j.cloud.common.database.vo.PageVO;
import com.mall4j.cloud.common.exception.Mall4cloudException;
import com.mall4j.cloud.common.response.ResponseEnum;
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
import java.util.Objects;

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

    private UserInfoInTokenBO currentUser() {
        UserInfoInTokenBO user = AuthUserContext.get();
        if (user == null || user.getUserId() == null) {
            throw new Mall4cloudException(ResponseEnum.UNAUTHORIZED);
        }
        return user;
    }

    private UserInfoInTokenBO requireManagementUser() {
        UserInfoInTokenBO user = currentUser();
        boolean platform = Objects.equals(SysTypeEnum.PLATFORM.value(), user.getSysType());
        boolean multishop = Objects.equals(SysTypeEnum.MULTISHOP.value(), user.getSysType());
        if (!platform && !multishop) {
            throw new Mall4cloudException(ResponseEnum.UNAUTHORIZED);
        }
        return user;
    }

    @Operation(summary = "获取需求列表")
    @GetMapping("/list")
    public ServerResponseEntity<List<DemandVO>> list() {
        requireManagementUser();
        List<DemandVO> list = demandService.list();
        return ServerResponseEntity.success(list);
    }

    @Operation(summary = "分页查询需求")
    @GetMapping("/page")
    public ServerResponseEntity<PageVO<DemandVO>> page(@ModelAttribute DemandPageDTO demand) {
        requireManagementUser();
        PageVO<DemandVO> page = demandService.page(demand);
        return ServerResponseEntity.success(page);
    }

    @Operation(summary = "获取需求详情")
    @GetMapping("/detail/{id}")
    public ServerResponseEntity<DemandVO> detail(@PathVariable Long id) {
        requireManagementUser();
        DemandVO demand = demandService.getById(id);
        return ServerResponseEntity.success(demand);
    }

    @Operation(summary = "提交需求")
    @PostMapping("/submit")
    public ServerResponseEntity<Long> submit(@RequestBody @Valid DemandSubmitDTO demandSubmitDTO) {
        UserInfoInTokenBO userInfoInToken = currentUser();
        demandSubmitDTO.setSubmitterId(String.valueOf(userInfoInToken.getUserId()));
        Long demandId = demandService.submit(demandSubmitDTO);
        return ServerResponseEntity.success(demandId);
    }

    @Operation(summary = "处理需求")
    @PostMapping("/handle")
    public ServerResponseEntity<Void> handle(@RequestBody @Valid DemandHandleDTO demandHandleDTO) {
        UserInfoInTokenBO user = requireManagementUser();
        demandHandleDTO.setHandlerName("操作员#" + user.getUserId());
        demandService.handle(demandHandleDTO);
        return ServerResponseEntity.success();
    }

    @Operation(summary = "撤回需求")
    @PostMapping("/withdraw")
    public ServerResponseEntity<Void> withdraw(@RequestBody @Valid DemandWithdrawDTO params) {
        demandService.withdraw(params.getDemandId(), String.valueOf(currentUser().getUserId()));
        return ServerResponseEntity.success();
    }

    @Operation(summary = "重新申请")
    @PostMapping("/reapply")
    public ServerResponseEntity<Void> reapply(@RequestBody @Valid DemandWithdrawDTO params) {
        demandService.reapply(params.getDemandId(), String.valueOf(currentUser().getUserId()));
        return ServerResponseEntity.success();
    }

    @Operation(summary = "删除需求")
    @PostMapping("/delete")
    public ServerResponseEntity<Void> delete(@RequestBody @Valid DemandWithdrawDTO params) {
        demandService.delete(params.getDemandId(), String.valueOf(currentUser().getUserId()));
        return ServerResponseEntity.success();
    }

    @Operation(summary = "根据提交人获取需求列表")
    @GetMapping("/submitter/list")
    public ServerResponseEntity<List<DemandVO>> listBySubmitter(@RequestParam(required = false) String submitterId) {
        UserInfoInTokenBO user = currentUser();
        boolean management = Objects.equals(SysTypeEnum.PLATFORM.value(), user.getSysType())
                || Objects.equals(SysTypeEnum.MULTISHOP.value(), user.getSysType());
        if (management && (submitterId == null || submitterId.isBlank())) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "提交人ID不能为空");
        }
        String querySubmitterId = management ? submitterId.trim() : String.valueOf(user.getUserId());
        List<DemandVO> list = demandService.listBySubmitterId(querySubmitterId);
        return ServerResponseEntity.success(list);
    }
}
