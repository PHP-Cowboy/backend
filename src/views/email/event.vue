<template>
    <div class="user-header">
        <el-button type="primary" plain @click="handleAdd">+新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input v-model="formInline.keyword" placeholder="关联事件名称"/>
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
                :width="item.width ? item.width : 230"
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
        :title="action === 'add' ? '新增关联事件' : '编辑关联事件'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formEvent" ref="eventForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="关联事件名称"
                        prop="name"
                        :rules="[{ required: true, message: '关联事件名称是必填项' }]"
                    >
                        <el-input v-model="formEvent.name" placeholder="请输入关联事件名称"/>
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
                prop: "name",
                label: "关联事件名称",
            },
        ]);
        onMounted(() => {
            // getEmailEventList(config);
        });
        const config = reactive({
            name: "",
            size:10,
            total:0,
        });
        const getEmailEventList = async (config) => {
            let res = await proxy.$api.getEmailEventList(config);

            list.value = res.list

            config.total = res.total
        };
        const formInline = reactive({
            keyword: "",
        });

        const changePage = (page) => {
            config.page = page;
            getEmailEventList(config);
        };

        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getEmailEventList(config);
        }

        const handleSearch = () => {
            config.name = formInline.keyword;
            getEmailEventList(config);
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
        // 添加的form数据
        const formEvent = reactive({
            name: "", // 添加 事件名称
        });
        // 添加
        const onSubmit = () => {
            proxy.$refs.eventForm.validate(async (valid) => {

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveEmailEvent(formEvent);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.eventForm.resetFields();
                            getEmailEventList(config);
                        }
                    } else {
                        let res = await proxy.$api.saveEmailEvent(formEvent);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.eventForm.resetFields();
                            getEmailEventList(config);
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
            proxy.$refs.eventForm.resetFields();
            reset()
        };
        const reset = () => {
            formEvent.id = 0;
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formEvent, row);
            });
        };
        // 新增
        const handleAdd = () => {
            action.value = "add";
            dialogVisible.value = true;
        };
        return {
            list,
            tableLabel,
            config,
            formInline,
            handleSearch,
            dialogVisible,
            handleClose,
            formEvent,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            changePage,
            handleSizeChange,
            handleAdd,
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
