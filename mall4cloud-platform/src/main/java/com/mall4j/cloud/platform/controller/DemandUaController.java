package com.mall4j.cloud.platform.controller;

import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.platform.dto.DemandSubmitDTO;
import com.mall4j.cloud.platform.service.DemandService;
import com.mall4j.cloud.platform.vo.DemandSubmitResultVO;
import com.mall4j.cloud.platform.vo.DemandVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 研发需求免登录接口
 *
 * @author mall4j
 */
@Tag(name = "研发需求免登录接口")
@RestController
@RequestMapping("/ua/demand")
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
}
