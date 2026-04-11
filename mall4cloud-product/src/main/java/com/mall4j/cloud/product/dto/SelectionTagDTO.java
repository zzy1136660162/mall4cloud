package com.mall4j.cloud.product.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serializable;
import java.util.List;

/**
 * 选品标签DTO
 * 用于批量设置商品标签
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
public class SelectionTagDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "商品ID列表")
    private List<Long> spuIds;

    @Schema(description = "是否热销 0-否 1-是")
    private Integer isHot;

    @Schema(description = "是否新品 0-否 1-是")
    private Integer isNew;

    @Schema(description = "是否推荐 0-否 1-是")
    private Integer isRecommend;

    @Schema(description = "是否精选 0-否 1-是")
    private Integer isSelectionBest;

    public List<Long> getSpuIds() {
        return spuIds;
    }

    public void setSpuIds(List<Long> spuIds) {
        this.spuIds = spuIds;
    }

    public Integer getIsHot() {
        return isHot;
    }

    public void setIsHot(Integer isHot) {
        this.isHot = isHot;
    }

    public Integer getIsNew() {
        return isNew;
    }

    public void setIsNew(Integer isNew) {
        this.isNew = isNew;
    }

    public Integer getIsRecommend() {
        return isRecommend;
    }

    public void setIsRecommend(Integer isRecommend) {
        this.isRecommend = isRecommend;
    }

    public Integer getIsSelectionBest() {
        return isSelectionBest;
    }

    public void setIsSelectionBest(Integer isSelectionBest) {
        this.isSelectionBest = isSelectionBest;
    }

    @Override
    public String toString() {
        return "SelectionTagDTO{" +
                "spuIds=" + spuIds +
                ", isHot=" + isHot +
                ", isNew=" + isNew +
                ", isRecommend=" + isRecommend +
                ", isSelectionBest=" + isSelectionBest +
                '}';
    }
}
