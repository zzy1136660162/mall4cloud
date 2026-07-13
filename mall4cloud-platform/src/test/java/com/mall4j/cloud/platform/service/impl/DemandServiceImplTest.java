package com.mall4j.cloud.platform.service.impl;

import com.mall4j.cloud.api.leaf.feign.SegmentFeignClient;
import com.mall4j.cloud.platform.mapper.DemandMapper;
import com.mall4j.cloud.platform.vo.DemandVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DemandServiceImplTest {

    private DemandMapper demandMapper;
    private DemandServiceImpl demandService;

    @BeforeEach
    void setUp() {
        demandMapper = mock(DemandMapper.class);
        demandService = new DemandServiceImpl();
        ReflectionTestUtils.setField(demandService, "demandMapper", demandMapper);
        ReflectionTestUtils.setField(demandService, "segmentFeignClient", mock(SegmentFeignClient.class));
    }

    @Test
    void shouldQueryByDemandNoAndPhoneAndHideInternalSubmitterId() {
        DemandVO demand = new DemandVO();
        demand.setDemandNo("D123456");
        demand.setSubmitterPhone("13800000000");
        demand.setSubmitterId("internal-user-id");
        when(demandMapper.getByDemandNoAndPhone("D123456", "13800000000")).thenReturn(demand);

        DemandVO result = demandService.getByDemandNoAndPhone(" D123456 ", " 13800000000 ");

        assertEquals("D123456", result.getDemandNo());
        assertNull(result.getSubmitterId());
        verify(demandMapper).getByDemandNoAndPhone("D123456", "13800000000");
    }

    @Test
    void shouldGenerateReadableDemandNoWhenLeafIsUnavailable() {
        String demandNo = ReflectionTestUtils.invokeMethod(demandService, "generateDemandNo");

        org.junit.jupiter.api.Assertions.assertNotNull(demandNo);
        org.junit.jupiter.api.Assertions.assertTrue(demandNo.matches("RD\\d{8}-[0-9A-Z]{8}"));
    }
}
