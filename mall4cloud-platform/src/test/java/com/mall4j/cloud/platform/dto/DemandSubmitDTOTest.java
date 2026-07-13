package com.mall4j.cloud.platform.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DemandSubmitDTOTest {

    private static jakarta.validation.ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidator() {
        validatorFactory.close();
    }

    @Test
    void shouldAcceptCompleteDemand() {
        assertTrue(validator.validate(validDemand()).isEmpty());
    }

    @Test
    void shouldRejectMissingRequiredFieldsAndInvalidPhone() {
        DemandSubmitDTO demand = validDemand();
        demand.setTitle(" ");
        demand.setServiceType("[]");
        demand.setSubmitterPhone("123456");

        assertFalse(validator.validate(demand).isEmpty());
    }

    private DemandSubmitDTO validDemand() {
        DemandSubmitDTO demand = new DemandSubmitDTO();
        demand.setTitle("舒缓修护精华研发");
        demand.setFunctionalAppeal("完成配方和功效验证");
        demand.setProductCategory(1);
        demand.setServiceType("[\"1\",\"2\"]");
        demand.setExpertiseField("功效评测");
        demand.setTargetAudience("敏感肌人群");
        demand.setBudgetRange("10-30万");
        demand.setExpectedDeliveryTime("2026-12-31");
        demand.setSubmitterName("张先生");
        demand.setSubmitterPhone("13800000000");
        return demand;
    }
}
