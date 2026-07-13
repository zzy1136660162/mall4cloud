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
        pageSize = Math.min(pageSize, 100);
        name = name == null ? null : name.trim();
        if (name != null && name.length() > 50) {
            name = name.substring(0, 50);
        }

        long offsetValue = ((long) page - 1L) * pageSize;
        if (offsetValue > Integer.MAX_VALUE) {
            return new TalentPoolVO[0];
        }
        int offset = (int) offsetValue;
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
