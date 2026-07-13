package com.mall4j.cloud.platform.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * 研发需求提交DTO
 *
 * @author mall4j
 */
public class DemandSubmitDTO {

    @Schema(description = "主键ID" )
    private Long id;

    @Schema(description = "需求标题" )
    @NotBlank(message = "项目/产品名称不能为空")
    @Size(max = 200, message = "项目/产品名称不能超过200个字符")
    private String title;

    @Schema(description = "功能诉求" )
    @NotBlank(message = "研发目标与功能诉求不能为空")
    @Size(max = 5000, message = "研发目标与功能诉求不能超过5000个字符")
    private String functionalAppeal;

    @Schema(description = "产品品类: 1-体表健康产品 2-功能性食品" )
    @NotNull(message = "产品品类不能为空")
    @Min(value = 1, message = "产品品类不正确")
    @Max(value = 2, message = "产品品类不正确")
    private Integer productCategory;

    @Schema(description = "期望服务类型(JSON数组)" )
    @NotBlank(message = "期望服务类型不能为空")
    @Pattern(regexp = "^\\s*\\[\\s*\"[1-5]\"(?:\\s*,\\s*\"[1-5]\")*\\s*]\\s*$", message = "期望服务类型格式不正确")
    private String serviceType;

    @Schema(description = "期望对接领域" )
    @Size(max = 100, message = "期望对接领域不能超过100个字符")
    private String expertiseField;

    @Schema(description = "目标人群" )
    @NotBlank(message = "目标用户/应用场景不能为空")
    @Size(max = 200, message = "目标用户/应用场景不能超过200个字符")
    private String targetAudience;

    @Schema(description = "剂型偏好" )
    @Size(max = 100, message = "产品形态偏好不能超过100个字符")
    private String dosageFormPreference;

    @Schema(description = "预算范围" )
    @NotBlank(message = "预算范围不能为空")
    @Size(max = 50, message = "预算范围不能超过50个字符")
    private String budgetRange;

    @Schema(description = "期望交付时间" )
    @NotBlank(message = "期望交付时间不能为空")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "期望交付时间格式应为yyyy-MM-dd")
    private String expectedDeliveryTime;

    @Schema(description = "备注" )
    @Size(max = 5000, message = "补充说明不能超过5000个字符")
    private String remark;

    @Schema(description = "提交人ID" )
    private String submitterId;

    @Schema(description = "提交人姓名" )
    @NotBlank(message = "联系人不能为空")
    @Size(max = 50, message = "联系人不能超过50个字符")
    private String submitterName;

    @Schema(description = "提交人电话" )
    @NotBlank(message = "联系电话不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "请输入正确的11位手机号")
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

    public Integer getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(Integer productCategory) {
        this.productCategory = productCategory;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getExpertiseField() {
        return expertiseField;
    }

    public void setExpertiseField(String expertiseField) {
        this.expertiseField = expertiseField;
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
                ", productCategory=" + productCategory +
                ", serviceType=" + serviceType +
                ", expertiseField=" + expertiseField +
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
