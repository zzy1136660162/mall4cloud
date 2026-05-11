package com.mall4j.cloud.api.product.vo;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 店铺信息VO（简化版）
 *
 * @author FrozenWatermelon
 * @date 2020/11/16
 */
@Schema(description = "店铺信息VO（简化版）")
public class ShopInfoVO {

	@Schema(description = "店铺ID")
	private Long shopId;

	@Schema(description = "店铺名称")
	private String shopName;

	@Schema(description = "店铺Logo")
	private String shopLogo;

	@Schema(description = "店铺类型")
	private Integer type;

	public Long getShopId() {
		return shopId;
	}

	public void setShopId(Long shopId) {
		this.shopId = shopId;
	}

	public String getShopName() {
		return shopName;
	}

	public void setShopName(String shopName) {
		this.shopName = shopName;
	}

	public String getShopLogo() {
		return shopLogo;
	}

	public void setShopLogo(String shopLogo) {
		this.shopLogo = shopLogo;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return "ShopInfoVO{" +
				"shopId=" + shopId +
				", shopName='" + shopName + '\'' +
				", shopLogo='" + shopLogo + '\'' +
				", type=" + type +
				'}';
	}
}
