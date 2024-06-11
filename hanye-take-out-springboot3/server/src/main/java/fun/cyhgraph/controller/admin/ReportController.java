package fun.cyhgraph.controller.admin;

import fun.cyhgraph.result.Result;
import fun.cyhgraph.service.ReportService;
import fun.cyhgraph.vo.OrderReportVO;
import fun.cyhgraph.vo.SalesTop10ReportVO;
import fun.cyhgraph.vo.TurnoverReportVO;
import fun.cyhgraph.vo.UserReportVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDate;

@RestController
@RequestMapping("/admin/report")
@Slf4j
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * 营业额统计
     * @param begin
     * @param end
     * @return
     */
    @GetMapping("/turnoverStatistics")
    public Result<TurnoverReportVO> turnoverStatistics(
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            LocalDate begin,
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            LocalDate end){
        return Result.success(reportService.getTurnover(begin, end));
    }

    /**
     * 用户统计
     * @param begin
     * @param end
     * @return
     */
    @GetMapping("/userStatistics")
    public Result<UserReportVO> userStatistics(
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            LocalDate begin,
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            LocalDate end){
        return Result.success(reportService.getUser(begin, end));
    }

    /**
     * 订单统计（多了 "有效 / 总数 = 订单完成率" 这3个值）
     * @param begin
     * @param end
     * @return
     */
    @GetMapping("/orderStatistics")
    public Result<OrderReportVO> orderStatistics(
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate begin,
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate end) {
        return Result.success(reportService.getOrder(begin, end));
    }

    /**
     * 销量Top10统计
     * @param begin
     * @param end
     * @return
     */
    @GetMapping("/top10Statistics")
    public Result<SalesTop10ReportVO> top10Statistics(
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate begin,
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate end){
        return Result.success(reportService.getSalesTop10(begin, end));
    }

    /**
     * 导出运营数据报表
     * 服务端传给客户端的，客户端不传数据过来
     * @param response
     */
    @GetMapping("/export")
    public void export(HttpServletResponse response){
        reportService.exportBusinessData(response);
    }
}
