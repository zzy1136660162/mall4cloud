package com.mall4j.cloud.product.controller.app;

import com.mall4j.cloud.api.product.vo.SpuVO;
import com.mall4j.cloud.common.constant.StatusEnum;
import com.mall4j.cloud.common.database.dto.PageDTO;
import com.mall4j.cloud.common.database.vo.PageVO;
import com.mall4j.cloud.common.response.ResponseEnum;
import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.product.dto.SpuPageSearchDTO;
import com.mall4j.cloud.product.model.SpuExtension;
import com.mall4j.cloud.product.service.SkuService;
import com.mall4j.cloud.product.service.SpuService;
import com.mall4j.cloud.product.vo.app.SkuAppVO;
import com.mall4j.cloud.product.vo.app.SpuAppVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Operation;
import com.mall4j.cloud.common.util.BeanUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * spu信息
 *
 * @author FrozenWatermelon
 * @date 2020-10-28 15:27:24
 */
@RestController("appSpuController")
@RequestMapping("/ua/spu")
@Tag(name = "app-spu信息")
public class SpuController {

    @Autowired
    private SpuService spuService;

    @Autowired
    private SkuService skuService;

    @GetMapping("/page")
    @Operation(summary = "选品商品分页列表", description = "分页获取移动端选品商品列表")
    public ServerResponseEntity<PageVO<SpuVO>> page(PageDTO pageDTO, SpuPageSearchDTO spuDTO) {
        spuDTO.setStatus(StatusEnum.ENABLE.value());
        PageVO<SpuVO> spuPage = spuService.page(pageDTO, spuDTO);
        if (spuPage.getList() != null) {
            for (SpuVO spu : spuPage.getList()) {
                spu.setCommissionAmount(calculateCommissionAmount(spu.getPriceFee(), spu.getCommissionRate()));
            }
        }
        return ServerResponseEntity.success(spuPage);
    }

    @GetMapping("/detail/{spuId}")
    @Operation(summary = "选品商品详情", description = "根据商品ID获取移动端选品商品详情")
    public ServerResponseEntity<SpuAppVO> detail(@PathVariable Long spuId) {
        return prodInfo(spuId);
    }

    @GetMapping("/prod_info")
    @Operation(summary = "商品详情信息" , description = "根据商品ID（prodId）获取商品信息")
    @Parameter(name = "spuId", description = "商品ID" , required = true)
    public ServerResponseEntity<SpuAppVO> prodInfo(@RequestParam("spuId") Long spuId) {

        SpuVO spu = spuService.getBySpuId(spuId);
        if (spu == null) {
            return ServerResponseEntity.fail(ResponseEnum.SPU_NOT_EXIST);
        }
        SpuAppVO spuAppVO = BeanUtil.map(spu, SpuAppVO.class);
        spuAppVO.setCommissionAmount(calculateCommissionAmount(spu.getPriceFee(), spu.getCommissionRate()));
        SpuExtension spuExtension = spuService.getSpuExtension(spuId);
        if (spuExtension != null) {
            spuAppVO.setTotalStock(spuExtension.getActualStock());
            spuAppVO.setSaleNum(spuExtension.getSaleNum());
        } else {
            spuAppVO.setTotalStock(0);
            spuAppVO.setSaleNum(0);
        }
        List<SkuAppVO> skuAppVO = skuService.getSkuBySpuId(spu.getSpuId());
        spuAppVO.setSkus(skuAppVO);
        return ServerResponseEntity.success(spuAppVO);
    }

    private BigDecimal calculateCommissionAmount(Long priceFee, BigDecimal commissionRate) {
        if (priceFee == null || commissionRate == null) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(priceFee)
                .multiply(commissionRate)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
}
