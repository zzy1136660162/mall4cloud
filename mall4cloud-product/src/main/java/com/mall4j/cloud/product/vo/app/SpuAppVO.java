package com.mall4j.cloud.product.vo.app;

import tools.jackson.databind.annotation.JsonSerialize;
import com.mall4j.cloud.api.product.vo.SpuAttrValueVO;
import com.mall4j.cloud.common.serializer.ImgJsonSerializer;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.util.List;

/**
 * spu信息VO
 *
 * @author FrozenWatermelon
 * @date 2020-10-28 15:27:24
 */
public class SpuAppVO {
	private static final long serialVersionUID = 1L;

	@Schema(description = "spu id" )
	private Long spuId;

	@Schema(description = "店铺id" )
	private Long shopId;

	@Schema(description = "spu名称" )
	private String name;

	@Schema(description = "卖点" )
	private String sellingPoint;

	@JsonSerialize(using = ImgJsonSerializer.class)
	@Schema(description = "商品介绍主图" )
	private String mainImgUrl;

	@JsonSerialize(using = ImgJsonSerializer.class)
	@Schema(description = "商品介绍主图 多个图片逗号分隔" )
	private String imgUrls;

	@Schema(description = "售价，整数方式保存" )
	private Long priceFee;

	@Schema(description = "市场价，整数方式保存" )
	private Long marketPriceFee;

	@Schema(description = "商品详情" )
	private String detail;

	@Schema(description = "总库存" )
	private Integer totalStock;

	@Schema(description = "规格属性" )
	private List<SpuAttrValueVO> spuAttrValues;

	@Schema(description = "sku列表" )
	private List<SkuAppVO> skus;

	@Schema(description = "商品销量" )
	private Integer saleNum;

	@Schema(description = "是否选品 0-否 1-是" )
	private Integer isSelection;

	@Schema(description = "佣金比例（%）" )
	private BigDecimal commissionRate;

	@Schema(description = "预计佣金金额" )
	private BigDecimal commissionAmount;

	@Schema(description = "是否热销 0-否 1-是" )
	private Integer isHot;

	@Schema(description = "是否新品 0-否 1-是" )
	private Integer isNew;

	@Schema(description = "是否推荐 0-否 1-是" )
	private Integer isRecommend;

	@Schema(description = "是否精选 0-否 1-是" )
	private Integer isSelectionBest;

	@Schema(description = "推荐评分 0.0-5.0" )
	private BigDecimal rating;

	@Schema(description = "累计销量" )
	private Integer totalSales;

	@Schema(description = "月销量" )
	private Integer monthSales;

	public String getMainImgUrl() {
		return mainImgUrl;
	}

	public void setMainImgUrl(String mainImgUrl) {
		this.mainImgUrl = mainImgUrl;
	}

	public List<SkuAppVO> getSkus() {
		return skus;
	}

	public void setSkus(List<SkuAppVO> skus) {
		this.skus = skus;
	}

	public List<SpuAttrValueVO> getSpuAttrValues() {
		return spuAttrValues;
	}

	public void setSpuAttrValues(List<SpuAttrValueVO> spuAttrValues) {
		this.spuAttrValues = spuAttrValues;
	}

	public Integer getTotalStock() {
		return totalStock;
	}

	public void setTotalStock(Integer totalStock) {
		this.totalStock = totalStock;
	}

	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	public Long getSpuId() {
		return spuId;
	}

	public void setSpuId(Long spuId) {
		this.spuId = spuId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getImgUrls() {
		return imgUrls;
	}

	public void setImgUrls(String imgUrls) {
		this.imgUrls = imgUrls;
	}

	public Long getPriceFee() {
		return priceFee;
	}

	public void setPriceFee(Long priceFee) {
		this.priceFee = priceFee;
	}

	public Long getMarketPriceFee() {
		return marketPriceFee;
	}

	public void setMarketPriceFee(Long marketPriceFee) {
		this.marketPriceFee = marketPriceFee;
	}

	public String getSellingPoint() {
		return sellingPoint;
	}

	public void setSellingPoint(String sellingPoint) {
		this.sellingPoint = sellingPoint;
	}

	public Long getShopId() {
		return shopId;
	}

	public void setShopId(Long shopId) {
		this.shopId = shopId;
	}

	public Integer getSaleNum() {
		return saleNum;
	}

	public void setSaleNum(Integer saleNum) {
		this.saleNum = saleNum;
	}

	public Integer getIsSelection() {
		return isSelection;
	}

	public void setIsSelection(Integer isSelection) {
		this.isSelection = isSelection;
	}

	public BigDecimal getCommissionRate() {
		return commissionRate;
	}

	public void setCommissionRate(BigDecimal commissionRate) {
		this.commissionRate = commissionRate;
	}

	public BigDecimal getCommissionAmount() {
		return commissionAmount;
	}

	public void setCommissionAmount(BigDecimal commissionAmount) {
		this.commissionAmount = commissionAmount;
	}

	public Integer getIsHot() {
		return isHot;
	}

	public void setIsHot(Integer isHot) {
		this.isHot = isHot;
	}

	public Integer getIsNew() {
		return isNew;
	}

	public void setIsNew(Integer isNew) {
		this.isNew = isNew;
	}

	public Integer getIsRecommend() {
		return isRecommend;
	}

	public void setIsRecommend(Integer isRecommend) {
		this.isRecommend = isRecommend;
	}

	public Integer getIsSelectionBest() {
		return isSelectionBest;
	}

	public void setIsSelectionBest(Integer isSelectionBest) {
		this.isSelectionBest = isSelectionBest;
	}

	public BigDecimal getRating() {
		return rating;
	}

	public void setRating(BigDecimal rating) {
		this.rating = rating;
	}

	public Integer getTotalSales() {
		return totalSales;
	}

	public void setTotalSales(Integer totalSales) {
		this.totalSales = totalSales;
	}

	public Integer getMonthSales() {
		return monthSales;
	}

	public void setMonthSales(Integer monthSales) {
		this.monthSales = monthSales;
	}

	@Override
	public String toString() {
		return "SpuVO{" +
				"spuId=" + spuId +
				", name='" + name + '\'' +
				", sellingPoint='" + sellingPoint + '\'' +
				", mainImgUrl='" + mainImgUrl + '\'' +
				", imgUrls='" + imgUrls + '\'' +
				", priceFee=" + priceFee +
				", marketPriceFee=" + marketPriceFee +
				", detail='" + detail + '\'' +
				", totalStock=" + totalStock +
				", spuAttrValues=" + spuAttrValues +
				", skus=" + skus +
				", saleNum=" + saleNum +
				'}';
	}
}
