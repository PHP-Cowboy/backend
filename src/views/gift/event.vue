<template>
    <div class="user-header">
        <el-button type="primary" plain @click="handleAdd">+新增</el-button>
        <el-button v-if="!onOff" type="success" @click="onOffToggle(0)" plain>开启礼包</el-button>
        <el-button v-if="onOff" type="warning" @click="onOffToggle(1)" plain>关闭礼包</el-button>

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

    </div>
    <el-dialog
        v-model="dialogVisible"
        :title="action === 'add' ? '新增二选一礼包配置' : '编辑二选一礼包配置'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formEvent" ref="eventForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="档次值"
                        prop="grade"
                        :rules="[{ required: true, message: '档次值是必填项' }]"
                    >
                        <el-input v-model.number="formEvent.grade" maxlength="9" placeholder="请输入档次值"/>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="游戏币"
                        prop="coin"
                        :rules="[{ required: true, message: '游戏币是必填项' }]"
                    >
                        <el-input v-model.number="formEvent.coin" maxlength="9" placeholder="请输入游戏币"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="游戏币类别"
                        prop="coin_type"
                        :rules="[{ required: true, message: '游戏币类别是必填项' }]"
                    >
                        <el-select v-model="formEvent.coin_type" placeholder="请选择游戏币类别">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="赠送额度"
                        prop="gift_limit"
                        :rules="[{ required: true, message: '赠送额度是必填项' }]"
                    >
                        <el-input v-model.number="formEvent.gift_limit" maxlength="9" placeholder="请输入赠送额度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="赠送类别"
                        prop="gift_type"
                        :rules="[{ required: true, message: '赠送类别是必填项' }]"
                    >
                        <el-select v-model="formEvent.gift_type" placeholder="请选择赠送类别">
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
                        <el-input v-model.number="formEvent.bonus" maxlength="9" placeholder="请输入bonus额度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="折扣比例"
                        prop="ratio"
                        :rules="[{ required: true, message: '折扣比例是必填项' }]"
                    >
                        <el-input v-model.number="formEvent.ratio" maxlength="9" placeholder="请输入折扣比例"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>

                <el-col :span="12">
                    <el-form-item
                        label="档位"
                        prop="type"
                        :rules="[{ required: true, message: '档位是必填项' }]"
                    >
                        <el-select v-model="formEvent.type" placeholder="请选择档位">
                            <el-option v-for="gt in gradeTypes" :label="gt.label" :value="gt.value"/>
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
        const onOff = ref(false)
        const tableLabel = reactive([
            {
                prop: "id",
                label: "ID",
            },
            {
                prop: "grade",
                label: "档次值",
            },
            {
                prop: "coin",
                label: "游戏币",
            },
            {
                prop: "coin_type",
                label: "游戏币类别",
            },
            {
                prop: "gift_limit",
                label: "赠送额度",
            },
            {
                prop: "gift_type",
                label: "赠送类别",
            },
            {
                prop: "bonus",
                label: "bonus",
            },
            {
                prop: "ratio",
                label: "折扣比例",
            },
            {
                prop: "type",
                label: "档次",
            },
        ]);
        const coinTypes = [
            {label: "cash", value: 1},
            {label: "bonus", value: 2},
            {label: "giftCash", value: 3},
        ];
        const gradeTypes = [
            {label: "低档", value: 1},
            {label: "高档", value: 2},
        ];
        onMounted(() => {
            eventStatus()
            // getEventList(config);
        });

        const eventStatus = async() => {
            onOff.value = await proxy.$api.eventStatus();
        }

        const onOffToggle = async (status) => {
            ElMessageBox.confirm("确定?")
                .then(() => {
                    let res = proxy.$api.onOffEvent({status:status});

                    if (res) {
                        ElMessage({
                            showClose: true,
                            message: "操作成功",
                            type: "success",
                        });
                    }
                    onOff.value = !status

                    // eventStatus()
                })
                .catch(() => {
                    // catch error
                });


        }

        const config = reactive({
            grade: "",
        });
        const getEventList = async (config) => {
            let res = await proxy.$api.getEventList(config);
            list.value = res.map((item) => {
                switch (item.coin_type){
                    case 1:
                        item.coin_type = "cash"
                        break

                    case 2:
                        item.coin_type = "bonus"
                        break

                    case 3:
                        item.coin_type = "giftCash"
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
            getEventList(config);
        };
        const formInline = reactive({
            keyword: "",
        });
        const handleSearch = () => {
            config.grade = formInline.keyword;
            getEventList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.eventForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加用户的form数据
        const formEvent = reactive({});
        // 添加用户
        const onSubmit = () => {
            proxy.$refs.eventForm.validate(async (valid) => {
                switch (formEvent.coin_type) {
                    case "cash":
                        formEvent.coin_type = 1
                        break

                    case "bonus":
                        formEvent.coin_type = 2
                        break

                    case "giftCash":
                        formEvent.coin_type = 3
                        break
                }

                switch (formEvent.gift_type) {
                    case "cash":
                        formEvent.gift_type = 1
                        break

                    case "bonus":
                        formEvent.gift_type = 2
                        break

                    case "giftCash":
                        formEvent.gift_type = 3
                        break
                }

                switch (formEvent.bonus_type) {
                    case "cash":
                        formEvent.bonus_type = 1
                        break

                    case "bonus":
                        formEvent.bonus_type = 2
                        break

                    case "giftCash":
                        formEvent.bonus_type = 3
                        break
                }

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveEvent(formEvent);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.eventForm.resetFields();
                            getEventList(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.saveEvent(formEvent);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.eventForm.resetFields();
                            getEventList(config);
                        }
                    }
                    reset();
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
            proxy.$refs.eventForm.resetFields();
            reset()
        };
        const reset = () => {
            formEvent.id = 0;//编辑时携带的id未被重置
            formEvent.created_at = "";
            formEvent.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑用户
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formEvent, row);
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
                    await proxy.$api.delEvent({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getEventList(config);
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
            formInline,
            handleSearch,
            dialogVisible,
            handleClose,
            formEvent,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleAdd,
            handleDelete,
            coinTypes,
            gradeTypes,
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
    //justify-content: space-between;
}
</style>
