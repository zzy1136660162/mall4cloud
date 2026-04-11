package com.mall4j.cloud.platform.service.impl;

import com.mall4j.cloud.api.leaf.feign.SegmentFeignClient;
import com.mall4j.cloud.common.exception.Mall4cloudException;
import com.mall4j.cloud.common.response.ResponseEnum;
import com.mall4j.cloud.common.response.ServerResponseEntity;
import com.mall4j.cloud.common.database.dto.PageDTO;
import com.mall4j.cloud.common.database.util.PageUtil;
import com.mall4j.cloud.common.database.vo.PageVO;
import com.mall4j.cloud.platform.dto.DemandHandleDTO;
import com.mall4j.cloud.platform.dto.DemandPageDTO;
import com.mall4j.cloud.platform.dto.DemandSubmitDTO;
import com.mall4j.cloud.platform.mapper.DemandMapper;
import com.mall4j.cloud.platform.model.Demand;
import com.mall4j.cloud.platform.service.DemandService;
import com.mall4j.cloud.platform.vo.DemandVO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 研发需求Service实现
 *
 * @author mall4j
 */
@Service
public class DemandServiceImpl implements DemandService {

    @Resource
    private DemandMapper demandMapper;

    @Resource
    private SegmentFeignClient segmentFeignClient;

    private static final String DEMAND_ID_KEY = "mall4cloud-demand";

    private static final Map<Integer, String> STATUS_TEXT_MAP = new HashMap<>();
    static {
        STATUS_TEXT_MAP.put(0, "待处理");
        STATUS_TEXT_MAP.put(1, "确认中");
        STATUS_TEXT_MAP.put(2, "研发中");
        STATUS_TEXT_MAP.put(3, "样品制作");
        STATUS_TEXT_MAP.put(4, "已完成");
        STATUS_TEXT_MAP.put(5, "已取消");
    }

