<template>
    <el-container style="height: 100vh;">
        <el-main>
            <div class="qrcode-container" style="display: flex; flex-direction: column; align-items: center;">
                <!-- 展示二维码 -->
                <div class="qrcode">
                    <img :src="qrcodeUrl" alt="QR Code" style="width: 200px; height: 200px;"/>
                </div>
                <!-- 输入框 -->
                <el-input
                    v-model="inputValue"
                    placeholder="请输入绑定信息"
                    style="margin-top: 20px; width: 300px;"
                ></el-input>
                <!-- 按钮 -->
                <div style="display: flex; justify-content: center; margin-top: 20px;">
                    <el-button type="success" @click="bindAction">绑定</el-button>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script setup>
import {getCurrentInstance, onMounted, ref} from 'vue';
import { useRoute } from 'vue-router';

const {proxy} = getCurrentInstance();

// 假设这是你的二维码生成逻辑，这里只是一个示例
const qrcodeUrl = ref(''); // 初始二维码图片URL
const inputValue = ref(''); // 绑定输入框的值

const route = useRoute();

onMounted(() => {
    let secret = route.query.secret;

    GetQR({secret:secret})
});

const GetQR = async (params) => {
    let res = await proxy.$api.getCaptchaQr(params)
    qrcodeUrl.value = res.img;
}

const bindAction = async () => {
    let uid = route.query.uid;
    let res = await proxy.$api.bindGoogleCaptcha({uid:parseInt(uid),"code":inputValue.value});

    if (res) {
        ElMessage({
            showClose: true,
            message: "绑定成功",
            type: "success",
        });
    }
}
</script>

<style>
/* 可以添加一些自定义样式 */
.qrcode-container {
    text-align: center;
    padding: 20px;
}
</style>