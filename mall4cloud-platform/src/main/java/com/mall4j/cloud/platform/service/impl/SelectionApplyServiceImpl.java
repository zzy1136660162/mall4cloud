package com.mall4j.cloud.platform.service.impl;

import com.mall4j.cloud.common.database.vo.PageVO;
import com.mall4j.cloud.common.exception.Mall4cloudException;
import com.mall4j.cloud.common.security.AuthUserContext;
import com.mall4j.cloud.common.util.BeanUtil;
import com.mall4j.cloud.platform.dto.SelectionApplyDTO;
import com.mall4j.cloud.platform.dto.SelectionApplyPageDTO;
import com.mall4j.cloud.platform.dto.SelectionAuditDTO;
import com.mall4j.cloud.platform.mapper.SelectionApplyMapper;
import com.mall4j.cloud.platform.model.SelectionApply;
import com.mall4j.cloud.platform.service.SelectionApplyService;
import com.mall4j.cloud.platform.vo.admin.SelectionApplyVO;
import com.mall4j.cloud.platform.vo.admin.SelectionStatisticsVO;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 选品申请服务实现
 *
 * @author AI Assistant
 * @date 2026-04-11
 */
@Service
public class SelectionApplyServiceImpl implements SelectionApplyService {

    @Autowired
    private SelectionApplyMapper selectionApplyMapper;

    /**
     * 达人角色ID
     */
    private static final Long TALENT_ROLE_ID = 100L;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long applySelection(SelectionApplyDTO dto) {
        Long userId = AuthUserContext.get().getUserId();
        
        // 1. 校验用户是否是达人（这里简化处理，实际需要查询角色表）
        // if (!hasTalentRole(userId)) {
        //     throw new Mall4cloudException("只有达人才能申请选品");
        // }
        
        // 2. 检查是否重复申请
        SelectionApply existApply = selectionApplyMapper.checkUserApply(userId, dto.getSpuId());
        if (existApply != null) {
            if (existApply.getAuditStatus() == 1) {
                throw new Mall4cloudException("您已申请过该商品，请等待审核");
            } else if (existApply.getAuditStatus() == 2) {
                throw new Mall4cloudException("您已申请过该商品，无需重复申请");
            }
        }
        
        // 3. 创建申请记录
        SelectionApply apply = new SelectionApply();
        apply.setUserId(userId);
        apply.setUserName(dto.getUserName());
        apply.setSpuId(dto.getSpuId());
        apply.setSpuName(dto.getSpuName());
        apply.setShopId(dto.getShopId());
        apply.setShopName(dto.getShopName());
        apply.setMainImgUrl(dto.getMainImgUrl());
        apply.setPriceFee(dto.getPriceFee());
        apply.setContactPhone(dto.getContactPhone());
        apply.setDeliveryAddress(dto.getDeliveryAddress());
        apply.setApplyRemark(dto.getApplyRemark());
        apply.setApplyTime(new Date());
        apply.setAuditStatus(1); // 待审核
        selectionApplyMapper.insert(apply);
        
        return apply.getApplyId();
    }

    @Override
    public PageVO<SelectionApplyVO> getMyApplies(Integer pageNum, Integer pageSize) {
        Long userId = AuthUserContext.get().getUserId();
        
        List<SelectionApply> list = selectionApplyMapper.listByUserId(userId, (pageNum - 1) * pageSize, pageSize);
        int total = selectionApplyMapper.countByUserId(userId);
        
        List<SelectionApplyVO> voList = convertToVOList(list);
        
        PageVO<SelectionApplyVO> pageVO = new PageVO<>();
        pageVO.setList(voList);
        pageVO.setTotal((long) total);
        
        return pageVO;
    }

    @Override
    public SelectionApplyVO getApplyDetail(Long applyId) {
        SelectionApply apply = selectionApplyMapper.getById(applyId);
        if (apply == null) {
            throw new Mall4cloudException("申请记录不存在");
        }
        
        return convertToVO(apply);
    }

    @Override
    public PageVO<SelectionApplyVO> getApplyList(SelectionApplyPageDTO pageDTO) {
        List<SelectionApply> list = selectionApplyMapper.listByPage(pageDTO);
        int total = selectionApplyMapper.count(pageDTO);
        
        List<SelectionApplyVO> voList = convertToVOList(list);
        
        PageVO<SelectionApplyVO> pageVO = new PageVO<>();
        pageVO.setList(voList);
        pageVO.setTotal((long) total);
        
        return pageVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void auditSelection(Long applyId, SelectionAuditDTO dto) {
        SelectionApply apply = selectionApplyMapper.getById(applyId);
        if (apply == null) {
            throw new Mall4cloudException("申请记录不存在");
        }
        
        if (apply.getAuditStatus() != 1) {
            throw new Mall4cloudException("该申请已审核，无法重复审核");
        }
        
        Long auditorId = AuthUserContext.get().getUserId();
        
        apply.setAuditStatus(dto.getAuditStatus());
        apply.setAuditTime(new Date());
        apply.setAuditUserId(auditorId);
        apply.setAuditRemark(dto.getAuditRemark());
        
        selectionApplyMapper.update(apply);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void fillLogistics(Long applyId, String expressCompany, String expressNo) {
        if (StrUtil.isBlank(expressCompany) || StrUtil.isBlank(expressNo)) {
            throw new Mall4cloudException("快递公司和快递单号不能为空");
        }
        
        SelectionApply apply = selectionApplyMapper.getById(applyId);
        if (apply == null) {
            throw new Mall4cloudException("申请记录不存在");
        }
        
        if (apply.getAuditStatus() != 2) {
            throw new Mall4cloudException("该申请未通过审核，无法填写物流信息");
        }
        
        apply.setExpressCompany(expressCompany);
        apply.setExpressNo(expressNo);
        apply.setShipTime(new Date());
        
        selectionApplyMapper.update(apply);
    }

    @Override
    public SelectionStatisticsVO getStatistics() {
        SelectionStatisticsVO vo = new SelectionStatisticsVO();
        vo.setTotalApplies(0);
        vo.setPendingApplies(0);
        vo.setApprovedApplies(0);
        vo.setRejectedApplies(0);
        vo.setTodayApplies(0);
        return vo;
    }

    private List<SelectionApplyVO> convertToVOList(List<SelectionApply> list) {
        if (CollUtil.isEmpty(list)) {
            return CollUtil.newArrayList();
        }
        
        return list.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    private SelectionApplyVO convertToVO(SelectionApply apply) {
        if (apply == null) {
            return null;
        }
        
        SelectionApplyVO vo = BeanUtil.map(apply, SelectionApplyVO.class);
        
        // 设置审核状态文本
        if (apply.getAuditStatus() != null) {
            vo.setAuditStatusText(getAuditStatusText(apply.getAuditStatus()));
        }
        
        return vo;
    }

    private String getAuditStatusText(Integer status) {
        if (status == null) {
            return "";
        }
        switch (status) {
            case 1:
                return "待审核";
            case 2:
                return "已通过";
            case 3:
                return "已拒绝";
            default:
                return "未知";
        }
    }
}
