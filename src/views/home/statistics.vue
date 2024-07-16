<template>
    <div class="user-header">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-date-picker v-model="formInline.ymd" type="Date" clearable placeholder="请输入日期"/>
            </el-form-item>
            <el-form-item
                prop="channel"
                clearable
            >
                <el-select v-model="formInline.channel" placeholder="请选择渠道" clearable>
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
                :width="item.width ? item.width : 110"
            />
        </el-table>
    </div>

</template>


<script>
import {defineComponent, getCurrentInstance, onMounted, reactive, ref,} from "vue";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const channels = ref([])
        const tableLabel = reactive([
            {
                prop: "ymd",
                label: "日期",
                width:80,
            },
            {
                prop: "channel_name",
                label: "渠道",
                width:80,
            },
            {
                prop: "new_device_num",
                label: "新增设备",
            },
            {
                prop: "add_nums",
                label: "新增注册",
            },
            {
                prop: "effective_add_nums",
                label: "有效注册",
            },
            {
                prop: "new_paying_money",
                label: "新增付费额度",
            },
            {
                prop: "daily_active_user",
                label: "活跃人数",
            },
            {
                prop: "strong_active_num",
                label: "强活跃人数",
            },
            {
                prop: "paying_subscribers",
                label: "付费人数",
            },
            {
                prop: "total_payment",
                label: "日付费额度(分)",
            },
            {
                prop: "average_revenue_per_user",
                label: "ARPU(分)",
            },
            {
                prop: "average_revenue_per_paying_user",
                label: "ARPPU",
            },
            {
                prop: "next_day_retention",
                label: "次日留存",
            },
            {
                prop: "three_day_retention",
                label: "三日留存",
            },
            {
                prop: "seven_day_retention",
                label: "七日留存",
            },
            {
                prop: "fourteen_day_retention",
                label: "十四日留存",
            },
            {
                prop: "thirty_day_retention",
                label: "三十日留存",
            },
            {
                prop: "ninety_day_retention",
                label: "九十日留存",
            },
        ]);

        onMounted(() => {
            // getUserStatistics(config);
            getRoleChannel();
        });
        const config = reactive({});
        const getRoleChannel = async () => {
            channels.value = await proxy.$api.getRoleChannel();
        };

        const getUserStatistics = async (config) => {
            let res = await proxy.$api.getUserStatistics(config);

            list.value = res.list;
        };
        const formInline = reactive({});
        const handleSearch = () => {

            let config = {};//日期 clear 时，手动重置config

            if (typeof formInline.ymd !== undefined && typeof formInline.ymd !== "undefined" && formInline.ymd != null){
                let d = new Date(formInline.ymd);
                let ymd = String(d.getFullYear()) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0')
                config.ymd = Number(ymd)
            }

            if (typeof formInline.channel !== undefined){
                config.channel = formInline.channel;
            }

            getUserStatistics(config);
        };

        return {
            list,
            channels,
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
</style>
