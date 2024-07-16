import axios from 'axios'
import config from '../config'
import {ElMessage} from 'element-plus'
import store from "../store/index.js";
import Cookie from "js-cookie";

const NETWORK_ERROR = '网络请求异常,请稍后重试.....'
// 创建一个axios实例对象
const service = axios.create({})


// 在请求之前做一些事情
service.interceptors.request.use((req) => {
    // 可以自定义header
    req.headers['Content-Type'] = 'application/json'
    // jwt-token认证的时候
    if (Cookie.get('token') !== "") {
        req.headers['Authorization'] = `Bearer ${Cookie.get('token')}`
    }
    return req
})

// 在请求之后做一些事情
service.interceptors.response.use((res) => {
    const {code, data, msg} = res.data
    // 根据后端 协商  视情况而定
    if (code === 200) {
        return data
    } else {
        // 网络请求错误
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

// 封装的核心函数
function request(options) {
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data
    }

    service.defaults.baseURL = config.baseApi

    return service(options)
}

export default request