package com.mall4j.cloud.platform.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 研发需求提交DTO
 *
 * @author mall4j
 */
public class DemandSubmitDTO {

    @Schema(description = "主键ID" )
    private Long id;

    @Schema(description = "需求标题" )
    private String title;

    @Schema(description = "功能诉求" )
    private String functionalAppeal;

    @Schema(description = "目标人群" )
    private String targetAudience;

    @Schema(description = "剂型偏好" )
    private String dosageFormPreference;

    @Schema(description = "预算范围" )
    private String budgetRange;

    @Schema(description = "期望交付时间" )
    private String expectedDeliveryTime;

    @Schema(description = "备注" )
    private String remark;

    @Schema(description = "提交人ID" )
    private String submitterId;

    @Schema(description = "提交人姓名" )
    private String submitterName;

    @Schema(description = "提交人电话" )
    private String submitterPhone;

    @Schema(description = "状态: 0-待处理 1-确认中 2-研发中 3-样品制作 4-已完成 5-已取消" )
    private Integer status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getExpectedDeliveryTime() {
        return expectedDeliveryTime;
    }

    public void setExpectedDeliveryTime(String expectedDeliveryTime) {
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

    @Override
    public String toString() {
        return "DemandSubmitDTO{" +
                "id=" + id +
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
                '}';
    }
}
