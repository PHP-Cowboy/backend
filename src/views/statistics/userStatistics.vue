<template>

    <div class="card-container">
        <el-card class="horizontal-card">
            <div slot="header" class="centered-text-with-line">
                <span>新增注册</span>
            </div>

            <div class="numbers" :style="fiveData.today.reg_num >= fiveData.yesterday.reg_num ? 'color:red': 'color:green'">
                <p>
                    今日：
                    <span class="today-number">
                        {{fiveData.today.reg_num}}
                    </span>
                </p>
            </div>
            <div class="numbers">
                <p>
                    昨日：
                    <span class="yesterday-number">
                        {{fiveData.yesterday.reg_num}}
                    </span>
                </p>
            </div>

            <div v-if="fiveData.today.reg_num !== 0 || fiveData.yesterday.reg_num !== 0 ">
                <div :style="fiveData.today.reg_num >= fiveData.yesterday.reg_num ? 'color:red': 'color:green'">
                    <p>
                        {{ fiveData.yesterday.reg_num === 0 ? '100%' : ((fiveData.today.reg_num - fiveData.yesterday.reg_num) * 100 / fiveData.yesterday.reg_num).toFixed(2) + "%" }}
                    </p>
                </div>

                <span>
                    <el-icon v-if="fiveData.today.reg_num >= fiveData.yesterday.reg_num" color="red" size="40"><Top /></el-icon>
                    <el-icon v-if="fiveData.today.reg_num < fiveData.yesterday.reg_num" color="green" size="40"><Bottom /></el-icon>
                </span>
            </div>

        </el-card>

        <el-card class="horizontal-card">
            <div slot="header" class="centered-text-with-line">
                <span>在线人数</span>
            </div>

            <div class="numbers" :style="fiveData.today.online_num >= fiveData.yesterday.online_num ? 'color:red': 'color:green'">
                <p>
                    今日：
                    <span class="today-number">
                        {{fiveData.today.online_num}}
                    </span>
                </p>
            </div>
            <div class="numbers">
                <p>
                    昨日：
                    <span class="yesterday-number">
                        {{fiveData.yesterday.online_num}}
                    </span>
                </p>
            </div>

            <div v-if="fiveData.today.online_num !== 0 || fiveData.yesterday.online_num !== 0 ">
                <div :style="fiveData.today.online_num >= fiveData.yesterday.online_num ? 'color:red': 'color:green'">
                    <p>
                        {{ fiveData.yesterday.online_num === 0 ? '100%' : ((fiveData.today.online_num - fiveData.yesterday.online_num) * 100 / fiveData.yesterday.online_num).toFixed(2) + "%" }}
                    </p>
                </div>

                <span>
                    <el-icon v-if="fiveData.today.online_num >= fiveData.yesterday.online_num" color="red" size="40"><Top /></el-icon>
                    <el-icon v-if="fiveData.today.online_num < fiveData.yesterday.online_num" color="green" size="40"><Bottom /></el-icon>
                </span>
            </div>
        </el-card>

        <el-card class="horizontal-card">
            <div slot="header" class="centered-text-with-line">
                <span>活跃人数</span>
            </div>

            <div class="numbers" :style="fiveData.today.active_num >= fiveData.yesterday.active_num ? 'color:red': 'color:green'">
                <p>
                    今日：
                    <span class="today-number">
                        {{fiveData.today.active_num}}
                    </span>
                </p>
            </div>
            <div class="numbers">
                <p>
                    昨日：
                    <span class="yesterday-number">
                        {{fiveData.yesterday.active_num}}
                    </span>
                </p>
            </div>
            <div v-if="fiveData.today.active_num !== 0 || fiveData.yesterday.active_num !== 0 ">
                <div :style="fiveData.today.active_num >= fiveData.yesterday.active_num ? 'color:red': 'color:green'">
                    <p>
                        {{ fiveData.yesterday.active_num === 0 ? '100%' : ((fiveData.today.active_num - fiveData.yesterday.active_num) * 100 / fiveData.yesterday.active_num).toFixed(2) + "%"}}
                    </p>
                </div>

                <span>
                    <el-icon v-if="fiveData.today.active_num >= fiveData.yesterday.active_num" color="red" size="40"><Top /></el-icon>
                    <el-icon v-if="fiveData.today.active_num < fiveData.yesterday.active_num" color="green" size="40"><Bottom /></el-icon>
                </span>
            </div>
        </el-card>

        <el-card class="horizontal-card">
            <div slot="header" class="centered-text-with-line">
                <span>付费人数</span>
            </div>

            <div class="numbers" :style="fiveData.today.pay_num >= fiveData.yesterday.pay_num ? 'color:red': 'color:green'">
                <p>
                    今日：
                    <span class="today-number">
                        {{fiveData.today.pay_num}}
                    </span>
                </p>
            </div>
            <div class="numbers">
                <p>
                    昨日：
                    <span class="yesterday-number">
                        {{fiveData.yesterday.pay_num}}
                    </span>
                </p>
            </div>
            <div v-if="fiveData.today.pay_num !== 0 || fiveData.yesterday.pay_num !== 0 ">
                <div :style="fiveData.today.pay_num >= fiveData.yesterday.pay_num ? 'color:red': 'color:green'">
                    <p>
                        {{ fiveData.yesterday.pay_num === 0 ? '100%' : ((fiveData.today.pay_num - fiveData.yesterday.pay_num) * 100 / fiveData.yesterday.pay_num).toFixed(2) + "%"}}
                    </p>
                </div>

                <span>
                    <el-icon v-if="fiveData.today.pay_num >= fiveData.yesterday.pay_num" color="red" size="40"><Top /></el-icon>
                    <el-icon v-if="fiveData.today.pay_num < fiveData.yesterday.pay_num" color="green" size="40"><Bottom /></el-icon>
                </span>
            </div>
        </el-card>

        <el-card class="horizontal-card">
            <div slot="header" class="centered-text-with-line">
                <span>付费额度</span>
            </div>

            <div class="numbers" :style="fiveData.today.pay_amount >= fiveData.yesterday.pay_amount ? 'color:red': 'color:green'">
                <p>
                    今日：
                    <span class="today-number">
                        {{fiveData.today.pay_amount / 100}}
                    </span>
                </p>
            </div>
            <div class="numbers">
                <p>
                    昨日：
                    <span class="yesterday-number">
                        {{fiveData.yesterday.pay_amount / 100}}
                    </span>
                </p>
            </div>
            <div v-if="fiveData.today.pay_amount !== 0 || fiveData.yesterday.pay_amount !== 0 ">
                <div :style="fiveData.today.pay_amount >= fiveData.yesterday.pay_amount ? 'color:red': 'color:green'">
                    <p>
                        {{ fiveData.yesterday.pay_amount === 0 ? '100%' : ((fiveData.today.pay_amount - fiveData.yesterday.pay_amount) * 100 / fiveData.yesterday.pay_amount).toFixed(2) + "%" }}
                    </p>
                </div>

                <span>
                    <el-icon v-if="fiveData.today.pay_amount >= fiveData.yesterday.pay_amount" color="red" size="40"><Top /></el-icon>
                    <el-icon v-if="fiveData.today.pay_amount < fiveData.yesterday.pay_amount" color="green" size="40"><Bottom /></el-icon>
                </span>
            </div>
        </el-card>

        <el-card class="horizontal-card">
            <div slot="header" class="centered-text-with-line">
                <span>赠送金币额度</span>
            </div>

            <div class="numbers" :style="fiveData.today.give_amount >= fiveData.yesterday.give_amount ? 'color:red': 'color:green'">
                <p>
                    今日：
                    <span class="today-number">
                        {{fiveData.today.give_amount / 100}}
                    </span>
                </p>
            </div>
            <div class="numbers">
                <p>
                    昨日：
                    <span class="yesterday-number">
                        {{fiveData.yesterday.give_amount / 100}}
                    </span>
                </p>
            </div>

            <div v-if="fiveData.today.give_amount !== 0 || fiveData.yesterday.give_amount !== 0 ">
                <div :style="fiveData.today.give_amount >= fiveData.yesterday.give_amount ? 'color:red': 'color:green'">
                    <p>
                        {{ fiveData.yesterday.give_amount === 0 ? '100%' : ((fiveData.today.give_amount - fiveData.yesterday.give_amount) * 100 / fiveData.yesterday.give_amount).toFixed(2) + "%"}}
                    </p>
                </div>

                <span>
                    <el-icon v-if="fiveData.today.give_amount >= fiveData.yesterday.give_amount" color="red" size="40"><Top /></el-icon>
                    <el-icon v-if="fiveData.today.give_amount < fiveData.yesterday.give_amount" color="green" size="40"><Bottom /></el-icon>
                </span>
            </div>
        </el-card>

        <el-card class="horizontal-card">
            <div slot="header" class="centered-text-with-line">
                <span>顺差</span>
            </div>

            <div class="numbers" :style="fiveData.today.pay_amount - fiveData.today.give_amount >= fiveData.yesterday.pay_amount - fiveData.yesterday.give_amount ? 'color:red': 'color:green'">
                <p>
                    今日：
                    <span class="today-number">
                        {{(fiveData.today.pay_amount - fiveData.today.give_amount) / 100}}
                    </span>
                </p>
            </div>
            <div class="numbers">
                <p>
                    昨日：
                    <span class="yesterday-number">
                        {{(fiveData.yesterday.pay_amount - fiveData.yesterday.give_amount)  / 100}}
                    </span>
                </p>
            </div>
            <div v-if="fiveData.today.pay_amount - fiveData.today.give_amount !== 0 || fiveData.yesterday.pay_amount - fiveData.yesterday.give_amount !== 0 ">
                <div :style="fiveData.today.pay_amount - fiveData.today.give_amount >= fiveData.yesterday.pay_amount - fiveData.yesterday.give_amount ? 'color:red': 'color:green'">
                    <p>
                        {{fiveData.yesterday.pay_amount - fiveData.yesterday.give_amount === 0 ? '100%' : ((fiveData.today.pay_amount - fiveData.today.give_amount - (fiveData.yesterday.pay_amount - fiveData.yesterday.give_amount)) * 100 / (fiveData.yesterday.pay_amount - fiveData.yesterday.give_amount)).toFixed(2) + "%"}}
                    </p>
                </div>

                <span>
                    <el-icon v-if="fiveData.today.pay_amount - fiveData.today.give_amount >= fiveData.yesterday.pay_amount - fiveData.yesterday.give_amount" color="red" size="40"><Top /></el-icon>
                    <el-icon v-if="fiveData.today.pay_amount - fiveData.today.give_amount < fiveData.yesterday.pay_amount - fiveData.yesterday.give_amount" color="green" size="40"><Bottom /></el-icon>
                </span>
            </div>
        </el-card>
    </div>

    <div class="user-header">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-date-picker
                    v-model="formInline.betweenDate"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :size="size"
                />
            </el-form-item>
            <el-form-item
                prop="channel"
                clearable
            >
                <el-select v-model="formInline.channel" multiple placeholder="请选择渠道" clearable>
                    <el-option v-for="type in channels" :label="type.channel_name" :value="type.id"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="list" style="width: 100%">
            <el-table-column
                v-for="item in tableLabel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width ? item.width : 120"
            />
        </el-table>
    </div>

