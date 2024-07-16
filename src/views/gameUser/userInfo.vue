<template>
    <hr>
    个人信息
    <el-row>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />用户id：{{userInfo.uid}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple-light" />用户昵称：{{userInfo.user_name}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />手机号：{{userInfo.phone}}</el-col>
    </el-row>
    <el-row>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />绑定邮箱：{{userInfo.email}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple-light" />上级信息：暂无</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />下级信息：暂无</el-col>
    </el-row>
    <hr>
    金币相关信息
    <el-row>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />总帐号金额：{{userInfo.win_cash + userInfo.cash}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple-light" />可赠送金币账号金额：{{userInfo.win_cash}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />充值金币账号金额：{{userInfo.cash}}</el-col>
    </el-row>
    <el-row>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />累计充值金币：{{userInfo.recharge}}<el-button @click="editRecharge">修改</el-button></el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple-light" />累计赠送金币：{{userInfo.withdraw}}</el-col>
    </el-row>

    <hr>
    <el-row>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />昨日充值金币：{{userInfo.yesterday_recharge}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple-light" />昨日赠送金币：{{userInfo.yesterday_withdraw}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />今日充值金币：{{userInfo.today_recharge}}</el-col>
    </el-row>
    <el-row>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />今日赠送金币：{{userInfo.today_withdraw}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple-light" />今日最大充值金币：{{userInfo.today_recharge_max}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />今日最大赠送金币：{{userInfo.today_withdraw_max}}</el-col>
    </el-row>
    <el-row>
        <el-col :span="8"><div class="grid-content ep-bg-purple" /><el-button @click="onEditUserCoin">添加货币</el-button></el-col>
    </el-row>

    <hr>
    注册登录信息
    <el-row>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />注册渠道：{{userInfo.channel}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple-light" />渠道id：{{userInfo.channel_id}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />注册时间：{{userInfo.created_at}}</el-col>
    </el-row>
    <el-row>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />注册Gaid：{{userInfo.gaid}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple-light" />注册版本号：{{userInfo.reg_version}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />最后登录时间：{{userInfo.updated_at}}</el-col>
    </el-row>
    <el-row>
        <el-col :span="8">
            <div class="grid-content ep-bg-purple" />
            注册设备号：{{userInfo.device}}
            <div v-if="userInfo.deviceStatus === 0">
                <el-button @click="banned(2,userInfo.uid,userInfo.device)">
                    封禁
                </el-button>
            </div>

            <div v-if="userInfo.deviceStatus === 1">
                <el-button @click="unseal(2,userInfo.uid,userInfo.device)">
                    解封
                </el-button>
            </div>

        </el-col>
        <el-col :span="8">
            <div class="grid-content ep-bg-purple-light" />
            注册IP：{{userInfo.reg_ip}}
            <div v-if="userInfo.regIpStatus === 0">
                <el-button @click="banned(1,userInfo.uid,userInfo.reg_ip)">
                    封禁
                </el-button>
            </div>

            <div v-if="userInfo.regIpStatus === 1">
                <el-button @click="unseal(1,userInfo.uid,userInfo.reg_ip)">
                    解封
                </el-button>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="grid-content ep-bg-purple" />
            最后登录IP：{{userInfo.login_ip}}
            <div v-if="userInfo.lastLoginStatus === 0">
                <el-button @click="banned(3,userInfo.uid,userInfo.login_ip)">
                    封禁
                </el-button>
            </div>

            <div v-if="userInfo.lastLoginStatus === 1">
                <el-button @click="unseal(3,userInfo.uid,userInfo.login_ip)">
                    解封
                </el-button>
            </div>
        </el-col>
    </el-row>

    <hr>
    玩家绑定信息
    <el-row>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />姓名：{{userInfo.name}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple-light" />手机号：{{userInfo.mobile}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />邮箱：{{userInfo.email}}</el-col>
    </el-row>
    <el-row>
        <el-col :span="8"><div class="grid-content ep-bg-purple" />赠送金币账号：{{userInfo.account}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple-light" />身份信息审核录入：{{userInfo.id_card}}</el-col>
        <el-col :span="8"><div class="grid-content ep-bg-purple" /><el-button @click="openWithdrawInfo">修改记录查询</el-button></el-col>
    </el-row>

    <hr>
    游戏战况
    <el-table :data="list" style="width: 100%">
        <el-table-column prop="game_name" label="游戏玩法" width="180" />
        <el-table-column prop="room_type" label="房间类型" width="180" />
        <el-table-column prop="total" label="总局数" />
        <el-table-column prop="win_num" label="赢局数" />
        <el-table-column prop="win_rate" label="游戏胜率" />
        <el-table-column prop="win_money" label="总赢" />
        <el-table-column prop="loss_money" label="总输" />
        <el-table-column prop="sum_win_loss" label="纯输赢" />
    </el-table>

    <el-dialog
        v-model="dialogVisible"
        title="修改累计充值金额"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formRecharge" ref="roomForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="累计充值额度"
                    >
                        <el-input disabled v-model.number="formRecharge.recharge"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item
                        label="修改后的总额"
                        prop="edit_recharge"
                        :rules="[{ required: true, message: '修改后的总额是必填项' }]"
                    >
                        <el-input v-model.number="formRecharge.edit_recharge" placeholder="请输入修改后的总额"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row style="justify-content: flex-end">
                <el-form-item>
                    <el-button type="primary" @click="handleCancel">取消</el-button>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>


    <el-dialog
        v-model="editUserCoin"
        title="用户金币调整"
        width="45%"
        :before-close="editUserCoinClose"
    >
        <el-form :inline="true" :model="formEditUserCoin" ref="editUserCoinForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="金币类型"
                        prop="coin_type"
                        :rules="[{ required: true, message: '金币类型是必选项' }]"
                    >
                        <el-select v-model="formEditUserCoin.coin_type" placeholder="请选择">
                            <el-option v-for="type in coinTypeArr" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item
                        label="操作类型"
                        prop="op_type"
                        :rules="[{ required: true, message: '操作类型是必选项' }]"
                    >
                        <el-select v-model="formEditUserCoin.op_type" placeholder="请选择">
                            <el-option v-for="type in opTypeArr" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="数量"
                        prop="num"
                        :rules="[{ required: true, message: '数量是必填项' }]"
                    >
                        <el-input v-model.number="formEditUserCoin.num" placeholder="请输入数量"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item
                        label="当前持有数量"
                        prop="current_num"
                    >
                        <el-input disabled v-model.number="formEditUserCoin.current_num" placeholder="请输入数量"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <hr>

            <el-row>
                <el-col :span="24">
                    <el-form-item
                        label="邮件标题"
                        prop="title"
                        :rules="[{ required: true, message: '邮件标题是必填项' }]"
                    >
                        <el-input v-model="formEditUserCoin.title" placeholder="请输入邮件标题"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="邮件内容"
                        prop="msg"
                        :rules="[{ required: true, message: '邮件内容是必填项' }]"
                    >
                        <textarea rows="20" cols="100" v-model="formEditUserCoin.msg" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row style="justify-content: flex-end">
                <el-form-item>
                    <el-button type="primary" @click="editUserCoinClose">取消</el-button>
                    <el-button type="primary" @click="editUserCoinSubmit">确定</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>


    <el-dialog
        v-model="withdrawInfo"
        title="银行卡号记录"
        width="55%"
        :before-close="withdrawInfoClose"
    >
        <el-table :data="withdrawInfoList" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="180" />
            <el-table-column prop="phone" label="手机号" width="180" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="account_no" label="赠送金币账号" />
            <el-table-column prop="vpa" label="身份信息审核录入" />
            <el-table-column prop="updated_at" label="修改时间" />
        </el-table>

    </el-dialog>

</template>

<script>
import {
    defineComponent,
    getCurrentInstance,
    onMounted,
    ref,
    reactive,
} from "vue";

import { useRoute } from 'vue-router';

export default defineComponent({
    setup(){
        const {proxy} = getCurrentInstance();
        const route = useRoute();
        const userInfo = ref({})
        let list = ref([]);
        let withdrawInfoList = ref([]);
        const dialogVisible = ref(false)
        const editUserCoin = ref(false)
        const withdrawInfo = ref(false)
        // 添加的form数据
        const formRecharge = reactive({});
        const formEditUserCoin = reactive({});
        const coinTypeArr = [
            {label:"winCash",value:1},
            {label:"cash",value:2},
            {label:"bonus",value:3},
        ];

        const opTypeArr = [
            {label:"add",value:1},
            {label:"sub",value:2},
        ]


        onMounted(() => {
            // 从URL的查询参数中获取传递的值
            let uid = route.query.uid;
            getGameUserInfo(uid)
        });

        const editRecharge = () => {
            dialogVisible.value = true
        }

        const onSubmit = () => {
            proxy.$refs.roomForm.validate(async (valid) => {
                formRecharge.uid = userInfo.value.uid
                if (valid) {
                    let res = await proxy.$api.changeRecharge(formRecharge);
                    if (res) {
                        ElMessage({
                            showClose: true,
                            message: "新增成功",
                            type: "success",
                        });
                        dialogVisible.value = false;
                        proxy.$refs.roomForm.resetFields();
                        getRoomList(config);
                    }
                } else {
                    ElMessage({
                        showClose: true,
                        message: "请输入正确的内容",
                        type: "error",
                    });
                }
            });
        };
        const handleCancel = () => {
            dialogVisible.value = false;
        }

        const onEditUserCoin = () => {
            formEditUserCoin.current_num = userInfo.value.win_cash + userInfo.value.cash + userInfo.value.bonus
            editUserCoin.value = true
        }

        const editUserCoinClose = () => {
            editUserCoin.value = false
        }

        const editUserCoinSubmit = () => {
            editUserCoin.value = false
            proxy.$refs.editUserCoinForm.validate(async (valid) => {
                formEditUserCoin.uid = userInfo.value.uid
                if (valid) {
                    let res = await proxy.$api.editUserCoin(formEditUserCoin);
                    if (res) {
                        ElMessage({
                            showClose: true,
                            message: "新增成功",
                            type: "success",
                        });
                        dialogVisible.value = false;
                        proxy.$refs.editUserCoinForm.resetFields();
                        getRoomList(config);
                        getGameUserInfo(uid)
                    }
                } else {
                    ElMessage({
                        showClose: true,
                        message: "请输入正确的内容",
                        type: "error",
                    });
                }
            });
        }

        const openWithdrawInfo = async () => {
            withdrawInfo.value = true
            let res = await proxy.$api.withdrawInfoRecord({"uid":userInfo.value.uid,"page":1,"size":10});
            console.log(res)

            withdrawInfoList.value = res.list
        }

        const withdrawInfoClose = () => {
            withdrawInfo.value = false
        }

        const getGameUserInfo = async (uid)=>{
            let res = await proxy.$api.getGameUserInfo({"uid":uid});
            userInfo.value = res;

            res.list.map((item)=>{
                item.win_rate = Math.round(item.win_num * 100 / item.total).toFixed(2);
                item.sum_win_loss = item.win_money - item.loss_money;
            });

            list.value = res.list

            Object.assign(formRecharge,{recharge:res.recharge})

        }

        const banned = async(cate,uid,info) => {
            if (cate <= 0 || info === ""){
                ElMessage({
                    showClose: true,
                    message: "相关数据为空",
                    type: "info",
                });
                return
            }

            ElMessageBox.confirm("确认封禁吗？").then(()=>{
                let res = proxy.$api.banned({"cate":cate,"uid":uid,"info":info})

                if (res) {
                    ElMessage({
                        showClose: true,
                        message: "封禁成功",
                        type: "success",
                    });
                    getGameUserInfo(uid)
                }else {
                    ElMessage({
                        showClose: true,
                        message: "封禁失败",
                        type: "error",
                    });
                }
            }).catch(()=>{
                // ElMessage({
                //     showClose: true,
                //     message: "error",
                //     type: "error",
                // });
            });
        }

        const unseal = async(cate,uid,info) => {
            if (cate <= 0 || info === ""){
                ElMessage({
                    showClose: true,
                    message: "相关数据为空",
                    type: "info",
                });
                return
            }

            ElMessageBox.confirm("确认解封吗？").then(()=>{
                let res = proxy.$api.unseal({"cate":cate,"uid":uid,"info":info})

                if (res) {
                    ElMessage({
                        showClose: true,
                        message: "解封成功",
                        type: "success",
                    });
                    getGameUserInfo(uid)
                }else {
                    ElMessage({
                        showClose: true,
                        message: "解封失败",
                        type: "error",
                    });
                }
            }).catch(()=>{
                // ElMessage({
                //     showClose: true,
                //     message: "error",
                //     type: "error",
                // });
            });
        }

        return {
            userInfo,
            list,
            editRecharge,
            dialogVisible,
            formRecharge,
            formEditUserCoin,
            onSubmit,
            handleCancel,
            editUserCoin,
            onEditUserCoin,
            editUserCoinClose,
            editUserCoinSubmit,
            withdrawInfo,
            openWithdrawInfo,
            withdrawInfoClose,
            withdrawInfoList,
            coinTypeArr,
            opTypeArr,
            banned,
            unseal,
        }
    }
})

</script>