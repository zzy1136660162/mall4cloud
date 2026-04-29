package com.mall4j.cloud.api.product.vo;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * 商品搜索分页结果VO
 *
 * @author FrozenWatermelon
 * @date 2020/11/16
 */
@Schema(description = "商品搜索分页结果VO")
public class SpuSearchPageVO {

	@Schema(description = "商品列表")
	private List<SpuVO> spus;

	@Schema(description = "品牌聚合列表")
	private List<BrandVO> brands;

	@Schema(description = "分类聚合列表")
	private List<CategoryVO> categorys;

	@Schema(description = "属性聚合列表")
	private List<AttrVO> attrs;

	@Schema(description = "店铺信息")
	private ShopInfoVO shopInfo;

	public List<SpuVO> getSpus() {
		return spus;
	}

	public void setSpus(List<SpuVO> spus) {
		this.spus = spus;
	}

	public List<BrandVO> getBrands() {
		return brands;
	}

	public void setBrands(List<BrandVO> brands) {
		this.brands = brands;
	}

	public List<CategoryVO> getCategorys() {
		return categorys;
	}

	public void setCategorys(List<CategoryVO> categorys) {
		this.categorys = categorys;
	}

	public List<AttrVO> getAttrs() {
		return attrs;
	}

	public void setAttrs(List<AttrVO> attrs) {
		this.attrs = attrs;
	}

	public ShopInfoVO getShopInfo() {
		return shopInfo;
	}

	public void setShopInfo(ShopInfoVO shopInfo) {
		this.shopInfo = shopInfo;
	}

	@Override
	public String toString() {
		return "SpuSearchPageVO{" +
				"spus=" + spus +
				", brands=" + brands +
				", categorys=" + categorys +
				", attrs=" + attrs +
				", shopInfo=" + shopInfo +
				'}';
	}
}
