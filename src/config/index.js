/**
 * 环境配置文件
 * 一般在企业级项目里面有三个环境
 * 开发环境
 * 测试环境
 * 线上环境
 */
// 当前的环境
const env = import.meta.env.MODE || 'pro'

const EnvConfig = {
    development: {
        baseApi: 'http://192.168.0.9:9001/v1/',
    },
    test: {
        baseApi: 'http://192.168.0.254:9001/v1/',
    },
    pro: {
        baseApi: 'https://gm.tpgolden.xyz/v1/',
    },
    pre: {
        baseApi: 'https://gm.tpgolden.online/v1/',
    },
    in: {
        baseApi: 'https://gm.teenpatticarnival.in/v1/',
    },
}

export default {
    env,
    ...EnvConfig[env]
}

