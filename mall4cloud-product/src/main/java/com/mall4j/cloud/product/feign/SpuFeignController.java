package com.mall4j.cloud.product.feign;

import com.mall4j.cloud.api.product.feign.ProductSpuFeignClient;
import com.mall4j.cloud.api.product.vo.SpuVO;
import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.product.service.SpuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * SPU Feign接口实现
 *
 * @author FrozenWatermelon
 * @date 2020/11/16
 */
@RestController
public class SpuFeignController implements ProductSpuFeignClient {

    @Autowired
    private SpuService spuService;

    @Override
    public ServerResponseEntity<List<SpuVO>> listByShopIds(List<Long> shopIds, Integer size) {
        return ServerResponseEntity.success(spuService.listByShopIds(shopIds, size));
    }
}
