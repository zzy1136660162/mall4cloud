package com.mall4j.cloud.api.product.feign;

import com.mall4j.cloud.api.product.vo.SpuVO;
import com.mall4j.cloud.common.feign.FeignInsideAuthConfig;
import com.mall4j.cloud.common.response.ServerResponseEntity;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * 商品SPU Feign接口
 *
 * @author FrozenWatermelon
 * @date 2020/11/16
 */
@FeignClient(value = "mall4cloud-product", contextId = "productSpu")
public interface ProductSpuFeignClient {

	/**
	 * 根据店铺ID列表获取商品列表
	 * @param shopIds 店铺ID列表
	 * @param size 每个店铺取的商品数量
	 * @return 商品列表
	 */
	@GetMapping(value = FeignInsideAuthConfig.FEIGN_INSIDE_URL_PREFIX + "/insider/spu/listByShopIds")
	ServerResponseEntity<List<SpuVO>> listByShopIds(@RequestParam("shopIds") List<Long> shopIds,
	                                                @RequestParam("size") Integer size);
}
