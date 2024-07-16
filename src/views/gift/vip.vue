<template>
    <div class="user-header">
        <el-button type="primary" plain @click="handleAdd">+新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input v-model="formInline.keyword" placeholder="请输入用户名"/>
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
                :width="item.width ? item.width : 150"
            />
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" plain size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
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

    <el-dialog
        v-model="dialogVisible"
        :title="action === 'add' ? '新增VIP配置' : '编辑VIP配置'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formVip" ref="vipForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="VIP等级"
                        prop="level"
                        :rules="[{ required: true, message: 'VIP等级是必填项' }]"
                    >
                        <el-input v-model.number="formVip.level" maxlength="2" placeholder="请输入VIP等级"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="升级所需经验"
                        prop="need_exp"
                        :rules="[{ required: true, message: '升级所需经验是必填项' }]"
                    >
                        <el-input v-model.number="formVip.need_exp" maxlength="9" placeholder="请输入升级所需经验"/>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="每日提现次数"
                        prop="withdraw_nums"
                        :rules="[{ required: true, message: '每日提现次数是必填项' }]"
                    >
                        <el-input v-model.number="formVip.withdraw_nums" maxlength="2" placeholder="请输入每日提现次数"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="每日提现金额"
                        prop="withdraw_money"
                        :rules="[{ required: true, message: '每日提现金额是必填项' }]"
                    >
                        <el-input v-model.number="formVip.withdraw_money" maxlength="9" placeholder="请输入每日提现金额"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="每日奖品数量"
                        prop="day_prize_nums"
                        :rules="[{ required: true, message: '每日奖品数量是必填项' }]"
                    >
                        <el-input v-model.number="formVip.day_prize_nums" maxlength="9" placeholder="请输入每日奖品数量"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="每日奖品类型"
                        prop="day_prize_type"
                        :rules="[{ required: true, message: '每日奖品类型是必填项' }]"
                    >
                        <el-select v-model="formVip.day_prize_type" placeholder="请选择每日奖品类型">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="每周奖品数量"
                        prop="week_prize_nums"
                        :rules="[{ required: true, message: '每周奖品数量是必填项' }]"
                    >
                        <el-input v-model.number="formVip.week_prize_nums" maxlength="9" placeholder="请输入每周奖品数量"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="每周奖品类型"
                        prop="week_prize_type"
                        :rules="[{ required: true, message: '每周奖品类型是必填项' }]"
                    >
                        <el-select v-model="formVip.week_prize_type" placeholder="请选择每周奖品类型">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="每月奖品数量"
                        prop="month_prize_nums"
                        :rules="[{ required: true, message: '每月奖品数量是必填项' }]"
                    >
                        <el-input v-model.number="formVip.month_prize_nums" maxlength="9" placeholder="请输入每月奖品数量"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="每月奖品类型"
                        prop="month_prize_type"
                        :rules="[{ required: true, message: '每月奖品类型是必填项' }]"
                    >
                        <el-select v-model="formVip.month_prize_type" placeholder="请选择每月奖品类型">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
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
                width:50,
            },
            {
                prop: "level",
                label: "等级",
                width:60,
            },
            {
                prop: "need_exp",
                label: "升级所需经验",
            },
            {
                prop: "withdraw_nums",
                label: "每日提现次数",
            },
            {
                prop: "withdraw_money",
                label: "每日提现金额",
            },
            {
                prop: "day_prize_type",
                label: "每日奖品类型",
            },
            {
                prop: "day_prize_nums",
                label: "每日奖品数量",
            },
            {
                prop: "week_prize_type",
                label: "每周奖品类型",
            },
            {
                prop: "week_prize_nums",
                label: "每周奖品数量",
            },
            {
                prop: "month_prize_type",
                label: "每月奖品类型",
            },
            {
                prop: "month_prize_nums",
                label: "每月奖品数量",
            },
        ]);
        const coinTypes = [
            {label: "cash", value: 1},
            {label: "bonus", value: 2},
            {label: "giftCash", value: 3},
        ];
        onMounted(() => {
            // getVipList(config);
        });
        const config = reactive({
            level: "",
        });
        const getVipList = async (config) => {
            let res = await proxy.$api.getVipList(config);
            list.value = res.map((item) => {
                switch (item.day_prize_type){
                    case 1:
                        item.day_prize_type = "cash"
                        break

                    case 2:
                        item.day_prize_type = "bonus"
                        break

                    case 3:
                        item.day_prize_type = "giftCash"
                        break
                }

                switch (item.week_prize_type){
                    case 1:
                        item.week_prize_type = "cash"
                        break

                    case 2:
                        item.week_prize_type = "bonus"
                        break

                    case 3:
                        item.week_prize_type = "giftCash"
                        break
                }

                switch (item.month_prize_type){
                    case 1:
                        item.month_prize_type = "cash"
                        break

                    case 2:
                        item.month_prize_type = "bonus"
                        break

                    case 3:
                        item.month_prize_type = "giftCash"
                        break
                }

                return item;
            });
        };
        const changePage = (page) => {
            config.page = page;
            getVipList(config);
        };

        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getVipList(config);
        }

        const formInline = reactive({
            keyword: "",
        });
        const handleSearch = () => {
            config.level = formInline.keyword;
            getVipList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.vipForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加用户的form数据
        const formVip = reactive({});
        const formDict = reactive({});
        // 添加用户
        const onSubmit = () => {
            proxy.$refs.vipForm.validate(async (valid) => {

                switch (formVip.day_prize_type) {
                    case "cash":
                        formVip.day_prize_type = 1
                        break

                    case "bonus":
                        formVip.day_prize_type = 2
                        break

                    case "giftCash":
                        formVip.day_prize_type = 3
                        break
                }

                switch (formVip.week_prize_type) {
                    case "cash":
                        formVip.week_prize_type = 1
                        break

                    case "bonus":
                        formVip.week_prize_type = 2
                        break

                    case "giftCash":
                        formVip.week_prize_type = 3
                        break
                }

                switch (formVip.month_prize_type) {
                    case "cash":
                        formVip.month_prize_type = 1
                        break

                    case "bonus":
                        formVip.month_prize_type = 2
                        break

                    case "giftCash":
                        formVip.month_prize_type = 3
                        break
                }


                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveVip(formVip);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.vipForm.resetFields();
                            getVipList(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.saveVip(formVip);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.vipForm.resetFields();
                            getVipList(config);
                        }
                    }
                    reset()
                } else {
                    ElMessage({
                        showClose: true,
                        message: "请输入正确的内容",
                        type: "error",
                    });
                }
            });
        };
        // 取消
        const handleCancel = () => {
            dialogVisible.value = false;
            proxy.$refs.vipForm.resetFields();
            reset()
        };
        const reset = () => {
            formVip.id = 0;//编辑时携带的id未被重置
            formVip.created_at = "";
            formVip.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑用户
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formVip, row);
            });
        };
        // 新增用户
        const handleAdd = () => {
            action.value = "add";
            dialogVisible.value = true;
        };
        // 删除用户
        const handleDelete = (row) => {
            ElMessageBox.confirm("你确定删除吗?",{"autofocus": false})
                .then(async () => {
                    await proxy.$api.delVip({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getVipList(config);
                })
                .catch(() => {
                    // catch error
                });
        };
        return {
            list,
            tableLabel,
            config,
            changePage,
            handleSizeChange,
            formInline,
            handleSearch,
            dialogVisible,
            handleClose,
            formVip,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleAdd,
            handleDelete,
            coinTypes,
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
