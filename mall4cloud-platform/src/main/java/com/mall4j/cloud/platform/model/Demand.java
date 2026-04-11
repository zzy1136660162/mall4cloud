package com.mall4j.cloud.platform.model;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

import com.mall4j.cloud.common.model.BaseModel;

/**
 * 研发需求表
 *
 * @author mall4j
 */
public class Demand extends BaseModel implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 需求编号
     */
    private String demandNo;

    /**
     * 需求标题
     */
    private String title;

    /**
     * 功能诉求
     */
    private String functionalAppeal;

    /**
     * 目标人群
     */
    private String targetAudience;

    /**
     * 剂型偏好
     */
    private String dosageFormPreference;

    /**
     * 预算范围
     */
    private String budgetRange;

    /**
     * 期望交付时间
     */
    private Date expectedDeliveryTime;

    /**
     * 备注
     */
    private String remark;

    /**
     * 提交人ID
     */
    private String submitterId;

    /**
     * 提交人姓名
     */
    private String submitterName;

    /**
     * 提交人电话
     */
    private String submitterPhone;

    /**
     * 状态: 0-待处理 1-确认中 2-研发中 3-样品制作 4-已完成 5-已取消
     */
    private Integer status;

    /**
     * 状态文本
     */
    private String statusText;

    /**
     * 处理备注
     */
    private String adminRemark;

    /**
     * 处理人
     */
    private String handlerName;

    /**
     * 提交时间
     */
    private Date submitTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 创建时间
     */
    private Date createTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDemandNo() {
        return demandNo;
    }

    public void setDemandNo(String demandNo) {
        this.demandNo = demandNo;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFunctionalAppeal() {
        return functionalAppeal;
    }

    public void setFunctionalAppeal(String functionalAppeal) {
        this.functionalAppeal = functionalAppeal;
    }

    public String getTargetAudience() {
        return targetAudience;
    }

    public void setTargetAudience(String targetAudience) {
        this.targetAudience = targetAudience;
    }

    public String getDosageFormPreference() {
        return dosageFormPreference;
    }

    public void setDosageFormPreference(String dosageFormPreference) {
        this.dosageFormPreference = dosageFormPreference;
    }

    public String getBudgetRange() {
        return budgetRange;
    }

    public void setBudgetRange(String budgetRange) {
        this.budgetRange = budgetRange;
    }

    public Date getExpectedDeliveryTime() {
        return expectedDeliveryTime;
    }

    public void setExpectedDeliveryTime(Date expectedDeliveryTime) {
        this.expectedDeliveryTime = expectedDeliveryTime;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getSubmitterId() {
        return submitterId;
    }

    public void setSubmitterId(String submitterId) {
        this.submitterId = submitterId;
    }

    public String getSubmitterName() {
        return submitterName;
    }

    public void setSubmitterName(String submitterName) {
        this.submitterName = submitterName;
    }

    public String getSubmitterPhone() {
        return submitterPhone;
    }

    public void setSubmitterPhone(String submitterPhone) {
        this.submitterPhone = submitterPhone;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getStatusText() {
        return statusText;
    }

    public void setStatusText(String statusText) {
        this.statusText = statusText;
    }

    public String getAdminRemark() {
        return adminRemark;
    }

    public void setAdminRemark(String adminRemark) {
        this.adminRemark = adminRemark;
    }

    public String getHandlerName() {
        return handlerName;
    }

    public void setHandlerName(String handlerName) {
        this.handlerName = handlerName;
    }

    public Date getSubmitTime() {
        return submitTime;
    }

    public void setSubmitTime(Date submitTime) {
        this.submitTime = submitTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    @Override
    public String toString() {
        return "Demand{" +
                "id=" + id +
                ", demandNo=" + demandNo +
                ", title=" + title +
                ", functionalAppeal=" + functionalAppeal +
                ", targetAudience=" + targetAudience +
                ", dosageFormPreference=" + dosageFormPreference +
                ", budgetRange=" + budgetRange +
                ", expectedDeliveryTime=" + expectedDeliveryTime +
                ", remark=" + remark +
                ", submitterId=" + submitterId +
                ", submitterName=" + submitterName +
                ", submitterPhone=" + submitterPhone +
                ", status=" + status +
                ", statusText=" + statusText +
                ", adminRemark=" + adminRemark +
                ", handlerName=" + handlerName +
                ", submitTime=" + submitTime +
                ", updateTime=" + updateTime +
                ", createTime=" + createTime +
                '}';
    }
}
