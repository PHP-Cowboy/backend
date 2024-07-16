// 假设这个函数被放在你的Vue组件的methods中
import * as XLSX from 'xlsx';

export function exportExcel(data,filename) {
    // 创建一个工作簿
    const wb = XLSX.utils.book_new();

    // 准备一些数据
    // const data = [
    //     ["姓名", "年龄", "职业"],
    //     ["张三", 28, "软件工程师"],
    //     ["李四", 22, "设计师"],
    //     ["王五", 34, "产品经理"]
    // ];

    // 将数据转换为工作表
    const ws = XLSX.utils.aoa_to_sheet(data);

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, filename);

    // 生成Excel文件
    XLSX.writeFile(wb, filename+".xlsx");
}