package com.mall4j.cloud.platform.vo;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 选品申请统计数据VO
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
@Schema(description = "选品申请统计数据VO")
public class SelectionStatisticsVO {

    @Schema(description = "总申请数")
    private Integer totalApplies;

    @Schema(description = "待审核数")
    private Integer pendingApplies;

    @Schema(description = "已通过数")
    private Integer approvedApplies;

    @Schema(description = "已拒绝数")
    private Integer rejectedApplies;

    @Schema(description = "今日新增数")
    private Integer todayApplies;

    public Integer getTotalApplies() {
        return totalApplies;
    }

    public void setTotalApplies(Integer totalApplies) {
        this.totalApplies = totalApplies;
    }

    public Integer getPendingApplies() {
        return pendingApplies;
    }

    public void setPendingApplies(Integer pendingApplies) {
        this.pendingApplies = pendingApplies;
    }

    public Integer getApprovedApplies() {
        return approvedApplies;
    }

    public void setApprovedApplies(Integer approvedApplies) {
        this.approvedApplies = approvedApplies;
    }

    public Integer getRejectedApplies() {
        return rejectedApplies;
    }

    public void setRejectedApplies(Integer rejectedApplies) {
        this.rejectedApplies = rejectedApplies;
    }

    public Integer getTodayApplies() {
        return todayApplies;
    }

    public void setTodayApplies(Integer todayApplies) {
        this.todayApplies = todayApplies;
    }

    @Override
    public String toString() {
        return "SelectionStatisticsVO{" +
                "totalApplies=" + totalApplies +
                ", pendingApplies=" + pendingApplies +
                ", approvedApplies=" + approvedApplies +
                ", rejectedApplies=" + rejectedApplies +
                ", todayApplies=" + todayApplies +
                '}';
    }
}
