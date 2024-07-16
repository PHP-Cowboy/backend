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
                :width="item.width ? item.width : 150"
            />
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
        :title="action === 'add' ? '新增三选一礼包配置' : '编辑三选一礼包配置'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formOnly" ref="onlyForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="档位"
                        prop="grade"
                        :rules="[{ required: true, message: '档位是必填项' }]"
                    >
                        <el-input v-model.number="formOnly.grade" maxlength="9" placeholder="请输入档位"/>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="第一天可领值"
                        prop="first_day"
                        :rules="[{ required: true, message: '第一天可领值是必填项' }]"
                    >
                        <el-input v-model.number="formOnly.first_day" maxlength="9" placeholder="请输入第一天可领值"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="第一天可领值类别"
                        prop="first_type"
                        :rules="[{ required: true, message: '第一天可领值类别是必填项' }]"
                    >
                        <el-select v-model="formOnly.first_type" placeholder="请选择第一天可领值类别">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="第二天可领值"
                        prop="next_day"
                        :rules="[{ required: true, message: '第二天可领值是必填项' }]"
                    >
                        <el-input v-model.number="formOnly.next_day" maxlength="9" placeholder="请输入第二天可领值"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="第二天可领值类别"
                        prop="next_type"
                        :rules="[{ required: true, message: '第二天可领值类别是必填项' }]"
                    >
                        <el-select v-model="formOnly.next_type" placeholder="请选择第二天可领值类别">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="第三天可领值"
                        prop="third_day"
                        :rules="[{ required: true, message: '第三天可领值是必填项' }]"
                    >
                        <el-input v-model.number="formOnly.third_day" maxlength="9" placeholder="请输入第三天可领值额度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="第三天可领值类别"
                        prop="third_type"
                        :rules="[{ required: true, message: '第三天可领值类别是必填项' }]"
                    >
                        <el-select v-model="formOnly.third_type" placeholder="请选择第三天可领值类别">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="折扣比例"
                        prop="ratio"
                        :rules="[{ required: true, message: '折扣比例是必填项' }]"
                    >
                        <el-input v-model.number="formOnly.ratio" maxlength="9" placeholder="请输入折扣比例"/>
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
                label: "档位",
            },
            {
                prop: "first_day",
                label: "第一天可领值",
            },
            {
                prop: "first_type",
                label: "第一天可领值类别",
            },
            {
                prop: "next_day",
                label: "第二天可领值",
            },
            {
                prop: "next_type",
                label: "第二天可领值类别",
            },
            {
                prop: "third_day",
                label: "第三天可领值",
            },
            {
                prop: "third_type",
                label: "第三天可领值类别",
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
            onlyStatus()
            getOnlyList(config);
        });

        const onlyStatus = async() => {
            onOff.value = await proxy.$api.onlyStatus();
        }

        const onOffToggle = async (status) => {
            ElMessageBox.confirm("确定?")
                .then(() => {
                    let res = proxy.$api.onOffOnly({status:status});

                    if (res) {
                        ElMessage({
                            showClose: true,
                            message: "操作成功",
                            type: "success",
                        });
                    }
                    onOff.value = !status

                    // onlyStatus()
                })
                .catch(() => {
                    // catch error
                });


        }

        const config = reactive({
            grade: "",
        });
        const getOnlyList = async (config) => {
            let res = await proxy.$api.getOnlyList(config);
            list.value = res.map((item) => {
                switch (item.first_type){
                    case 1:
                        item.first_type = "cash"
                        break

                    case 2:
                        item.first_type = "bonus"
                        break

                    case 3:
                        item.first_type = "giftCash"
                        break
                }

                switch (item.next_type){
                    case 1:
                        item.next_type = "cash"
                        break

                    case 2:
                        item.next_type = "bonus"
                        break

                    case 3:
                        item.next_type = "giftCash"
                        break
                }

                switch (item.third_type){
                    case 1:
                        item.third_type = "cash"
                        break

                    case 2:
                        item.third_type = "bonus"
                        break

                    case 3:
                        item.third_type = "giftCash"
                        break
                }

                return item;
            });
        };
        const changePage = (page) => {
            config.page = page;
            getOnlyList(config);
        };

        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getOnlyList(config);
        }

        const formInline = reactive({
            keyword: "",
        });
        const handleSearch = () => {
            config.grade = formInline.keyword;
            getOnlyList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.onlyForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加用户的form数据
        const formOnly = reactive({});
        // 添加用户
        const onSubmit = () => {
            proxy.$refs.onlyForm.validate(async (valid) => {
                switch (formOnly.first_type) {
                    case "cash":
                        formOnly.first_type = 1
                        break

                    case "bonus":
                        formOnly.first_type = 2
                        break

                    case "giftCash":
                        formOnly.first_type = 3
                        break
                }

                switch (formOnly.next_type) {
                    case "cash":
                        formOnly.next_type = 1
                        break

                    case "bonus":
                        formOnly.next_type = 2
                        break

                    case "giftCash":
                        formOnly.next_type = 3
                        break
                }

                switch (formOnly.third_type) {
                    case "cash":
                        formOnly.third_type = 1
                        break

                    case "bonus":
                        formOnly.third_type = 2
                        break

                    case "giftCash":
                        formOnly.third_type = 3
                        break
                }

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveOnly(formOnly);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.onlyForm.resetFields();
                            getOnlyList(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.saveOnly(formOnly);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.onlyForm.resetFields();
                            getOnlyList(config);
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
            proxy.$refs.onlyForm.resetFields();
            reset()
        };
        const reset = () => {
            formOnly.id = 0;//编辑时携带的id未被重置
            formOnly.created_at = "";
            formOnly.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑用户
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formOnly, row);
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
                    getOnlyList(config);
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
            formOnly,
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
    //justify-content: space-between;
}
</style>
