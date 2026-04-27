package com.mall4j.cloud.platform.service.impl;

import com.mall4j.cloud.platform.mapper.TalentPoolMapper;
import com.mall4j.cloud.platform.service.TalentPoolService;
import com.mall4j.cloud.platform.vo.TalentPoolVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 人才库服务实现
 *
 * @author AI Assistant
 */
@Service
public class TalentPoolServiceImpl implements TalentPoolService {

    @Autowired
    private TalentPoolMapper talentPoolMapper;

    @Override
    public TalentPoolVO[] list(Integer page, Integer pageSize, String name) {
        if (page == null || page < 1) {
            page = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }

        int offset = (page - 1) * pageSize;
        List<TalentPoolVO> talentList = talentPoolMapper.page(offset, pageSize, name);

        if (talentList == null) {
            return new TalentPoolVO[0];
        }

        return talentList.toArray(new TalentPoolVO[0]);
    }

    @Override
    public TalentPoolVO getById(Long id) {
        if (id == null) {
            return null;
        }
        return talentPoolMapper.getById(id);
    }
}
