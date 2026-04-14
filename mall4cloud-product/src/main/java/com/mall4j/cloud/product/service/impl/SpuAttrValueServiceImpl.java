package com.mall4j.cloud.product.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.mall4j.cloud.common.cache.constant.CacheNames;
import com.mall4j.cloud.common.cache.util.RedisUtil;
import com.mall4j.cloud.product.mapper.SpuAttrValueMapper;
import com.mall4j.cloud.product.mapper.SpuMapper;
import com.mall4j.cloud.product.model.SpuAttrValue;
import com.mall4j.cloud.product.service.SpuAttrValueService;
import com.mall4j.cloud.api.product.vo.SpuAttrValueVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 商品规格属性关联信息
 *
 * @author FrozenWatermelon
 * @date 2020-10-28 15:27:24
 */
@Service
public class SpuAttrValueServiceImpl implements SpuAttrValueService {

    @Autowired
    private SpuAttrValueMapper spuAttrValueMapper;
    @Autowired
    private SpuMapper spuMapper;

    @Override
    public void update(Long spuId, List<SpuAttrValue> spuAttrValues, List<SpuAttrValueVO> spuAttrValuesDb) {
        // 基于 attrId 建立 Map，方便快速查找
        Map<Long, SpuAttrValueVO> dbAttrValueMap = spuAttrValuesDb.stream()
                .collect(Collectors.toMap(SpuAttrValueVO::getAttrId, v -> v, (v1, v2) -> v1));
        Set<Long> dbAttrIds = dbAttrValueMap.keySet();

        List<SpuAttrValue> updateList = new ArrayList<>();
        List<SpuAttrValue> saveList = new ArrayList<>();
        Set<Long> handledAttrIds = new java.util.HashSet<>();

        for (SpuAttrValue spuAttrValue : spuAttrValues) {
            Long attrId = spuAttrValue.getAttrId();
            if (attrId == null) {
                continue;
            }
            handledAttrIds.add(attrId);

            if (dbAttrIds.contains(attrId)) {
                // 数据库已存在该 attrId，更新
                SpuAttrValueVO dbRecord = dbAttrValueMap.get(attrId);
                spuAttrValue.setSpuAttrValueId(dbRecord.getSpuAttrValueId());
                spuAttrValue.setSpuId(spuId);
                updateList.add(spuAttrValue);
            } else {
                // 数据库不存在，新增
                spuAttrValue.setSpuId(spuId);
                saveList.add(spuAttrValue);
            }
        }

        // 保存新增的关联属性
        if (CollUtil.isNotEmpty(saveList)) {
            saveBatch(spuId, saveList);
        }
        // 更新属性
        if (CollUtil.isNotEmpty(updateList)) {
            spuAttrValueMapper.updateBatch(updateList);
        }
        // 删除不再使用的属性（数据库有但前端没提交的）
        List<Long> toDeleteIds = spuAttrValuesDb.stream()
                .map(SpuAttrValueVO::getAttrId)
                .filter(attrId -> !handledAttrIds.contains(attrId))
                .map(dbAttrValueMap::get)
                .map(SpuAttrValueVO::getSpuAttrValueId)
                .collect(Collectors.toList());
        if (CollUtil.isNotEmpty(toDeleteIds)) {
            spuAttrValueMapper.deleteBatch(toDeleteIds);
        }
    }

    @Override
    public void saveBatch(Long spuId, List<SpuAttrValue> spuAttrValues) {
        if (CollUtil.isEmpty(spuAttrValues)) {
            return;
        }
        for (SpuAttrValue spuAttrValue : spuAttrValues) {
            spuAttrValue.setSpuId(spuId);
        }
        spuAttrValueMapper.saveBatch(spuAttrValues);
    }

    @Override
    public void deleteBySpuId(Long spuId) {
        spuAttrValueMapper.deleteBySpuId(spuId);
    }

    @Override
    public void deleteByAttIdAndCategoryIds(Long attrId, List<Long> attrValueId, List<Long> categoryIds) {
        if (CollUtil.isEmpty(attrValueId) && CollUtil.isEmpty(categoryIds) ) {
            return;
        }
        updateSpu(attrValueId, categoryIds);
        spuAttrValueMapper.deleteByAttIdAndCategoryIds(attrId, attrValueId, categoryIds);
    }

    @Override
    public List<SpuAttrValueVO> getSpuAttrsBySpuId(Long spuId) {
        return spuAttrValueMapper.getSpuAttrsBySpuId(spuId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchUpdateSpuAttrValue(List<SpuAttrValue> spuAttrValues) {
        spuAttrValueMapper.batchUpdateSpuAttrValue(spuAttrValues);
        List<Long> attrValueIds = spuAttrValues.stream().map(SpuAttrValue::getAttrValueId).collect(Collectors.toList());
        updateSpu(attrValueIds, null);
    }


    private void updateSpu(List<Long> attrValueIds, List<Long> categoryIds) {
        List<Long> spuIds = null;
        if (CollUtil.isNotEmpty(attrValueIds)) {
            spuIds = spuAttrValueMapper.getShopIdByAttrValueIds(attrValueIds);
            spuMapper.updateSpuUpdateTime(spuIds, null);
        } else if (CollUtil.isNotEmpty(categoryIds)) {
            spuIds = spuMapper.getSpuIdsBySpuUpdateDTO(null, categoryIds, null, null);
            spuMapper.updateSpuUpdateTime(null, categoryIds);
        }
        if (CollUtil.isEmpty(spuIds)) {
            return ;
        }
        RedisUtil.deleteBatch(CacheNames.SPU_KEY, spuIds);
        RedisUtil.deleteBatch(CacheNames.SPU_EXTENSION_KEY, spuIds);
    }
}
