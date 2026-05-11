package com.mall4j.cloud.platform.mapper;

import com.mall4j.cloud.platform.model.Demand;
import com.mall4j.cloud.platform.vo.DemandVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 研发需求Mapper
 *
 * @author mall4j
 */
public interface DemandMapper {

    /**
     * 获取需求列表
     * @return 需求列表
     */
    List<DemandVO> list();

    /**
     * 分页查询需求
     * @param demand 查询参数
     * @return 需求列表
     */
    List<DemandVO> page(@Param("demand") Demand demand);

    /**
     * 根据ID获取需求
     * @param id 需求ID
     * @return 需求详情
     */
    DemandVO getById(@Param("id") Long id);

    /**
     * 保存需求
     * @param demand 需求
     */
    void save(@Param("demand") Demand demand);

    /**
     * 更新需求
     * @param demand 需求
     */
    void update(@Param("demand") Demand demand);

    /**
     * 删除需求
     * @param id 需求ID
     */
    void deleteById(@Param("id") Long id);

    /**
     * 根据提交人ID获取需求列表
     * @param submitterId 提交人ID
     * @return 需求列表
     */
    List<DemandVO> listBySubmitterId(@Param("submitterId") String submitterId);
}
