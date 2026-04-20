package com.mall4j.cloud.user.controller.app;

import com.mall4j.cloud.api.auth.bo.UserInfoInTokenBO;
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

        userService.updateTalentApply(user);

        return ServerResponseEntity.success();
    }
}
