package com.mall4j.cloud.platform.controller;

import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.platform.dto.DemandSubmitDTO;
import com.mall4j.cloud.platform.service.DemandService;
import com.mall4j.cloud.platform.vo.DemandSubmitResultVO;
import com.mall4j.cloud.platform.vo.DemandVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 研发需求免登录接口
 *
 * @author mall4j
 */
@Tag(name = "研发需求免登录接口")
@RestController
@RequestMapping("/ua/demand")
@Validated
public class DemandUaController {

    @Autowired
    private DemandService demandService;

    @Operation(summary = "免登录提交研发需求")
    @PostMapping("/submit")
    public ServerResponseEntity<DemandSubmitResultVO> submit(@RequestBody @Valid DemandSubmitDTO demandSubmitDTO) {
        Long demandId = demandService.submit(demandSubmitDTO);
        DemandVO demandVO = demandService.getById(demandId);
        DemandSubmitResultVO result = new DemandSubmitResultVO();
        result.setId(demandId);
        result.setDemandNo(demandVO != null ? demandVO.getDemandNo() : null);
        return ServerResponseEntity.success(result);
    }

    @Operation(summary = "免登录查询研发需求")
    @GetMapping("/query")
    public ServerResponseEntity<DemandVO> query(
            @RequestParam
            @NotBlank(message = "需求编号不能为空")
            @Size(max = 50, message = "需求编号格式不正确") String demandNo,
            @RequestParam
            @Pattern(regexp = "^1[3-9]\\d{9}$", message = "请输入正确的11位手机号") String submitterPhone) {
        return ServerResponseEntity.success(demandService.getByDemandNoAndPhone(demandNo, submitterPhone));
    }
}