    private Date parseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }
        try {
            return new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);
        } catch (Exception e) {
            return null;
        }
    }

    private synchronized Long generateSimpleId() {
        return System.currentTimeMillis() + (int)(Math.random() * 1000);
    }

    @Override
    public List<DemandVO> list() {
        return demandMapper.list();
    }

    @Override
    public PageVO<DemandVO> page(DemandPageDTO demand) {
        return PageUtil.doPage(demand, () -> demandMapper.page(buildQueryDemand(demand)));
    }

    private Demand buildQueryDemand(DemandPageDTO demand) {
        Demand queryDemand = new Demand();
        queryDemand.setTitle(demand.getTitle());
        queryDemand.setStatus(demand.getStatus());
        queryDemand.setSubmitterId(demand.getSubmitterId());
        return queryDemand;
    }

    @Override
    public DemandVO getById(Long id) {
        return demandMapper.getById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long submit(DemandSubmitDTO demandSubmitDTO) {
        Long demandId;
        try {
            ServerResponseEntity<Long> segmentIdResponse = segmentFeignClient.getSegmentId(DEMAND_ID_KEY);
            if (segmentIdResponse.isSuccess() && segmentIdResponse.getData() != null) {
                demandId = segmentIdResponse.getData();
            } else {
                demandId = generateSimpleId();
            }
        } catch (Exception e) {
            demandId = generateSimpleId();
        }

        Demand demand = new Demand();
        demand.setId(demandId);
        demand.setDemandNo("D" + demandId);
        demand.setTitle(demandSubmitDTO.getTitle());
        demand.setFunctionalAppeal(demandSubmitDTO.getFunctionalAppeal());
        demand.setTargetAudience(demandSubmitDTO.getTargetAudience());
        demand.setDosageFormPreference(demandSubmitDTO.getDosageFormPreference());
        demand.setBudgetRange(demandSubmitDTO.getBudgetRange());
        demand.setExpectedDeliveryTime(parseDate(demandSubmitDTO.getExpectedDeliveryTime()));
        demand.setRemark(demandSubmitDTO.getRemark());
        demand.setSubmitterId(demandSubmitDTO.getSubmitterId());
        demand.setSubmitterName(demandSubmitDTO.getSubmitterName());
        demand.setSubmitterPhone(demandSubmitDTO.getSubmitterPhone());
        demand.setStatus(0);
        demand.setStatusText(STATUS_TEXT_MAP.get(0));
        Date now = new Date();
        demand.setSubmitTime(now);
        demand.setUpdateTime(now);

        demandMapper.save(demand);
        return demandId;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handle(DemandHandleDTO demandHandleDTO) {
        DemandVO demandVO = demandMapper.getById(demandHandleDTO.getDemandId());
        if (demandVO == null) {
            throw new Mall4cloudException(ResponseEnum.DATA_ERROR);
        }

        Demand demand = new Demand();
        demand.setId(demandHandleDTO.getDemandId());
        demand.setStatus(demandHandleDTO.getStatus());
        demand.setStatusText(STATUS_TEXT_MAP.get(demandHandleDTO.getStatus()));
        demand.setAdminRemark(demandHandleDTO.getAdminRemark());
        demand.setHandlerName(demandHandleDTO.getHandlerName());
        demand.setUpdateTime(new Date());

        demandMapper.update(demand);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void withdraw(Long demandId, String submitterId) {
        DemandVO demandVO = demandMapper.getById(demandId);
        if (demandVO == null) {
            throw new Mall4cloudException(ResponseEnum.DATA_ERROR);
        }
        if (!demandVO.getSubmitterId().equals(submitterId)) {
            throw new Mall4cloudException(ResponseEnum.UNAUTHORIZED);
        }
        if (demandVO.getStatus() != 0) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "当前状态不允许撤回");
        }

        Demand demand = new Demand();
        demand.setId(demandId);
        demand.setStatus(5);
        demand.setStatusText(STATUS_TEXT_MAP.get(5));
        demand.setUpdateTime(new Date());

        demandMapper.update(demand);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void reapply(Long demandId, String submitterId) {
        DemandVO demandVO = demandMapper.getById(demandId);
        if (demandVO == null) {
            throw new Mall4cloudException(ResponseEnum.DATA_ERROR);
        }
        if (!demandVO.getSubmitterId().equals(submitterId)) {
            throw new Mall4cloudException(ResponseEnum.UNAUTHORIZED);
        }
        if (demandVO.getStatus() != 5) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "当前状态不允许重新申请");
        }

        Long newDemandId;
        try {
            ServerResponseEntity<Long> segmentIdResponse = segmentFeignClient.getSegmentId(DEMAND_ID_KEY);
            if (segmentIdResponse.isSuccess() && segmentIdResponse.getData() != null) {
                newDemandId = segmentIdResponse.getData();
            } else {
                newDemandId = generateSimpleId();
            }
        } catch (Exception e) {
            newDemandId = generateSimpleId();
        }

        Demand demand = new Demand();
        demand.setId(newDemandId);
        demand.setDemandNo("D" + newDemandId);
        demand.setTitle(demandVO.getTitle());
        demand.setFunctionalAppeal(demandVO.getFunctionalAppeal());
        demand.setTargetAudience(demandVO.getTargetAudience());
        demand.setDosageFormPreference(demandVO.getDosageFormPreference());
        demand.setBudgetRange(demandVO.getBudgetRange());
        demand.setExpectedDeliveryTime(demandVO.getExpectedDeliveryTime());
        demand.setRemark(demandVO.getRemark());
        demand.setSubmitterId(submitterId);
        demand.setSubmitterName(demandVO.getSubmitterName());
        demand.setSubmitterPhone(demandVO.getSubmitterPhone());
        demand.setStatus(0);
        demand.setStatusText(STATUS_TEXT_MAP.get(0));
        Date now = new Date();
        demand.setSubmitTime(now);
        demand.setUpdateTime(now);

        demandMapper.save(demand);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long demandId, String submitterId) {
        DemandVO demandVO = demandMapper.getById(demandId);
        if (demandVO == null) {
            throw new Mall4cloudException(ResponseEnum.DATA_ERROR);
        }
        if (!demandVO.getSubmitterId().equals(submitterId)) {
            throw new Mall4cloudException(ResponseEnum.UNAUTHORIZED);
        }
        if (demandVO.getStatus() != 5) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "当前状态不允许删除");
        }

        demandMapper.deleteById(demandId);
    }

    @Override
    public List<DemandVO> listBySubmitterId(String submitterId) {
        return demandMapper.listBySubmitterId(submitterId);
    }
}
