package com.mall4j.cloud.platform.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 研发需求处理DTO
 *
 * @author mall4j
 */
public class DemandHandleDTO {

    @Schema(description = "需求ID" )
    @NotNull(message = "需求ID不能为空")
    private Long demandId;

    @Schema(description = "状态: 0-待处理 1-确认中 2-研发中 3-样品制作 4-已完成 5-已取消" )
    @NotNull(message = "需求状态不能为空")
    @Min(value = 0, message = "需求状态不正确")
    @Max(value = 5, message = "需求状态不正确")
    private Integer status;

    @Schema(description = "处理备注" )
    @Size(max = 5000, message = "处理备注不能超过5000个字符")
    private String adminRemark;

    @Schema(description = "处理人" )
    private String handlerName;

    public Long getDemandId() {
        return demandId;
    }

    public void setDemandId(Long demandId) {
        this.demandId = demandId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
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

    @Override
    public String toString() {
        return "DemandHandleDTO{" +
                "demandId=" + demandId +
                ", status=" + status +
                ", adminRemark=" + adminRemark +
                ", handlerName=" + handlerName +
                '}';
    }
}
