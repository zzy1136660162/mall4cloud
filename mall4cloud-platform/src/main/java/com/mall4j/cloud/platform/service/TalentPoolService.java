package com.mall4j.cloud.platform.service;

import com.mall4j.cloud.platform.vo.TalentPoolVO;

/**
 * 人才库服务接口
 *
 * @author AI Assistant
 */
public interface TalentPoolService {

    /**
     * 获取人才列表
     *
     * @param page 页码
     * @param pageSize 每页数量
     * @param name 姓名搜索关键字
     * @return 人才列表
     */
    TalentPoolVO[] list(Integer page, Integer pageSize, String name);

    /**
     * 获取人才详情
     *
     * @param id 人才ID
     * @return 人才详情
     */
    TalentPoolVO getById(Long id);
}
