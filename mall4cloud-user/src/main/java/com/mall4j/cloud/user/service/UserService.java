package com.mall4j.cloud.user.service;

import com.mall4j.cloud.api.user.vo.UserApiVO;
import com.mall4j.cloud.common.database.dto.PageDTO;
import com.mall4j.cloud.common.database.vo.PageVO;
import com.mall4j.cloud.user.dto.UserRegisterDTO;
import com.mall4j.cloud.user.model.User;

import java.util.List;

/**
 * 用户表
 *
 * @author YXF
 * @date 2020-12-08 11:18:04
 */
public interface UserService {

	/**
	 * 分页获取用户表列表
	 * @param pageDTO 分页参数
	 * @return 用户表列表分页数据
	 */
	PageVO<UserApiVO> page(PageDTO pageDTO);

	/**
	 * 根据用户表id获取用户表
	 *
	 * @param userId 用户表id
	 * @return 用户表
	 */
	UserApiVO getByUserId(Long userId);

	/**
	 * 更新用户表
	 * @param user 用户表
	 */
	void update(User user);

	/**
	 * 根据用户id列表，获取用户信息
	 * @param userIds
	 * @return
	 */
	List<UserApiVO> getUserByUserIds(List<Long> userIds);

	/**
	 * 保存用户
	 * @param param 注册信息
	 * @return uid
	 */
    Long save(UserRegisterDTO param);

	/**
	 * 更新达人申请信息
	 * @param user 用户表
	 */
	void updateTalentApply(User user);

	/**
	 * 分页查询达人申请
	 * @param page 页码
	 * @param limit 每页数量
	 * @param talentStatus 审核状态
	 * @return 分页结果
	 */
	PageVO<User> pageTalentApply(Integer page, Integer limit, Integer talentStatus);

	/**
	 * 审核达人申请
	 * @param userId 用户ID
	 * @param status 审核状态：1-通过 2-拒绝
	 */
	void auditTalentApply(Long userId, Integer status);
}
