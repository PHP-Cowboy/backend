<template>
    <el-form :model="loginForm" class="login-container">
        <h3>系统登录</h3>
        <el-form-item>
            <el-input
                type="input"
                placeholder="请输入账号"
                v-model="loginForm.username"
            >
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input
                type="password"
                placeholder="请输入密码"
                v-model="loginForm.password"
            >
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input
                type="input"
                placeholder="请输入谷歌验证码"
                v-model="loginForm.captcha"
            >
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" :loading="loading" @click="handleLogin">登录</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import { reactive, ref,getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
    setup() {
        const loginForm = reactive({
            username: "",
            password: "",
            captcha: "",
        });

        const {proxy} = getCurrentInstance();
        const loading = ref(false);
        const store = useStore();
        const router = useRouter();

        const handleLogin = async () => {
            try {
                loading.value = true;
                // await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟异步操作
                const res = await proxy.$api.login(loginForm); // 假设你已经有了 api.login 的定义
                loading.value = false;

                store.commit("setToken", res.token);
                store.commit("setMenu", res.menu);
                store.commit("addMenu", router);

                router.push({ name: "home" });

            } catch (error) {
                // 处理错误，例如显示错误消息
                loading.value = false;
                alert("登录失败：" + res.msg);
            }
        };

        return {
            loginForm,
            loading,
            handleLogin,
        };
    },
};
</script>
<style lang="less" scoped>
.login-container {
    width: 350px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 15px;
    padding: 35px 35px 15px 35px;
    box-shadow: 0 0 25px #cacaca;
    margin: 180px auto;

    h3 {
        text-align: center;
        margin-bottom: 20px;
        color: #505450;
    }

    :deep(.el-form-item__content) {
        justify-content: center;
    }
}
</style>