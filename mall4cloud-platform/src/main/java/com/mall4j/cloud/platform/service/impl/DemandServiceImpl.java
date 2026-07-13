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

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

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

    private static final DateTimeFormatter DEMAND_DATE_FORMATTER = DateTimeFormatter.BASIC_ISO_DATE;

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
        try {
            return java.sql.Date.valueOf(LocalDate.parse(dateStr));
        } catch (DateTimeParseException | IllegalArgumentException e) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "期望交付时间格式不正确");
        }
    }

    private String generateDemandNo() {
        String uniqueCode;
        try {
            ServerResponseEntity<Long> response = segmentFeignClient.getSegmentId(DEMAND_ID_KEY);
            if (response.isSuccess() && response.getData() != null) {
                uniqueCode = Long.toUnsignedString(response.getData(), 36).toUpperCase();
                return formatDemandNo(uniqueCode);
            }
        } catch (Exception ignored) {
            // Leaf 暂时不可用时使用 UUID 片段，日期与随机码组合后仍保持较好的可读性和唯一性。
        }
        uniqueCode = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return formatDemandNo(uniqueCode);
    }

    private String formatDemandNo(String uniqueCode) {
        String normalizedCode = uniqueCode.length() > 8
                ? uniqueCode.substring(uniqueCode.length() - 8)
                : "00000000".substring(uniqueCode.length()) + uniqueCode;
        return "RD" + LocalDate.now().format(DEMAND_DATE_FORMATTER) + "-" + normalizedCode;
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
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
    public DemandVO getByDemandNoAndPhone(String demandNo, String submitterPhone) {
        DemandVO demand = demandMapper.getByDemandNoAndPhone(trim(demandNo), trim(submitterPhone));
        if (demand == null) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "未查询到需求，请核对手机号和需求编号");
        }
        // 公开查询不返回内部提交人标识。
        demand.setSubmitterId(null);
        return demand;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long submit(DemandSubmitDTO demandSubmitDTO) {
        Demand demand = new Demand();
        demand.setDemandNo(generateDemandNo());
        demand.setTitle(trim(demandSubmitDTO.getTitle()));
        demand.setFunctionalAppeal(trim(demandSubmitDTO.getFunctionalAppeal()));
        demand.setProductCategory(demandSubmitDTO.getProductCategory());
        demand.setServiceType(trim(demandSubmitDTO.getServiceType()));
        demand.setExpertiseField(trim(demandSubmitDTO.getExpertiseField()));
        demand.setTargetAudience(trim(demandSubmitDTO.getTargetAudience()));
        demand.setDosageFormPreference(trim(demandSubmitDTO.getDosageFormPreference()));
        demand.setBudgetRange(trim(demandSubmitDTO.getBudgetRange()));
        demand.setExpectedDeliveryTime(parseDate(demandSubmitDTO.getExpectedDeliveryTime()));
        demand.setRemark(trim(demandSubmitDTO.getRemark()));
        demand.setSubmitterId(trim(demandSubmitDTO.getSubmitterId()) != null && !trim(demandSubmitDTO.getSubmitterId()).isEmpty()
                ? trim(demandSubmitDTO.getSubmitterId()) : trim(demandSubmitDTO.getSubmitterPhone()));
        demand.setSubmitterName(trim(demandSubmitDTO.getSubmitterName()));
        demand.setSubmitterPhone(trim(demandSubmitDTO.getSubmitterPhone()));
        demand.setStatus(0);
        demand.setStatusText(STATUS_TEXT_MAP.get(0));
        Date now = new Date();
        demand.setSubmitTime(now);
        demand.setUpdateTime(now);

        demandMapper.save(demand);
        return demand.getId();
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
        String statusText = STATUS_TEXT_MAP.get(demandHandleDTO.getStatus());
        if (statusText == null) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "需求状态不正确");
        }
        demand.setStatusText(statusText);
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
        if (!Objects.equals(demandVO.getSubmitterId(), submitterId)) {
            throw new Mall4cloudException(ResponseEnum.UNAUTHORIZED);
        }
        if (demandVO.getStatus() != 0) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "当前状态不允许撤回");
        }

        int updated = demandMapper.updateStatusIfCurrent(demandId, submitterId, 0, 5, STATUS_TEXT_MAP.get(5));
        if (updated == 0) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "需求状态已变化，请刷新后重试");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void reapply(Long demandId, String submitterId) {
        DemandVO demandVO = demandMapper.getById(demandId);
        if (demandVO == null) {
            throw new Mall4cloudException(ResponseEnum.DATA_ERROR);
        }
        if (!Objects.equals(demandVO.getSubmitterId(), submitterId)) {
            throw new Mall4cloudException(ResponseEnum.UNAUTHORIZED);
        }
        if (demandVO.getStatus() != 5) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "当前状态不允许重新申请");
        }

        Demand demand = new Demand();
        demand.setDemandNo(generateDemandNo());
        demand.setTitle(demandVO.getTitle());
        demand.setFunctionalAppeal(demandVO.getFunctionalAppeal());
        demand.setProductCategory(demandVO.getProductCategory());
        demand.setServiceType(demandVO.getServiceType());
        demand.setExpertiseField(demandVO.getExpertiseField());
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
        if (!Objects.equals(demandVO.getSubmitterId(), submitterId)) {
            throw new Mall4cloudException(ResponseEnum.UNAUTHORIZED);
        }
        if (demandVO.getStatus() != 5) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "当前状态不允许删除");
        }

        int deleted = demandMapper.deleteByIdAndSubmitterAndStatus(demandId, submitterId, 5);
        if (deleted == 0) {
            throw new Mall4cloudException(ResponseEnum.SHOW_FAIL, "需求状态已变化，请刷新后重试");
        }
    }

    @Override
    public List<DemandVO> listBySubmitterId(String submitterId) {
        return demandMapper.listBySubmitterId(submitterId);
    }
}
