package fun.cyhgraph.service.serviceImpl;

import fun.cyhgraph.dto.GoodsSalesDTO;
import fun.cyhgraph.entity.Order;
import fun.cyhgraph.mapper.OrderMapper;
import fun.cyhgraph.mapper.UserMapper;
import fun.cyhgraph.service.ReportService;
import fun.cyhgraph.service.WorkSpaceService;
import fun.cyhgraph.vo.*;
import jakarta.servlet.ServletOutputStream;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private WorkSpaceService workSpaceService;

    /**
     * 营业额统计
     *
     * @param begin
     * @param end
     * @return
     */
    public TurnoverReportVO getTurnover(LocalDate begin, LocalDate end) {
        List<LocalDate> dateList = new ArrayList<>();
        dateList.add(begin);
        while (!begin.equals(end)) {
            begin = begin.plusDays(1); // 日期计算，获得指定日期后1天的日期
            dateList.add(begin);
        }
        List<Double> turnoverList = new ArrayList<>();
        for (LocalDate date : dateList) {
            // 每一天的最早和最晚时刻，作为 begin 和 end
            LocalDateTime beginTime = LocalDateTime.of(date, LocalTime.MIN);
            LocalDateTime endTime = LocalDateTime.of(date, LocalTime.MAX);
            Map map = new HashMap();
            map.put("status", Order.COMPLETED);
            map.put("begin", beginTime);
            map.put("end", endTime);
            // 统计当天的营业额，并加到 turnoverList 里，null要转为0
            Double turnover = orderMapper.sumByMap(map);
            turnover = turnover == null ? 0.0 : turnover;
            turnoverList.add(turnover);
        }
        //数据封装
        return TurnoverReportVO.builder()
                .dateList(StringUtils.join(dateList, ","))
                .turnoverList(StringUtils.join(turnoverList, ","))
                .build();
    }

    /**
     * 用户统计
     *
     * @param begin
     * @param end
     * @return
     */
    public UserReportVO getUser(LocalDate begin, LocalDate end) {
        List<LocalDate> dateList = new ArrayList<>();
        dateList.add(begin);
        while (!begin.equals(end)) {
            begin = begin.plusDays(1); // 日期计算，获得指定日期后1天的日期
            dateList.add(begin);
        }
        List<Integer> newUserList = new ArrayList<>();
        List<Integer> totalUserList = new ArrayList<>();
        for (LocalDate date : dateList) {
            // 每一天的最早和最晚时刻，作为 begin 和 end
            LocalDateTime beginTime = LocalDateTime.of(date, LocalTime.MIN);
            LocalDateTime endTime = LocalDateTime.of(date, LocalTime.MAX);
            Map map = new HashMap();
            // 先统计截至当天总用户数
            map.put("end", endTime);
            Integer totalUser = userMapper.countByMap(map);
            // 再加上 begin 条件，统计当天的新增用户数和
            map.put("begin", beginTime);
            Integer newUser = userMapper.countByMap(map);
            newUserList.add(newUser);
            totalUserList.add(totalUser);
        }
        // 数据封装
        return UserReportVO.builder()
                .dateList(StringUtils.join(dateList, ","))
                .newUserList(StringUtils.join(newUserList, ","))
                .totalUserList(StringUtils.join(totalUserList, ","))
                .build();
    }

    /**
     * 订单统计
     *
     * @param begin
     * @param end
     * @return
     */
    public OrderReportVO getOrder(LocalDate begin, LocalDate end) {
        List<LocalDate> dateList = new ArrayList<>();
        dateList.add(begin);
        while (!begin.equals(end)) {
            begin = begin.plusDays(1); // 日期计算，获得指定日期后1天的日期
            dateList.add(begin);
        }
        List<Integer> orderCountList = new ArrayList<>();
        List<Integer> validOrderCountList = new ArrayList<>();
        for (LocalDate date : dateList) {
            // 每一天的最早和最晚时刻，作为 begin 和 end
            LocalDateTime beginTime = LocalDateTime.of(date, LocalTime.MIN);
            LocalDateTime endTime = LocalDateTime.of(date, LocalTime.MAX);
            Map map = new HashMap();
            // 先统计当天总订单数
            map.put("begin", beginTime);
            map.put("end", endTime);
            Integer orderCount = orderMapper.countByMap(map);
            // 再加上 status 条件，统计当天有效订单数
            map.put("status", Order.COMPLETED);
            Integer validCount = orderMapper.countByMap(map);
            orderCountList.add(orderCount);
            validOrderCountList.add(validCount);
        }
        // 流式计算这段时间内的有效订单数和订单总数，相除再得出订单完成率
        // 1、时间区间内的总订单数
        Integer totalOrderCount = orderCountList.stream().reduce(Integer::sum).get();
        // 2、时间区间内的总有效订单数
        Integer validOrderCount = validOrderCountList.stream().reduce(Integer::sum).get();
        // 3、订单完成率
        Double orderCompletionRate = 0.0;
        if (totalOrderCount != 0) {
            orderCompletionRate = validOrderCount.doubleValue() / totalOrderCount;
        }
        return OrderReportVO.builder()
                .dateList(StringUtils.join(dateList, ","))
                .orderCountList(StringUtils.join(orderCountList, ","))
                .validOrderCountList(StringUtils.join(validOrderCountList, ","))
                .totalOrderCount(totalOrderCount)
                .validOrderCount(validOrderCount)
                .orderCompletionRate(orderCompletionRate)
                .build();
    }

    /**
     * 销量Top10统计
     * @param begin
     * @param end
     * @return
     */
    public SalesTop10ReportVO getSalesTop10(LocalDate begin, LocalDate end) {
        LocalDateTime beginTime = LocalDateTime.of(begin, LocalTime.MIN);
        LocalDateTime endTime = LocalDateTime.of(end, LocalTime.MAX);
        // Top 10 列表，每个元素都有商品名称和销量值
        List<GoodsSalesDTO> goodsSalesDTOList = orderMapper.getSalesTop10(beginTime, endTime);
        // 流式操作，拿到列表中所有name/number属性组成的列表，然后再用","序列化成字符串，变成xxx,xxx,xxx的形式
        String nameList = StringUtils.join(goodsSalesDTOList.stream()
                .map(GoodsSalesDTO::getName).collect(Collectors.toList()),",");
        String numberList = StringUtils.join(goodsSalesDTOList.stream()
                .map(GoodsSalesDTO::getNumber).collect(Collectors.toList()),",");
        // 数据封装返回
        return SalesTop10ReportVO.builder()
                .nameList(nameList)
                .numberList(numberList)
                .build();
    }

    /**
     * 导出近30天的运营数据报表
     * @param response
     */
    public void exportBusinessData(HttpServletResponse response) {
        // 提前将资料中的 运营数据报表模板.xlsx 拷贝到项目的resources/template目录中
        // 拿到 前30天 - 前1天 的数据
        LocalDate begin = LocalDate.now().minusDays(30);
        // 日期 转 日期加时间，转的时候要指定时间字段
        LocalDateTime beginTime = LocalDateTime.of(begin, LocalTime.MIN);
        LocalDate end = LocalDate.now().minusDays(1);
        LocalDateTime endTime = LocalDateTime.of(end, LocalTime.MAX);
        // 调用service方法来获取工作台数据（注意是service而不是mapper，因为这个功能之前实现过，直接拿来用就行）
        BusinessDataVO businessData = workSpaceService.getBusinessData(beginTime, endTime);
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("template/运营数据报表模板.xlsx");
        try {
            XSSFWorkbook excel = new XSSFWorkbook(in);
            XSSFSheet sheet = excel.getSheetAt(0);
            // 第2行写入时间字段
            sheet.getRow(1).getCell(1).setCellValue(begin + "至" + end);
            // 第4、5行写入概览数据
            XSSFRow row4 = sheet.getRow(3);
            // 获取单元格，填入营业额、订单完成率、新增用户数量
            row4.getCell(2).setCellValue(businessData.getTurnover());
            row4.getCell(4).setCellValue(businessData.getOrderCompletionRate());
            row4.getCell(6).setCellValue(businessData.getNewUsers());
            XSSFRow row5 = sheet.getRow(4);
            // 获取单元格，填入有效订单数、订单平均价格
            row5.getCell(2).setCellValue(businessData.getValidOrderCount());
            row5.getCell(4).setCellValue(businessData.getUnitPrice());
            // 插入30行明细数据，每行6个单元格的值对应一天的数据概览
            for (int i = 0; i < 30; i++) {
                LocalDate date = begin.plusDays(i);
                // 准备每天的明细数据
                businessData = workSpaceService.getBusinessData(LocalDateTime.of(date,LocalTime.MIN), LocalDateTime.of(date, LocalTime.MAX));
                XSSFRow row = sheet.getRow(7 + i);
                row.getCell(1).setCellValue(date.toString());
                row.getCell(2).setCellValue(businessData.getTurnover());
                row.getCell(3).setCellValue(businessData.getValidOrderCount());
                row.getCell(4).setCellValue(businessData.getOrderCompletionRate());
                row.getCell(5).setCellValue(businessData.getUnitPrice());
                row.getCell(6).setCellValue(businessData.getNewUsers());
            }
            // 创建输出流，excel数据放进流里，通过输出流将文件下载到客户端浏览器中
            ServletOutputStream out = response.getOutputStream();
            excel.write(out);
            // 关闭资源
            out.flush();
            out.close();
            excel.close();
        } catch (IOException e) {
            // 打印错误就行，不要抛异常使程序中断
            e.printStackTrace();
        }
    }
}