</template>


<script>
import {defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref,} from "vue";
import {formatDateNumRangeWithTimes} from "../../assets/js/utils/time_util.js";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const channels = ref([])
        const fiveData = reactive({yesterday:{reg_num:0},today:{reg_num:0}})
        const tableLabel = reactive([
            {
                prop: "ymd",
                label: "日期",
            },
            {
                prop: "channel_name",
                label: "渠道名称",
            },
            {
                prop: "daily_active_user",
                label: "DAU",
            },
            {
                prop: "effective_add_nums",
                label: "有效新增用户数",
            },
            {
                prop: "add_nums",
                label: "新增用户数",
            },

            //新用户充值金币数
            // {
            //     prop: "new_add_user_recharge_coin_num" ,
            //     label: "新用户充值金币数",
            // },
            //新用户充值金币率
            {
                prop: "new_add_user_recharge_rate" ,
                label: "新用户充值金币率",
            },
            //新用户付费人数
            {
                prop: "new_add_user_recharge_people" ,
                label: "新用户付费人数",
            },

            //新用户付费总额
            {
                prop: "new_add_user_recharge_amount" ,
                label: "新用户付费总额",
            },

            {
                prop: "new_add_user_average_revenue_per_user",
                label: "新用户ARPU",
            },
            {
                prop: "new_add_user_average_revenue_per_paying_user",
                label: "新用户Arppu",
            },

            //DAU付费总额 daily_active_user_recharge_amount
            {
                prop: "daily_active_user_recharge_amount",
                label: "DAU付费总额",
            },
            //DAU Arpu
            {
                prop: "daily_active_user_average_revenue_per_user",
                label: "DAU Arpu",
            },
            //DAU Arppu
            {
                prop: "daily_active_user_average_revenue_per_paying_user",
                label: "DAU Arppu",
            },
            //老用户充值金币人数
            {
                prop: "old_user_recharge_people_num",
                label: "老用户充值金币人数",
            },
            //老用户充值金币率
            {
                prop: "old_user_recharge_rate",
                label: "老用户充值金币率",
            },
            //付费用户留存率
            {
                prop: "paid_user_retention_rate",
                label: "付费用户留存率",
            },
            //赠送金币人数
            {
                prop: "give_money_people",
                label: "赠送金币人数",
            },
            //赠送金币额
            {
                prop: "give_money_amount",
                label: "赠送金币额",
            },
            //赠送金币率
            {
                prop: "give_money_rate",
                label: "赠送金币率",
            },
            //玩牌率
            {
                prop: "play_rate",
                label: "玩牌率",
            },

            {
                prop: "next_day_retention",
                label: "次留",
            },
            {
                prop: "three_day_retention",
                label: "3留",
            },
            {
                prop: "four_day_retention",
                label: "4留",
            },

            {
                prop: "five_day_retention",
                label: "5留",
            },

            {
                prop: "six_day_retention",
                label: "6留",
            },

            {
                prop: "seven_day_retention",
                label: "7留",
            },
            {
                prop: "fourteen_day_retention",
                label: "14留",
            },
        ]);
        const timer = ref(null);

        onMounted(() => {
            formInline.channel = ref([0])
            config.channel = formInline.channel;
            getFiveMinuteData(config)
            getUserStatistics(config);
            getRoleChannel();
            // 设置定时器，每五分钟执行一次 fetchData 函数
            timer.value = setInterval(getFiveMinuteData, 5 * 60 * 1000); // 5分钟
        });

        // 在组件销毁前清除定时器
        onBeforeUnmount(() => {
            if (timer.value) {
                clearInterval(timer.value);
                timer.value = null;
            }
        });

        const config = reactive({});
        const getRoleChannel = async () => {
            let res = await proxy.$api.getRoleChannel();
            let channelList = [{id:0,channel_name:"all channel"}];

            res.forEach((item)=>{
                channelList.push({id:item.id,channel_name:item.channel_name})
            });

            channels.value = channelList;
        };

        const getFiveMinuteData = async (config) => {

            let res = await proxy.$api.getFiveMinuteData(config);

            fiveData.yesterday = res.yesterday
            fiveData.today = res.today

        };

        const getUserStatistics = async (config) => {
            let res = await proxy.$api.getUserStatistics(config);

            list.value = res.list.map((item) => {
                item.new_add_user_recharge_rate = (item.new_add_user_recharge_rate * 100).toFixed(2) + "%";
                item.old_user_recharge_rate = (item.old_user_recharge_rate * 100).toFixed(2) + "%";
                item.paid_user_retention_rate = (item.paid_user_retention_rate * 100).toFixed(2) + "%";
                item.give_money_rate = (item.give_money_rate * 100).toFixed(2) + "%";
                item.play_rate = (item.play_rate * 100).toFixed(2) + "%";
                item.next_day_retention = (item.next_day_retention * 100).toFixed(2) + "%";
                item.three_day_retention = (item.three_day_retention * 100).toFixed(2) + "%";
                item.four_day_retention = (item.four_day_retention * 100).toFixed(2) + "%";
                item.five_day_retention = (item.five_day_retention * 100).toFixed(2) + "%";
                item.six_day_retention = (item.six_day_retention * 100).toFixed(2) + "%";
                item.seven_day_retention = (item.seven_day_retention * 100).toFixed(2) + "%";
                item.fourteen_day_retention = (item.fourteen_day_retention * 100).toFixed(2) + "%";
                item.new_add_user_average_revenue_per_user = item.new_add_user_average_revenue_per_user.toFixed(2);
                item.daily_active_user_average_revenue_per_user = item.daily_active_user_average_revenue_per_user.toFixed(2);
                return item;
            });
        };

        const formInline = reactive({});
        const handleSearch = () => {

            let config = {};//日期 clear 时，手动重置config

            if (typeof formInline.ymd !== undefined && typeof formInline.ymd !== "undefined" && formInline.ymd != null){
                let d = new Date(formInline.ymd);
                let ymd = String(d.getFullYear()) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0')
                config.ymd = Number(ymd)
            }

            if (formInline.betweenDate === undefined || formInline.betweenDate === null){
                delete config.betweenDate;
            }else {
                config.betweenDate = formatDateNumRangeWithTimes(formInline.betweenDate);
            }

            if (typeof formInline.channel !== undefined){
                config.channel = formInline.channel;
            }

            getUserStatistics(config);
            getFiveMinuteData(config);
        };

        return {
            list,
            channels,
            fiveData,
            tableLabel,
            config,
            formInline,
            handleSearch,
        };
    },
});
</script>

