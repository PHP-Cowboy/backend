// 设置异步延迟间隔
export function delay(interval = 0) {
    return new Promise(resolve => {
        let timer = setTimeout(_ => {
            clearTimeout(timer)
            resolve()
        }, interval)
    })
}

// 按照二进制读取文件
export function readFile(file) {
    return new Promise(resolve => {
        let reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = e => {
            resolve(e.target.result)
        }
    })
}

// 字段对应表
export let character = {
    name: {
        text: '姓名',
        type: 'string'
    },
    phone: {
        text: '电话',
        type: 'string'
    }
}

export let slot = {
    RoomId: {
        text: '房间',
        type: 'number'
    },
    BetRange: {
        text: '下注范围',
        type: 'array'
    },
    GoldPDownLimit: {
        text: '金池下限',
        type: 'number'
    },

    GoldPUpLimit: {
        text: '金池上限',
        type: 'number'
    },
    MinWinContral: {
        text: '最低正控参数/千分数',
        type: 'number'
    },
    MaxWinContral: {
        text: '最高正控参数/千分数',
        type: 'number'
    },
    MinLoseContral: {
        text: '最低负控参数/千分数',
        type: 'number'
    },
    MaxLoseContral: {
        text: '最高负控参数/千分数',
        type: 'number'
    },
    RaiseRange: {
        text: '增长值范围',
        type: 'array'
    },
    RaiseTime: {
        text: '增长间隔时间/秒',
        type: 'array'
    },
    AutoJackpotValue: {
        text: '自动爆奖池值',
        type: 'number'
    },
    AutoJackpotRate: {
        text: '自动爆奖池几率/千分比',
        type: 'number'
    },
    AutoJackpotRange: {
        text: '自动爆出比例/千分比',
        type: 'array'
    },
    MinJackpot: {
        text: '奖池保底值',
        type: 'number'
    },
    UnlockTimes: {
        text: '解锁次数',
        type: 'number'
    },
    AITake: {
        text: 'AI带入范围',
        type: 'array'
    },
    PoolTax: {
        text: '暗税比例/千分比',
        type: 'number'
    },
    AINumber: {
        text: 'AI人数区间',
        type: 'array'
    },
    AIPlayTime: {
        text: 'AI时间(秒)',
        type: 'array'
    },
    JackPotFloorTime: {
        text: '奖池体验的判断轮数',
        type: 'number'
    },
    FreeSpinFloorTime: {
        text: '免费游戏体验的判断轮数',
        type: 'number'
    },
    JackPotRate: {
        text: '奖池体验的几率/千分比',
        type: 'number'
    },
    FreeSpinRate: {
        text: '免费游戏体验的几率/千分比',
        type: 'number'
    },
    JackPotOdds: {
        text: '奖池体验触发倍数',
        type: 'number'
    },
    FreeSpinOdds: {
        text: '免费游戏体验触发倍数',
        type: 'number'
    },
}

// 时间字符串格式化
export function formatTime(str, tpl) {
    let arr = str.match(/\d+/g).map(item => {
        return item.length < 2 ? '0' + item : item
    })
    tpl = tpl || '{0}年{1}月{2}日 {3}时{4}分{5}秒'
    return tpl.replace(/\{(\d+)\}/g, (_, group) => {
        return arr[group] || '00'
    })
}
