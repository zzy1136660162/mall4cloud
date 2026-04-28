package com.mall4j.cloud.user.model;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

import com.mall4j.cloud.common.model.BaseModel;

/**
 * 用户表
 *
 * @author YXF
 * @date 2020-12-08 11:18:04
 */
public class User extends BaseModel implements Serializable{
    @Serial
    private static final long serialVersionUID = 1L;

	public static final String DISTRIBUTED_ID_KEY = "mall4cloud-user";

    /**
     * ID
     */
    private Long userId;

    /**
     * 用户昵称
     */
    private String nickName;

    /**
     * 头像图片路径
     */
    private String pic;

    /**
     * 状态 1 正常 0 无效
     */
    private Integer status;

    /**
     * 是否是达人：0-否 1-是
     */
    private Integer isTalent;

    /**
     * 达人申请时间
     */
    private LocalDateTime talentApplyTime;

    /**
     * 达人真实姓名
     */
    private String talentRealName;

    /**
     * 达人手机号
     */
    private String talentPhone;

    /**
     * 达人所在省份
     */
    private String talentProvince;

    /**
     * 达人所在城市
     */
    private String talentCity;

    /**
     * 达人所在区域
     */
    private String talentArea;

    /**
     * 达人申请理由
     */
    private String talentApplyReason;

    /**
     * 达人个人简介
     */
    private String talentIntro;

    /**
     * 希望公司提供的支持
     */
    private String talentSupportExpect;

    /**
     * 达人申请状态：0-待审核 1-已通过 2-已拒绝
     */
    private Integer talentStatus;

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public String getPic() {
		return pic;
	}

	public void setPic(String pic) {
		this.pic = pic;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getIsTalent() {
		return isTalent;
	}

	public void setIsTalent(Integer isTalent) {
		this.isTalent = isTalent;
	}

	public LocalDateTime getTalentApplyTime() {
		return talentApplyTime;
	}

	public void setTalentApplyTime(LocalDateTime talentApplyTime) {
		this.talentApplyTime = talentApplyTime;
	}

	public String getTalentRealName() {
		return talentRealName;
	}

	public void setTalentRealName(String talentRealName) {
		this.talentRealName = talentRealName;
	}

	public String getTalentPhone() {
		return talentPhone;
	}

	public void setTalentPhone(String talentPhone) {
		this.talentPhone = talentPhone;
	}

	public String getTalentProvince() {
		return talentProvince;
	}

	public void setTalentProvince(String talentProvince) {
		this.talentProvince = talentProvince;
	}

	public String getTalentCity() {
		return talentCity;
	}

	public void setTalentCity(String talentCity) {
		this.talentCity = talentCity;
	}

	public String getTalentArea() {
		return talentArea;
	}

	public void setTalentArea(String talentArea) {
		this.talentArea = talentArea;
	}

	public String getTalentApplyReason() {
		return talentApplyReason;
	}

	public void setTalentApplyReason(String talentApplyReason) {
		this.talentApplyReason = talentApplyReason;
	}

	public String getTalentIntro() {
		return talentIntro;
	}

	public void setTalentIntro(String talentIntro) {
		this.talentIntro = talentIntro;
	}

	public String getTalentSupportExpect() {
		return talentSupportExpect;
	}

	public void setTalentSupportExpect(String talentSupportExpect) {
		this.talentSupportExpect = talentSupportExpect;
	}

	public Integer getTalentStatus() {
		return talentStatus;
	}

	public void setTalentStatus(Integer talentStatus) {
		this.talentStatus = talentStatus;
	}

	@Override
	public String toString() {
		return "User{" +
				"userId=" + userId +
				",createTime=" + createTime +
				",updateTime=" + updateTime +
				",nickName=" + nickName +
				",pic=" + pic +
				",status=" + status +
				",isTalent=" + isTalent +
				",talentApplyTime=" + talentApplyTime +
				",talentRealName=" + talentRealName +
				",talentPhone=" + talentPhone +
				",talentProvince=" + talentProvince +
				",talentCity=" + talentCity +
				",talentArea=" + talentArea +
				",talentApplyReason=" + talentApplyReason +
				",talentIntro=" + talentIntro +
				",talentSupportExpect=" + talentSupportExpect +
				",talentStatus=" + talentStatus +
				'}';
	}
}
