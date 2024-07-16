// 处理带时区的日期搜索范围区间，转为年月日时分秒:2024-06-27 14:26:55
export function formatDateTimeRangeWithTimes(dateRange) {
    if (!Array.isArray(dateRange) || dateRange.length !== 2) {
        throw new Error('dateRange must be an array with two Date objects');
    }

    return dateRange.map(date => {
        // 使用 padStart 方法确保月份、日期、小时、分钟和秒始终是两位数
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() 返回的是从0开始的月份
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0'); // 对于开始时间，这里始终为00
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 对于开始时间，这里始终为00
        const seconds = String(date.getSeconds()).padStart(2, '0'); // 对于开始时间，这里始终为00

        // 对于开始时间，直接使用上述值
        let startTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        // 对于结束时间，我们需要设置时间为23:59:59
        // 注意：我们不能直接修改传入的Date对象，因为它是一个引用类型，所以我们创建一个新的Date对象
        const endDate = new Date(date.getTime()); // 复制日期和时间
        endDate.setHours(23, 59, 59); // 设置时间为23:59:59
        const endHours = String(endDate.getHours()).padStart(2, '0');
        const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
        const endSeconds = String(endDate.getSeconds()).padStart(2, '0');
        let endTime = `${year}-${month}-${day} ${endHours}:${endMinutes}:${endSeconds}`;

        // 因为我们只需要开始时间的字符串对于开始日期，和结束时间的字符串对于结束日期
        // 所以我们在这里只返回开始时间的字符串（对于第一个Date对象）和结束时间的字符串（对于第二个Date对象）
        return date === dateRange[0] ? startTime : endTime;
    });
}

// 处理带时区的日期搜索范围区间，转为年月日:2024-06-27
export function formatDateRangeWithTimes(dateRange) {
    if (!Array.isArray(dateRange) || dateRange.length !== 2) {
        throw new Error('dateRange must be an array with two Date objects');
    }

    return dateRange.map(date => {
        // 使用 padStart 方法确保月份、日期、小时、分钟和秒始终是两位数
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() 返回的是从0开始的月份
        const day = String(date.getDate()).padStart(2, '0');

        // 对于开始时间，直接使用上述值
        let startTime = `${year}-${month}-${day}`;

        let endTime = `${year}-${month}-${day}`;

        // 因为我们只需要开始时间的字符串对于开始日期，和结束时间的字符串对于结束日期
        // 所以我们在这里只返回开始时间的字符串（对于第一个Date对象）和结束时间的字符串（对于第二个Date对象）
        return date === dateRange[0] ? startTime : endTime;
    });
}

// 处理带时区的日期搜索范围区间，转为年月日:20240627
export function formatDateNumRangeWithTimes(dateRange) {
    if (!Array.isArray(dateRange) || dateRange.length !== 2) {
        throw new Error('dateRange must be an array with two Date objects');
    }

    return dateRange.map(date => {
        // 使用 padStart 方法确保月份、日期、小时、分钟和秒始终是两位数
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() 返回的是从0开始的月份
        const day = String(date.getDate()).padStart(2, '0');

        // 对于开始时间，直接使用上述值
        let startTime = `${year}${month}${day}`;

        let endTime = `${year}${month}${day}`;

        // 因为我们只需要开始时间的字符串对于开始日期，和结束时间的字符串对于结束日期
        // 所以我们在这里只返回开始时间的字符串（对于第一个Date对象）和结束时间的字符串（对于第二个Date对象）
        return date === dateRange[0] ? startTime : endTime;
    });
}