package com.mall4j.cloud.platform.model;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

import com.mall4j.cloud.common.model.BaseModel;

/**
 * 选品申请表（也是选品记录表）
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
public class SelectionApply extends BaseModel implements Serializable {
    
    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 申请ID
     */
    private Long applyId;

    /**
     * 申请人用户ID
     */
    private Long userId;

    /**
     * 申请人姓名
     */
    private String userName;

    /**
     * 联系电话
     */
    private String contactPhone;

    /**
     * 邮寄地址
     */
    private String deliveryAddress;

    /**
     * 商品SPU ID
     */
    private Long spuId;

    /**
     * 商品名称（冗余）
     */
    private String spuName;

    /**
     * 店铺ID
     */
    private Long shopId;

    /**
     * 店铺名称（冗余）
     */
    private String shopName;

    /**
     * 商品主图（冗余）
     */
    private String mainImgUrl;

    /**
     * 商品价格（分）（冗余）
     */
    private Long priceFee;

    /**
     * 申请备注/理由
     */
    private String applyRemark;

    /**
     * 申请时间
     */
    private Date applyTime;

    /**
     * 审核状态 1-待审核 2-已通过 3-已拒绝
     */
    private Integer auditStatus;

    /**
     * 审核时间
     */
    private Date auditTime;

    /**
     * 审核人ID
     */
    private Long auditUserId;

    /**
     * 审核备注
     */
    private String auditRemark;

    /**
     * 快递公司
     */
    private String expressCompany;

    /**
     * 快递单号
     */
    private String expressNo;

    /**
     * 发货时间
     */
    private Date shipTime;

    // Getter and Setter methods

    public Long getApplyId() {
        return applyId;
    }

    public void setApplyId(Long applyId) {
        this.applyId = applyId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getApplyRemark() {
        return applyRemark;
    }

    public void setApplyRemark(String applyRemark) {
        this.applyRemark = applyRemark;
    }

    public Date getApplyTime() {
        return applyTime;
    }

    public void setApplyTime(Date applyTime) {
        this.applyTime = applyTime;
    }

    public Integer getAuditStatus() {
        return auditStatus;
    }

    public void setAuditStatus(Integer auditStatus) {
        this.auditStatus = auditStatus;
    }

    public Date getAuditTime() {
        return auditTime;
    }

    public void setAuditTime(Date auditTime) {
        this.auditTime = auditTime;
    }

    public Long getAuditUserId() {
        return auditUserId;
    }

    public void setAuditUserId(Long auditUserId) {
        this.auditUserId = auditUserId;
    }

    public String getAuditRemark() {
        return auditRemark;
    }

    public void setAuditRemark(String auditRemark) {
        this.auditRemark = auditRemark;
    }

    public String getExpressCompany() {
        return expressCompany;
    }

    public void setExpressCompany(String expressCompany) {
        this.expressCompany = expressCompany;
    }

    public String getExpressNo() {
        return expressNo;
    }

    public void setExpressNo(String expressNo) {
        this.expressNo = expressNo;
    }

    public Date getShipTime() {
        return shipTime;
    }

    public void setShipTime(Date shipTime) {
        this.shipTime = shipTime;
    }

    @Override
    public String toString() {
        return "SelectionApply{" +
                "applyId=" + applyId +
                ", userId=" + userId +
                ", userName='" + userName + '\'' +
                ", contactPhone='" + contactPhone + '\'' +
                ", deliveryAddress='" + deliveryAddress + '\'' +
                ", spuId=" + spuId +
                ", spuName='" + spuName + '\'' +
                ", shopId=" + shopId +
                ", shopName='" + shopName + '\'' +
                ", mainImgUrl='" + mainImgUrl + '\'' +
                ", priceFee=" + priceFee +
                ", applyRemark='" + applyRemark + '\'' +
                ", applyTime=" + applyTime +
                ", auditStatus=" + auditStatus +
                ", auditTime=" + auditTime +
                ", auditUserId=" + auditUserId +
                ", auditRemark='" + auditRemark + '\'' +
                ", expressCompany='" + expressCompany + '\'' +
                ", expressNo='" + expressNo + '\'' +
                ", shipTime=" + shipTime +
                '}';
    }
}
