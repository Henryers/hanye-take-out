package fun.cyhgraph.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 地址簿
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressBook implements Serializable {

    private static final long serialVersionUID = 1L;
    private Integer id;
    private Integer userId;  // 用户id
    private String consignee;  // 收货人
    private String phone;  // 手机号
    private Integer gender;  // 性别 0 女 1 男
    private String provinceCode;  // 省级区划编号
    private String provinceName;  // 省级名称
    private String cityCode;  // 市级区划编号
    private String cityName;  // 市级名称
    private String districtCode; // 区级区划编号
    private String districtName; // 区级名称
    private String detail; // 详细地址
    private String label;  // 标签
    private Integer isDefault;   // 是否默认 0否 1是
}
