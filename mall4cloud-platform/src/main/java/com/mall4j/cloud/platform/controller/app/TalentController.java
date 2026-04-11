package com.mall4j.cloud.platform.controller.app;

import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.platform.service.TalentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 达人控制器
 * 用户申请成为达人
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
@RestController
@RequestMapping("/app/talent")
@Tag(name = "APP端-达人管理")
public class TalentController {

    @Autowired
    private TalentService talentService;

    /**
     * 申请成为达人（自动通过）
     */
    @PostMapping("/apply")
    @Operation(summary = "申请成为达人（自动通过）")
    public ServerResponseEntity<Void> applyToBeTalent() {
        talentService.applyToBeTalent();
        return ServerResponseEntity.success();
    }

    /**
     * 检查用户是否为达人
     */
    @PostMapping("/check")
    @Operation(summary = "检查用户是否为达人")
    public ServerResponseEntity<Boolean> checkTalentStatus() {
        boolean isTalent = talentService.checkTalentStatus();
        return ServerResponseEntity.success(isTalent);
    }
}
