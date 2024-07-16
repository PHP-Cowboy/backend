<template>
    <div class="user-header">
        <el-button v-if="!onOff" type="success" @click="onOffToggle(0)" plain>开启礼包</el-button>
        <el-button v-if="onOff" type="warning" @click="onOffToggle(1)" plain>关闭礼包</el-button>
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
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)"
                    >编辑
                    </el-button
                    >
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
        :title="action === 'add' ? '新增充200送200配置' : '编辑充200送200配置'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formRechargeGift" ref="rechargeGiftForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="基础奖励"
                        prop="basic_rewards"
                        :rules="[{ required: true, message: '基础奖励是必填项' }]"
                    >
                        <el-input v-model.number="formRechargeGift.basic_rewards" maxlength="9" placeholder="请输入基础奖励"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item
                        label="基础奖励类别"
                        prop="basic_type"
                        :rules="[{ required: true, message: '基础奖励类别是必填项' }]"
                    >
                        <el-select v-model="formRechargeGift.basic_type" placeholder="请选择基础奖励类别">
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
                        <el-input v-model.number="formRechargeGift.gift_rewards" maxlength="9" placeholder="请输入赠送额度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="赠送额度类别"
                        prop="gift_type"
                        :rules="[{ required: true, message: '赠送额度类别是必填项' }]"
                    >
                        <el-select v-model="formRechargeGift.gift_type" placeholder="请选择赠送额度类别">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="gift2_rewards"
                        prop="gift2_rewards"
                        :rules="[{ required: true, message: '赠送额度2是必填项' }]"
                    >
                        <el-input v-model.number="formRechargeGift.gift2_rewards"  maxlength="9" placeholder="请输入赠送额度2"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="折扣比例"
                        prop="ratio"
                        :rules="[{ required: true, message: '折扣比例是必填项' }]"
                    >
                        <el-input v-model.number="formRechargeGift.ratio" maxlength="9" placeholder="请输入折扣比例"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="总额度"
                        prop="total"
                        :rules="[{ required: true, message: '总额度是必填项' }]"
                    >
                        <el-input v-model.number="formRechargeGift.total" maxlength="9" placeholder="请输入总额度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="价格"
                        prop="price"
                        :rules="[{ required: true, message: '价格是必填项' }]"
                    >
                        <el-input v-model.number="formRechargeGift.price" maxlength="9" placeholder="请输入总额度"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="间隔时长(s)"
                        prop="interval"
                        :rules="[{ required: true, message: '间隔时长(s)是必填项' }]"
                    >
                        <el-input v-model.number="formRechargeGift.interval" maxlength="9" placeholder="请输入间隔时长(s)"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="出现次数"
                        prop="times"
                        :rules="[{ required: true, message: '出现次数是必填项' }]"
                    >
                        <el-input v-model.number="formRechargeGift.times" maxlength="6" placeholder="请输入出现次数"/>
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
        const onOff = ref(false)
        const tableLabel = reactive([
            {
                prop: "id",
                label: "ID",
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
                prop: "gift2_rewards",
                label: "赠送额度2",
            },
            {
                prop: "gift2_type",
                label: "赠送额度2类别",
            },
            {
                prop: "total",
                label: "总额度",
            },
            {
                prop: "price",
                label: "价格",
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
            rechargeGiftStatus()
            getRechargeGiftList(config);
        });

        const rechargeGiftStatus = async() => {
            onOff.value = await proxy.$api.rechargeGiftStatus();
        }

        const onOffToggle = async (status) => {
            ElMessageBox.confirm("确定?")
                .then(() => {
                    let res = proxy.$api.onOffRechargeGift({status:status});

                    if (res) {
                        ElMessage({
                            showClose: true,
                            message: "操作成功",
                            type: "success",
                        });
                    }
                    onOff.value = !status

                    // rechargeGiftStatus()
                })
                .catch(() => {
                    // catch error
                });


        }

        const config = reactive({

        });
        const getRechargeGiftList = async (config) => {
            let res = await proxy.$api.getRechargeGiftList(config);
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

                switch (item.gift2_type){
                    case 1:
                        item.gift2_type = "cash"
                        break

                    case 2:
                        item.gift2_type = "bonus"
                        break

                    case 3:
                        item.gift2_type = "giftCash"
                        break
                }

                return item;
            });
        };
        const changePage = (page) => {
            config.page = page;
            getRechargeGiftList(config);
        };


        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getRechargeGiftList(config);
        }

        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.rechargeGiftForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加用户的form数据
        const formRechargeGift = reactive({});
        // 添加用户
        const onSubmit = () => {
            proxy.$refs.rechargeGiftForm.validate(async (valid) => {
                switch (formRechargeGift.basic_type) {
                    case "cash":
                        formRechargeGift.basic_type = 1
                        break

                    case "bonus":
                        formRechargeGift.basic_type = 2
                        break

                    case "giftCash":
                        formRechargeGift.basic_type = 3
                        break
                }

                switch (formRechargeGift.gift_type) {
                    case "cash":
                        formRechargeGift.gift_type = 1
                        break

                    case "bonus":
                        formRechargeGift.gift_type = 2
                        break

                    case "giftCash":
                        formRechargeGift.gift_type = 3
                        break
                }

                switch (formRechargeGift.gift2_type) {
                    case "cash":
                        formRechargeGift.gift2_type = 1
                        break

                    case "bonus":
                        formRechargeGift.gift2_type = 2
                        break

                    case "giftCash":
                        formRechargeGift.gift2_type = 3
                        break
                }

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveRechargeGift(formRechargeGift);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.rechargeGiftForm.resetFields();
                            getRechargeGiftList(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.saveRechargeGift(formRechargeGift);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.rechargeGiftForm.resetFields();
                            getRechargeGiftList(config);
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
            proxy.$refs.rechargeGiftForm.resetFields();
            reset()
        };
        const reset = () => {
            formRechargeGift.id = 0;//编辑时携带的id未被重置
            formRechargeGift.created_at = "";
            formRechargeGift.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑用户
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formRechargeGift, row);
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
                    await proxy.$api.delRechargeGift({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getRechargeGiftList(config);
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
            dialogVisible,
            handleClose,
            formRechargeGift,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleAdd,
            handleDelete,
            coinTypes,
            onOff,
            onOffToggle,
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
