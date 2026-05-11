package com.mall4j.cloud.platform.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 研发需求撤回/删除DTO
 *
 * @author mall4j
 */
public class DemandWithdrawDTO {

    @Schema(description = "需求ID" )
    private Long demandId;

    @Schema(description = "提交人ID" )
    private String submitterId;

    public Long getDemandId() {
        return demandId;
    }

    public void setDemandId(Long demandId) {
        this.demandId = demandId;
    }

    public String getSubmitterId() {
        return submitterId;
    }

    public void setSubmitterId(String submitterId) {
        this.submitterId = submitterId;
    }

    @Override
    public String toString() {
        return "DemandWithdrawDTO{" +
                "demandId=" + demandId +
                ", submitterId=" + submitterId +
                '}';
    }
}
