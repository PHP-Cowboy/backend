<template>
    <div class="user-header">
        <el-form :inline="true" :model="formInline">

        </el-form>
    </div>
    <div class="table">
        <el-table :data="list" style="width: 100%">
            <el-table-column
                v-for="item in tableLabel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width ? item.width : 160"
            />
        </el-table>
    </div>

</template>


<script>
import {
    defineComponent,
    getCurrentInstance,
    onMounted,
    ref,
    reactive,
} from "vue";
import {string} from "mockjs/src/mock/random/basic.js";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const channels = ref([])
        const tableLabel = reactive([
            {
                prop: "user_name",
                label: "用户昵称",
            },
            {
                prop: "uid",
                label: "用户ID",
            },
            {
                prop: "room_id",
                label: "房间id",
            },
            {
                prop: "desk_id",
                label: "桌子id",
            },
            {
                prop: "before_cash",
                label: "变化前cash",
            },
            {
                prop: "before_win_cash",
                label: "变化前winCash",
            },
            {
                prop: "cash",
                label: "赠送金币账户",
            },
            {
                prop: "win_cash",
                label: "充值金币账户",
            },
            {
                prop: "nums",
                label: "变动数额(分)",
            },
            {
                prop: "tax",
                label: "税收",
            },
            {
                prop: "balance",
                label: "账户余额",
            },
        ]);

        onMounted(() => {
            getFundsFlowSlot(config);
        });
        const config = reactive({});

        const getFundsFlowSlot = async (config) => {
            let res = await proxy.$api.getFundsFlowSlot(config);

            list.value = res.list;
        };
        const formInline = reactive({});

        return {
            list,
            tableLabel,
            config,
            formInline,
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
