package com.mall4j.cloud.user.controller.app;

import com.mall4j.cloud.api.auth.bo.UserInfoInTokenBO;
import com.mall4j.cloud.api.user.vo.UserApiVO;
import com.mall4j.cloud.common.database.vo.PageVO;
import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.common.security.AuthUserContext;
import com.mall4j.cloud.user.dto.TalentApplyDTO;
import com.mall4j.cloud.user.model.User;
import com.mall4j.cloud.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * 达人申请控制器
 *
 * @author AI Assistant
 */
@RestController
@RequestMapping("/a/talent")
@Tag(name = "达人申请")
public class TalentController {

    @Autowired
    private UserService userService;

    @PostMapping("/apply")
    @Operation(summary = "达人申请")
    public ServerResponseEntity<Void> apply(@RequestBody TalentApplyDTO dto) {
        UserInfoInTokenBO userInfo = AuthUserContext.get();
        if (userInfo == null) {
            return ServerResponseEntity.showFailMsg("请先登录");
        }

        User user = new User();
        user.setUserId(userInfo.getUserId());
        user.setIsTalent(0);
        user.setTalentStatus(0);
        user.setTalentApplyTime(LocalDateTime.now());
        user.setTalentRealName(dto.getRealName());
        user.setTalentPhone(dto.getPhone());
        user.setTalentProvince(dto.getProvince());
        user.setTalentCity(dto.getCity());
        user.setTalentArea(dto.getArea());
        user.setTalentApplyReason(dto.getApplyReason());
        user.setTalentIntro(dto.getIntro());
        user.setTalentSupportExpect(dto.getSupportExpect());

        userService.updateTalentApply(user);

        return ServerResponseEntity.success();
    }

    @GetMapping("/page")
    @Operation(summary = "分页查询达人申请")
    public ServerResponseEntity<PageVO<User>> page(@RequestParam Integer page, @RequestParam Integer limit, @RequestParam(required = false) Integer talentStatus) {
        return ServerResponseEntity.success(userService.pageTalentApply(page, limit, talentStatus));
    }

    @PutMapping("/audit")
    @Operation(summary = "审核达人申请")
    public ServerResponseEntity<Void> audit(@RequestBody AuditDTO dto) {
        userService.auditTalentApply(dto.getUserId(), dto.getStatus());
        return ServerResponseEntity.success();
    }

    @GetMapping("/status")
    @Operation(summary = "获取当前用户达人状态")
    public ServerResponseEntity<TalentStatusVO> getTalentStatus() {
        UserInfoInTokenBO userInfo = AuthUserContext.get();
        if (userInfo == null) {
            return ServerResponseEntity.showFailMsg("请先登录");
        }
        
        UserApiVO user = userService.getByUserId(userInfo.getUserId());
        TalentStatusVO vo = new TalentStatusVO();
        vo.setIsTalent(user != null && user.getIsTalent() != null && user.getIsTalent() == 1);
        return ServerResponseEntity.success(vo);
    }

    public static class TalentStatusVO {
        private Boolean isTalent;
        public Boolean getIsTalent() {
            return isTalent;
        }

        public void setIsTalent(Boolean isTalent) {
            this.isTalent = isTalent;
        }
    }

    public static class AuditDTO {
        private Long userId;
        private Integer status;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Integer getStatus() {
            return status;
        }

        public void setStatus(Integer status) {
            this.status = status;
        }
    }
}
