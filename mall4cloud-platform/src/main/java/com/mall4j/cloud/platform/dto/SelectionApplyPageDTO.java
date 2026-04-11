package com.mall4j.cloud.platform.dto;

import com.mall4j.cloud.common.database.dto.PageDTO;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serializable;
import java.util.Date;

/**
 * 选品申请分页查询DTO
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
public class SelectionApplyPageDTO extends PageDTO implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Schema(description = "申请人用户ID")
    private Long userId;

    @Schema(description = "商品ID")
    private Long spuId;

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "审核状态 1-待审核 2-已通过 3-已拒绝")
    private Integer auditStatus;

    @Schema(description = "开始时间")
    private Date startTime;

    @Schema(description = "结束时间")
    private Date endTime;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSpuId() {
        return spuId;
    }

    public void setSpuId(Long spuId) {
        this.spuId = spuId;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public Integer getAuditStatus() {
        return auditStatus;
    }

    public void setAuditStatus(Integer auditStatus) {
        this.auditStatus = auditStatus;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    @Override
    public String toString() {
        return "SelectionApplyPageDTO{" +
                "userId=" + userId +
                ", spuId=" + spuId +
                ", shopId=" + shopId +
                ", auditStatus=" + auditStatus +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                '}';
    }
}
