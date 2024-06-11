package fun.cyhgraph.service;

import fun.cyhgraph.vo.OrderReportVO;
import fun.cyhgraph.vo.SalesTop10ReportVO;
import fun.cyhgraph.vo.TurnoverReportVO;
import fun.cyhgraph.vo.UserReportVO;

import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDate;

public interface ReportService {
    TurnoverReportVO getTurnover(LocalDate begin, LocalDate end);

    UserReportVO getUser(LocalDate begin, LocalDate end);

    OrderReportVO getOrder(LocalDate begin, LocalDate end);

    SalesTop10ReportVO getSalesTop10(LocalDate begin, LocalDate end);

    void exportBusinessData(HttpServletResponse response);
}
