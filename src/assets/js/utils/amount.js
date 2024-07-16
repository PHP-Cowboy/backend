export function convertCentsToYuan(cents){
    // 确保传入的参数是数值类型
    if (typeof cents !== 'number' || isNaN(cents)) {
        throw new Error('请输入有效的数值（以分为单位）');
    }

    // 将分转换为元
    const yuan = cents / 100;

    // 可以选择是否保留两位小数，这里使用toFixed(2)来保留两位小数
    // 注意：toFixed返回的是字符串，如果需要数字类型，可以使用parseFloat或Number()转换
    return yuan.toFixed(2);

    // 如果需要返回数字类型（没有小数尾随的0），可以使用以下方法
    // return Number(yuan.toFixed(2));
}