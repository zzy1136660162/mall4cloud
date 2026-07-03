package com.mall4j.cloud.platform.vo;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 研发需求提交结果VO
 *
 * @author mall4j
 */
public class DemandSubmitResultVO {

    @Schema(description = "需求ID")
    private Long id;

    @Schema(description = "需求编号")
    private String demandNo;

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

    @Override
    public String toString() {
        return "DemandSubmitResultVO{" +
                "id=" + id +
                ", demandNo='" + demandNo + '\'' +
                '}';
    }
}
