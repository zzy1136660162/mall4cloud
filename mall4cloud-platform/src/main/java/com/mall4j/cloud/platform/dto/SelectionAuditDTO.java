package com.mall4j.cloud.platform.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * 选品审核DTO
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
public class SelectionAuditDTO implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @NotNull(message = "审核状态不能为空")
    @Min(value = 2, message = "审核状态只能为2-通过或3-拒绝")
    @Max(value = 3, message = "审核状态只能为2-通过或3-拒绝")
    @Schema(description = "审核状态 2-通过 3-拒绝")
    private Integer auditStatus;

    @Schema(description = "审核备注")
    private String auditRemark;

    public Integer getAuditStatus() {
        return auditStatus;
    }

    public void setAuditStatus(Integer auditStatus) {
        this.auditStatus = auditStatus;
    }

    public String getAuditRemark() {
        return auditRemark;
    }

    public void setAuditRemark(String auditRemark) {
        this.auditRemark = auditRemark;
    }

    @Override
    public String toString() {
        return "SelectionAuditDTO{" +
                "auditStatus=" + auditStatus +
                ", auditRemark='" + auditRemark + '\'' +
                '}';
    }
}
