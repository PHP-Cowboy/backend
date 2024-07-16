<template>
    <div class="user-header">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-input v-model.number="formInline.uid" maxlength="12" clearable placeholder="请输入用户ID"/>
            </el-form-item>
            <el-form-item>
                <el-input v-model.number="formInline.ifsc" clearable maxlength="32" placeholder="请输入卡号"/>
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
                :width="item.width ? item.width : 130"
            />
        </el-table>

        <el-pagination
            v-model:current-page="config.page"
            v-model:page-size="config.size"
            :page-sizes="[10, 20, 50, 100,1000,5000]"
            :small="small"
            :disabled="false"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="config.total"
            @size-change="handleSizeChange"
            @current-change="changePage"
            class="pager mt-4"
        />
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

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const tableLabel = reactive([
            {
                prop: "id",
                label: "ID",
            },
            {
                prop: "uid",
                label: "用户ID",
            },
            {
                prop: "bank_code",
                label: "银行编码",
            },
            {
                prop: "bank_name",
                label: "银行名称",
            },
            {
                prop: "account_no",
                label: "账号",
            },
            {
                prop: "ifsc",
                label: "卡号",
            },
            {
                prop: "name",
                label: "客户名称",
            },
            {
                prop: "email",
                label: "客户邮箱",
                width:260,
            },
            {
                prop: "phone",
                label: "客户手机",
            },
            {
                prop: "address",
                label: "地址",
            },
            {
                prop: "vpa",
                label: "ipu账号",
            },
            {
                prop: "remark",
                label: "备注",
            },
        ]);


        onMounted(() => {
            // getPayBankList(config);
        });

        const getPayBankList = async (config) => {
            let res = await proxy.$api.getPayBankList(config);

            config.total = res.total

            list.value = res.list
        };
        const formInline = reactive({});
        const handleSearch = () => {
            config.uid = formInline.uid;
            config.ifsc = formInline.ifsc;
            getPayBankList(config);
        };

        const config = reactive({
            size:10,
            total:0,
        });
        const changePage = (page) => {
            config.page = page;
            getPayBankList(config);
        };

        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getPayBankList(config);
        }

        return {
            list,
            tableLabel,
            config,
            formInline,
            handleSearch,
            changePage,
            handleSizeChange,
        };
    },
});
</script>

<style lang="less" scoped>
.table {
    position: relative;
    height: 660px;
}

.user-header {
    display: flex;
    justify-content: space-between;
}
</style>
