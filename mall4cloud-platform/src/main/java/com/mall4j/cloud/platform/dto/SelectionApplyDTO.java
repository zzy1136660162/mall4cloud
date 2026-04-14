package com.mall4j.cloud.platform.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * 选品申请DTO
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
public class SelectionApplyDTO implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @NotNull(message = "商品ID不能为空")
    @Schema(description = "商品SPU ID")
    private Long spuId;

    @Schema(description = "商品名称（冗余）")
    private String spuName;

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "店铺名称（冗余）")
    private String shopName;

    @Schema(description = "商品主图（冗余）")
    private String mainImgUrl;

    @Schema(description = "商品价格（分）（冗余）")
    private Long priceFee;

    @NotBlank(message = "联系人姓名不能为空")
    @Schema(description = "联系人姓名")
    private String userName;

    @NotBlank(message = "联系电话不能为空")
    @Schema(description = "联系电话")
    private String contactPhone;

    @NotBlank(message = "邮寄地址不能为空")
    @Schema(description = "邮寄地址")
    private String deliveryAddress;

    @Schema(description = "申请备注")
    private String applyRemark;

    public String getContactName() {
        return userName;
    }

    public void setContactName(String contactName) {
        this.userName = contactName;
    }

    public String getRemark() {
        return applyRemark;
    }

    public void setRemark(String remark) {
        this.applyRemark = remark;
    }

    public Long getSpuId() {
        return spuId;
    }

    public void setSpuId(Long spuId) {
        this.spuId = spuId;
    }

    public String getSpuName() {
        return spuName;
    }

    public void setSpuName(String spuName) {
        this.spuName = spuName;
    }

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

    public String getMainImgUrl() {
        return mainImgUrl;
    }

    public void setMainImgUrl(String mainImgUrl) {
        this.mainImgUrl = mainImgUrl;
    }

    public Long getPriceFee() {
        return priceFee;
    }

    public void setPriceFee(Long priceFee) {
        this.priceFee = priceFee;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getApplyRemark() {
        return applyRemark;
    }

    public void setApplyRemark(String applyRemark) {
        this.applyRemark = applyRemark;
    }

    @Override
    public String toString() {
        return "SelectionApplyDTO{" +
                "spuId=" + spuId +
                ", spuName='" + spuName + '\'' +
                ", shopId=" + shopId +
                ", shopName='" + shopName + '\'' +
                ", userName='" + userName + '\'' +
                ", contactPhone='" + contactPhone + '\'' +
                ", deliveryAddress='" + deliveryAddress + '\'' +
                ", applyRemark='" + applyRemark + '\'' +
                '}';
    }
}
