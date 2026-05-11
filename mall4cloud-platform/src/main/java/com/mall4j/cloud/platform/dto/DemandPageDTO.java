package com.mall4j.cloud.platform.dto;

import com.mall4j.cloud.common.database.dto.PageDTO;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 研发需求分页查询DTO
 *
 * @author mall4j
 */
public class DemandPageDTO extends PageDTO {

    @Schema(description = "需求标题" )
    private String title;

    @Schema(description = "状态: 0-待处理 1-确认中 2-研发中 3-样品制作 4-已完成 5-已取消" )
    private Integer status;

    @Schema(description = "提交人ID" )
    private String submitterId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getSubmitterId() {
        return submitterId;
    }

    public void setSubmitterId(String submitterId) {
        this.submitterId = submitterId;
    }
}