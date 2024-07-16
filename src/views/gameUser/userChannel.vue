<template>
    <div class="user-header">
        <el-button type="primary" plain @click="handleAdd">+新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input v-model="formInline.channel_name" placeholder="请输入渠道名"/>
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
                :width="item.width ? item.width : 350"
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
        :title="action === 'add' ? '新增用户渠道' : '编辑用户渠道'"
        width="45%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formUserChannel" ref="userChannelForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="渠道名称"
                        prop="channel_name"
                        :rules="[{ required: true, message: '渠道名称是必填项' }]"
                    >
                        <el-input v-model="formUserChannel.channel_name" placeholder="请输入渠道名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="渠道编码"
                        prop="code"
                    >
                        <el-input v-model="formUserChannel.code" placeholder="请输入渠道编码"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="渠道描述"
                        prop="remark"
                    >
                        <el-input v-model="formUserChannel.remark" placeholder="请输入渠道描述"/>
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
                prop: "channel_name",
                label: "渠道名称",
            },
            {
                prop: "code",
                label: "渠道编码",
            },
            {
                prop: "remark",
                label: "渠道描述",
            },

        ]);

        onMounted(() => {
            getChannelPageList(config);

        });
        const config = reactive({
            total:0,
            page: 1,
            size:10,
            channel_name: "",
        });

        const getChannelPageList = async (config) => {
            let res = await proxy.$api.getChannelPageList(config);
            list.value = res.list;
            config.total = res.total;
        };
        const changePage = (page) => {
            config.page = page;
            getChannelPageList(config);
        };
        const formInline = reactive({});
        const handleSearch = () => {
            config.channel_name = formInline.channel_name;
            getChannelPageList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.userChannelForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加渠道的form数据
        const formUserChannel = reactive({});
        // 添加渠道
        const onSubmit = () => {
            proxy.$refs.userChannelForm.validate(async (valid) => {

                if (valid) {
                    let res = await proxy.$api.saveChannel(formUserChannel);

                    if (action.value === "add") {
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.userChannelForm.resetFields();
                            getChannelPageList(config);
                        }
                    } else {
                        // 编辑的接口
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.userChannelForm.resetFields();
                            getChannelPageList(config);
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
            proxy.$refs.userChannelForm.resetFields();
            reset()
        };
        const reset = () => {
            formUserChannel.id = 0;//编辑时携带的id未被重置
            formUserChannel.created_at = "";
            formUserChannel.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑渠道
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formUserChannel, row);
            });
        };
        // 新增渠道
        const handleAdd = () => {
            action.value = "add";
            dialogVisible.value = true;
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
            formUserChannel,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
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
