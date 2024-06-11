package fun.cyhgraph;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;

public class POITest {

    public static void main(String[] args) throws Exception {
        read();
//        write();
    }

    // 写入文件
    public static void write() throws IOException {
        XSSFWorkbook excel = new XSSFWorkbook();
        XSSFSheet sheet = excel.createSheet("sheet1");
        XSSFRow row1 = sheet.createRow(0);
        // 创建单元格并设置值
        row1.createCell(1).setCellValue("lsh");
        row1.createCell(2).setCellValue("mlx");
        XSSFRow row2 = sheet.createRow(1);
        row2.createCell(1).setCellValue("bbb");
        row2.createCell(2).setCellValue("eee");
        XSSFRow row3 = sheet.createRow(2);
        row3.createCell(1).setCellValue("ccc");
        row3.createCell(2).setCellValue("ddd");
        // 创建文件对象，指定存放路径，并放到文件输出流里，等待数据write写入
        File file = new File("D:\\test.xlsx");
        FileOutputStream out = new FileOutputStream(file);
        excel.write(out);
        out.flush();
        out.close();
        excel.close();
    }

    // 读取文件
    public static void read() throws Exception{
        FileInputStream fileInputStream = new FileInputStream(new File("D:\\test.xlsx"));
        // 输入流写入新创建的excel文件
        XSSFWorkbook excel = new XSSFWorkbook(fileInputStream);
        XSSFSheet sheet = excel.getSheetAt(0);
        // 获取sheet中最后一行的行号，才能够按行遍历所有数据（否则不知道何时遍历结束）
        int lastRowNum = sheet.getLastRowNum();
        // 注意最后一行也要遍历到，因此是 <=
        for (int i = 0; i <= lastRowNum; i++) {
            XSSFRow row = sheet.getRow(i);
            // 拿到该行的两个单元格的值，然后拼接后打印输出
            String cell1 = row.getCell(1).getStringCellValue();
            String cell2 = row.getCell(2).getStringCellValue();
            System.out.println(cell1 + " " + cell2);
        }
        fileInputStream.close();
        excel.close();
    }
}
