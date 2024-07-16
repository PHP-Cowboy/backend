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
                :width="item.width ? item.width : 105"
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
        :title="action === 'add' ? '新增充值礼包配置' : '编辑充值礼包配置'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formRechargePack" ref="rechargePackForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="游戏id"
                        prop="game_id"
                        :rules="[{ required: true, message: '游戏id是必填项' }]"
                    >
                        <el-input v-model.number="formRechargePack.game_id" maxlength="18" placeholder="请输入游戏id"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="房间id"
                        prop="room_id"
                        :rules="[{ required: true, message: '房间id是必填项' }]"
                    >
                        <el-input v-model.number="formRechargePack.room_id" maxlength="18" placeholder="请输入房间id"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="价格"
                        prop="price"
                        :rules="[{ required: true, message: '价格是必填项' }]"
                    >
                        <el-input v-model.number="formRechargePack.price" maxlength="9" placeholder="请输入价格"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="总额度"
                        prop="total"
                        :rules="[{ required: true, message: '总额度是必填项' }]"
                    >
                        <el-input v-model.number="formRechargePack.total" maxlength="9" placeholder="请输入总额度"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="基础奖励"
                        prop="basic_rewards"
                        :rules="[{ required: true, message: '基础奖励是必填项' }]"
                    >
                        <el-input v-model.number="formRechargePack.basic_rewards" maxlength="9" placeholder="请输入基础奖励"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="基础奖励类别"
                        prop="basic_type"
                        :rules="[{ required: true, message: '基础奖励类别是必填项' }]"
                    >
                        <el-select v-model="formRechargePack.basic_type" placeholder="请选择基础奖励类别">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="赠送额度"
                        prop="gift_rewards"
                        :rules="[{ required: true, message: '赠送额度是必填项' }]"
                    >
                        <el-input v-model.number="formRechargePack.gift_rewards" maxlength="9" placeholder="请输入赠送额度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="赠送额度类别"
                        prop="gift_type"
                        :rules="[{ required: true, message: '赠送额度类别是必填项' }]"
                    >
                        <el-select v-model="formRechargePack.gift_type" placeholder="请选择赠送额度类别">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="bonus"
                        prop="bonus"
                        :rules="[{ required: true, message: 'bonus是必填项' }]"
                    >
                        <el-input v-model.number="formRechargePack.bonus" maxlength="9" placeholder="请输入bonus额度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="折扣比例"
                        prop="ratio"
                        :rules="[{ required: true, message: '折扣比例是必填项' }]"
                    >
                        <el-input v-model.number="formRechargePack.ratio" maxlength="9" placeholder="请输入折扣比例"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="出现次数"
                        prop="times"
                        :rules="[{ required: true, message: '出现次数是必填项' }]"
                    >
                        <el-input v-model.number="formRechargePack.times" maxlength="9" placeholder="请输入出现次数"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="间隔时长(s)"
                        prop="interval"
                        :rules="[{ required: true, message: '间隔时长(s)是必填项' }]"
                    >
                        <el-input v-model.number="formRechargePack.interval" maxlength="9" placeholder="请输入间隔时长(s)"/>
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
            },
            {
                prop: "game_id",
                label: "游戏id",
            },
            {
                prop: "room_id",
                label: "房间id",
            },
            {
                prop: "price",
                label: "价格",
            },
            {
                prop: "basic_rewards",
                label: "基础奖励",
            },
            {
                prop: "basic_type",
                label: "基础奖励类别",
            },
            {
                prop: "gift_rewards",
                label: "赠送额度",
            },
            {
                prop: "gift_type",
                label: "赠送额度类别",
            },
            {
                prop: "bonus",
                label: "bonus",
            },
            {
                prop: "total",
                label: "总额度",
            },
            {
                prop: "times",
                label: "出现次数",
            },
            {
                prop: "interval",
                label: "间隔时长(s)",
            },
            {
                prop: "ratio",
                label: "折扣比例",
            },
        ]);
        const coinTypes = [
            {label: "cash", value: 1},
            {label: "bonus", value: 2},
            {label: "giftCash", value: 3},
        ];
        onMounted(() => {
            // getRechargePackList(config);
        });
        const config = reactive({
            game_id: "",
        });
        const getRechargePackList = async (config) => {
            let res = await proxy.$api.getRechargePackList(config);
            list.value = res.map((item) => {
                switch (item.basic_type){
                    case 1:
                        item.basic_type = "cash"
                        break

                    case 2:
                        item.basic_type = "bonus"
                        break

                    case 3:
                        item.basic_type = "giftCash"
                        break
                }

                switch (item.gift_type){
                    case 1:
                        item.gift_type = "cash"
                        break

                    case 2:
                        item.gift_type = "bonus"
                        break

                    case 3:
                        item.gift_type = "giftCash"
                        break
                }

                switch (item.bonus_type){
                    case 1:
                        item.bonus_type = "cash"
                        break

                    case 2:
                        item.bonus_type = "bonus"
                        break

                    case 3:
                        item.bonus_type = "giftCash"
                        break
                }

                return item;
            });
        };
        const changePage = (page) => {
            config.page = page;
            getRechargePackList(config);
        };

        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getRechargePackList(config);
        }

        const formInline = reactive({
            keyword: "",
        });
        const handleSearch = () => {
            config.game_id = formInline.keyword;
            getRechargePackList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.rechargePackForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加用户的form数据
        const formRechargePack = reactive({});
        // 添加用户
        const onSubmit = () => {
            proxy.$refs.rechargePackForm.validate(async (valid) => {

                switch (formRechargePack.basic_type) {
                    case "cash":
                        formRechargePack.basic_type = 1
                        break

                    case "bonus":
                        formRechargePack.basic_type = 2
                        break

                    case "giftCash":
                        formRechargePack.basic_type = 3
                        break
                }

                switch (formRechargePack.gift_type) {
                    case "cash":
                        formRechargePack.gift_type = 1
                        break

                    case "bonus":
                        formRechargePack.gift_type = 2
                        break

                    case "giftCash":
                        formRechargePack.gift_type = 3
                        break
                }

                switch (formRechargePack.bonus_type) {
                    case "cash":
                        formRechargePack.bonus_type = 1
                        break

                    case "bonus":
                        formRechargePack.bonus_type = 2
                        break

                    case "giftCash":
                        formRechargePack.bonus_type = 3
                        break
                }


                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveRechargePack(formRechargePack);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.rechargePackForm.resetFields();
                            getRechargePackList(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.saveRechargePack(formRechargePack);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.rechargePackForm.resetFields();
                            getRechargePackList(config);
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
            proxy.$refs.rechargePackForm.resetFields();
            reset()
        };
        const reset = () => {
            formRechargePack.id = 0;//编辑时携带的id未被重置
            formRechargePack.created_at = "";
            formRechargePack.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑用户
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formRechargePack, row);
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
                    await proxy.$api.delRechargePack({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getRechargePackList(config);
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
            formRechargePack,
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
