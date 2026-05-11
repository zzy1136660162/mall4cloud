package com.mall4j.cloud.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;

/**
 * 达人申请DTO
 *
 * @author AI Assistant
 */
@Schema(description = "达人申请DTO")
public class TalentApplyDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "真实姓名")
    private String realName;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "省份")
    private String province;

    @Schema(description = "城市")
    private String city;

    @Schema(description = "区域")
    private String area;

    @Schema(description = "申请理由")
    private String applyReason;

    @Schema(description = "个人简介")
    private String intro;

    @Schema(description = "希望公司提供的支持")
    private String supportExpect;

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getApplyReason() {
        return applyReason;
    }

    public void setApplyReason(String applyReason) {
        this.applyReason = applyReason;
    }

    public String getIntro() {
        return intro;
    }

    public void setIntro(String intro) {
        this.intro = intro;
    }

    public String getSupportExpect() {
        return supportExpect;
    }

    public void setSupportExpect(String supportExpect) {
        this.supportExpect = supportExpect;
    }
}
