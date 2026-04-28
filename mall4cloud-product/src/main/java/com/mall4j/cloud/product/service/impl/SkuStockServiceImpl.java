package com.mall4j.cloud.product.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.mall4j.cloud.product.dto.SkuDTO;
import com.mall4j.cloud.product.mapper.SkuMapper;
import com.mall4j.cloud.product.mapper.SkuStockMapper;
import com.mall4j.cloud.product.model.SkuStock;
import com.mall4j.cloud.product.service.SkuStockService;
import com.mall4j.cloud.product.service.SpuExtensionService;
import com.mall4j.cloud.product.vo.SkuStockVO;
import com.mall4j.cloud.api.product.vo.SkuVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * 库存信息
 *
 * @author FrozenWatermelon
 * @date 2020-10-28 15:27:24
 */
@Service
public class SkuStockServiceImpl implements SkuStockService {

    @Autowired
    private SkuStockMapper skuStockMapper;

    @Autowired
    private SkuMapper skuMapper;

    @Autowired
    private SpuExtensionService spuExtensionService;

    @Override
    public void save(SkuStock skuStock) {
        skuStockMapper.save(skuStock);
        // 同步SPU库存
        syncSpuStockBySkuId(skuStock.getSkuId());
    }

    @Override
    public void update(SkuStock skuStock) {
        skuStockMapper.update(skuStock);
        // 同步SPU库存
        syncSpuStockBySkuId(skuStock.getSkuId());
    }

    @Override
    public void deleteById(Long stockId) {
        // 先获取skuId以便后续同步
        // 注意：这里假设stockId可以关联到skuId，但实际情况可能需要查询
        // 由于stockId和skuId的关系不明确，暂时不处理
        skuStockMapper.deleteById(stockId);
    }

    @Override
    public void saveBatch(List<SkuStock> skuStocks) {
        if (CollUtil.isEmpty(skuStocks)) {
            return;
        }
        skuStockMapper.saveBatch(skuStocks);
        // 收集需要同步的spuId
        Set<Long> spuIdSet = new HashSet<>();
        for (SkuStock skuStock : skuStocks) {
            SkuVO skuVO = skuMapper.getSkuBySkuId(skuStock.getSkuId());
            if (skuVO != null && skuVO.getSpuId() != null) {
                spuIdSet.add(skuVO.getSpuId());
            }
        }
        // 同步SPU库存
        for (Long spuId : spuIdSet) {
            syncSpuStock(spuId);
        }
    }

    @Override
    public void deleteBySkuIds(List<Long> skuIds) {
        if (CollUtil.isEmpty(skuIds)) {
            return;
        }
        // 收集需要同步的spuId
        Set<Long> spuIdSet = new HashSet<>();
        for (Long skuId : skuIds) {
            SkuVO skuVO = skuMapper.getSkuBySkuId(skuId);
            if (skuVO != null && skuVO.getSpuId() != null) {
                spuIdSet.add(skuVO.getSpuId());
            }
        }
        skuStockMapper.deleteBySkuIds(skuIds);
        // 同步SPU库存
        for (Long spuId : spuIdSet) {
            syncSpuStock(spuId);
        }
    }

    @Override
    public List<SkuStockVO> listBySkuList(List<SkuVO> skuVOList) {
        return skuStockMapper.listBySkuList(skuVOList);
    }

    @Override
    public void updateBatch(List<SkuDTO> skuList) {
        if (CollUtil.isEmpty(skuList)) {
            return;
        }
        // 收集需要同步SPU库存的spuId集合
        Set<Long> spuIdSet = new HashSet<>();
        // 如果是修改库存，此时不需要改变锁定库存
        List<SkuStock> skuStocks = new ArrayList<>();
        for (SkuDTO sku : skuList) {
            SkuStock skuStock = new SkuStock();
            if (Objects.nonNull(sku.getChangeStock()) && sku.getChangeStock() > 0) {
                skuStock.setStock(sku.getChangeStock());
                skuStock.setSkuId(sku.getSkuId());
                skuStocks.add(skuStock);
                // 获取spuId
                SkuVO skuVO = skuMapper.getSkuBySkuId(sku.getSkuId());
                if (skuVO != null && skuVO.getSpuId() != null) {
                    spuIdSet.add(skuVO.getSpuId());
                }
            }
        }
        if (CollUtil.isNotEmpty(skuStocks)) {
            skuStockMapper.updateStock(skuStocks);
        }
        // 同步SPU库存
        for (Long spuId : spuIdSet) {
            syncSpuStock(spuId);
        }
    }

    /**
     * 根据skuId同步SPU库存
     *
     * @param skuId SKU ID
     */
    private void syncSpuStockBySkuId(Long skuId) {
        if (skuId == null) {
            return;
        }
        SkuVO skuVO = skuMapper.getSkuBySkuId(skuId);
        if (skuVO != null && skuVO.getSpuId() != null) {
            syncSpuStock(skuVO.getSpuId());
        }
    }

    /**
     * 同步SPU库存
     * 计算该SPU下所有SKU的库存总和，更新到spu_extension表
     *
     * @param spuId SPU ID
     */
    private void syncSpuStock(Long spuId) {
        if (spuId == null) {
            return;
        }
        // 查询该SPU下所有SKU的库存总和
        Integer totalStock = skuStockMapper.getTotalStockBySpuId(spuId);
        if (totalStock == null) {
            totalStock = 0;
        }
        // 更新SPU库存
        spuExtensionService.setStock(spuId, totalStock);
    }

    @Override
    public void syncSpuStockBySpuId(Long spuId) {
        syncSpuStock(spuId);
    }
}
