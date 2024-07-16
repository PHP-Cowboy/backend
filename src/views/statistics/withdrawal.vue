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
                :width="item.width ? item.width : 170"
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
            },
            {
                prop: "channel_name",
                label: "渠道",
            },
            {
                prop: "withdrawal_nums",
                label: "提现用户数",
            },
            {
                prop: "withdrawal_total",
                label: "提现总额(分)",
            },
            {
                prop: "new_user_withdrawal_nums",
                label: "新用户提现用户数",
            },
            {
                prop: "new_user_withdrawal_total",
                label: "新用户提现总额",
            },
            {
                prop: "new_user_withdrawal_rate",
                label: "新用户提现率",
            },
            {
                prop: "old_user_withdrawal_nums",
                label: "老用户提现用户数",
            },
            {
                prop: "old_user_withdrawal_total",
                label: "老用户提现总额(分)",
            },
            {
                prop: "old_user_withdrawal_rate",
                label: "老用户提现率",
            },
        ]);

        onMounted(() => {
            // getWithdrawalStatistics(config);
            getRoleChannel();
        });
        const config = reactive({});
        const getRoleChannel = async () => {
            channels.value = await proxy.$api.getRoleChannel();
        };

        const getWithdrawalStatistics = async (config) => {
            let res = await proxy.$api.getWithdrawalStatistics(config);

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

            getWithdrawalStatistics(config);
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