<style lang="less" scoped>
.table {
    position: relative;
    height: 520px;
}

.user-header {
    display: flex;
    justify-content: space-between;
}

.numbers span {
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
}

.card-container {
    display: flex;
    flex-wrap: wrap; /* 如果需要换行 */
    justify-content: space-between; /* 控制卡片之间的水平间距 */
}

.horizontal-card {
    flex: 180 180 auto; /* 不放大、不缩小、自动宽度 */
    margin-bottom: 20px; /* 控制卡片之间的垂直间距 */
    /* 其他卡片样式 */
}

.horizontal-card .right-aligned {
    position: absolute;
    right: 80%; /* 距离右侧边界20% */
    top: 50%; /* 如果需要垂直居中，可以使用这个值，但还需要 transform 调整 */
    transform: translateY(-50%); /* 如果 top 设置为 50%，则使用此值垂直居中 */
}

.centered-text-with-line {
    position: relative; /* 相对于自身定位伪元素 */
    text-align: center; /* 如果需要文本居中 */
    margin-bottom: 20px; /* 可选，为水平线添加一些间距 */
}

/* 使用伪元素来添加虚线 */
.centered-text-with-line::after {
    content: ''; /* 伪元素内容为空 */
    display: block; /* 使其成为块级元素 */
    width: 100%; /* 宽度为父元素宽度 */
    height: 1px; /* 高度为 1px */
    background-color: #ccc; /* 背景色为灰色，可根据需要调整 */
    position: absolute; /* 绝对定位 */
    bottom: -10px; /* 紧贴 div 底部 */
    left: 0; /* 紧贴 div 左侧 */
}

</style>
