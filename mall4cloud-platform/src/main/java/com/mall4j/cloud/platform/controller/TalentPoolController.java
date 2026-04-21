package com.mall4j.cloud.platform.controller;

import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.platform.service.TalentPoolService;
import com.mall4j.cloud.platform.vo.TalentPoolVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 人才库控制器
 *
 * @author AI Assistant
 */
@RestController
@RequestMapping({"/talent_pool", "/ua/talent_pool"})
@Tag(name = "人才库管理")
public class TalentPoolController {

    @Autowired
    private TalentPoolService talentPoolService;

    /**
     * 获取人才列表
     *
     * @param page 页码，默认1
     * @param pageSize 每页数量，默认10
     * @param name 姓名搜索关键字
     * @return 人才列表
     */
    @GetMapping("/list")
    @Operation(summary = "获取人才列表")
    public ServerResponseEntity<TalentPoolVO[]> list(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String name) {
        TalentPoolVO[] list = talentPoolService.list(page, pageSize, name);
        return ServerResponseEntity.success(list);
    }

    /**
     * 获取人才详情
     *
     * @param id 人才ID
     * @return 人才详情
     */
    @GetMapping("/detail/{id}")
    @Operation(summary = "获取人才详情")
    public ServerResponseEntity<TalentPoolVO> detail(@PathVariable Long id) {
        TalentPoolVO talent = talentPoolService.getById(id);
        return ServerResponseEntity.success(talent);
    }
}
