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
                    <el-button type="primary" @click="updateQRCode">更新二维码</el-button>
                    <el-button type="success" @click="bindAction">绑定</el-button>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script setup>
import {getCurrentInstance, onMounted, ref} from 'vue';

const {proxy} = getCurrentInstance();

// 假设这是你的二维码生成逻辑，这里只是一个示例
const qrcodeUrl = ref(''); // 初始二维码图片URL
const inputValue = ref(''); // 绑定输入框的值

onMounted(() => {
    GetQR()
});

const GetQR = async () => {
    let res = await proxy.$api.getCaptchaQrBySecret()
    qrcodeUrl.value = res.img;
}

const updateQRCode = async () => {
    let res = await proxy.$api.updateUserGoogleCaptcha();

    // 这里只是简单更换URL
    qrcodeUrl.value = res.img;
}


const bindAction = async () => {
    let res = await proxy.$api.bindGoogleCaptcha({"code":inputValue.value});

    if (res) {
        ElMessage({
            showClose: true,
            message: "绑定成功",
            type: "success",
        });

        router.push({ name: "home" });
    }
}
</script>

<style scoped>
/* 可以添加一些自定义样式 */
.qrcode-container {
    text-align: center;
    padding: 20px;
}
</style>