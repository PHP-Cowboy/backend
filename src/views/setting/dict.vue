<template>
<!--    <div class="user-header">-->
<!--        <el-button type="primary" plain @click="handleAdd">+新增</el-button>-->
<!--        <el-form :inline="true" :model="formInline">-->
<!--            <el-form-item label="请输入">-->
<!--                <el-input v-model="formInline.keyword" placeholder="请输入类型编码"/>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--                <el-button type="primary" plain @click="handleSearch">搜索</el-button>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
<!--    </div>-->
    <div class="table">
        <el-table :data="list" style="width: 100%">
            <el-table-column
                v-for="item in tableLabel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width ? item.width : 200"
            />
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
    <el-dialog
        v-model="dialogVisible"
        :title="action === 'add' ? '新增字典' : '编辑字典'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formDict" ref="dictForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="字典类型编码"
                        prop="type_code"
                        :rules="[{ required: true, message: '字典类型编码是必填项' }]"
                    >
                        <el-input readonly  v-model="formDict.type_code" placeholder="请输入字典类型编码"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="字典编码"
                        prop="code"
                        :rules="[{ required: true, message: '字典编码是必填项' }]"
                    >
                        <el-input readonly  v-model="formDict.code" placeholder="请输入字典编码"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="字典名称"
                        prop="name"
                        :rules="[{ required: true, message: '字典名称是必填项' }]"
                    >
                        <el-input readonly v-model="formDict.name" placeholder="请输入字典名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="字典值"
                        prop="value"
                    >
                        <el-input v-model="formDict.value" placeholder="请输入字典值"/>
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
                prop: "type_code",
                label: "字典类型编码",
            },
            {
                prop: "code",
                label: "字典编码",
            },
            {
                prop: "name",
                label: "字典名称",
            },
            {
                prop: "value",
                label: "字典值",
            }
        ]);
        
        onMounted(() => {
            getDictList(config);
        });
        const config = reactive({});
        const getDictList = async (config) => {
            list.value = await proxy.$api.getDictList(config);
        };
        const changePage = (page) => {
            config.page = page;
            getDictList(config);
        };
        const formInline = reactive({
            keyword: "",
        });
        const handleSearch = () => {
            config.type_code = formInline.keyword;
            getDictList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.dictForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加用户的form数据
        const formDict = reactive({});
        // 添加用户
        const onSubmit = () => {
            proxy.$refs.dictForm.validate(async (valid) => {

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveDict(formDict);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.dictForm.resetFields();
                            getDictList(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.saveDict(formDict);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.dictForm.resetFields();
                            getDictList(config);
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
            proxy.$refs.dictForm.resetFields();
            reset()
        };
        const reset = () => {
            formDict.id = 0;//编辑时携带的id未被重置
            formDict.created_at = "";
            formDict.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑用户
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formDict, row);
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
                    await proxy.$api.deleteUser({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getDictList(config);
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
            formDict,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleAdd,
            handleDelete,
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
