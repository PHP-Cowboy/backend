<template>
    <div class="user-header">
        <el-button type="primary" plain @click="handleAdd">+新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-input v-model="formInline.name" maxlength="20" clearable placeholder="请输入支付渠道名称"/>
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
            <el-table-column fixed="right" label="操作" min-width="90">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" plain size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


    </div>
    <el-dialog
        v-model="dialogVisible"
        :title="action === 'add' ? '新增支付渠道' : '编辑支付渠道'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formPayChannel" ref="payChannelForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="渠道名称"
                        prop="name"
                        :rules="[{ required: true, message: '渠道名称是必填项' }]"
                    >
                        <el-input v-model="formPayChannel.name" placeholder="请输入渠道名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="请求地址"
                        prop="url"
                        :rules="[
              { required: true, message: '请求地址是必填项' },
            ]"
                    >
                        <el-input v-model="formPayChannel.url" maxlength="128" placeholder="请输入请求地址"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="代收回调地址"
                        prop="back_url"
                        :rules="[{ required: true, message: '代收回调地址是必填项' }]"
                    >
                        <el-input v-model="formPayChannel.back_url" maxlength="128" placeholder="请输入代收回调地址"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="代付回调地址"
                        prop="payment_back_url"
                        :rules="[{ required: true, message: '代付回调地址是必填项' }]"
                    >
                        <el-input v-model="formPayChannel.payment_back_url" maxlength="128" placeholder="请输入代付回调地址"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="应用ID"
                        prop="app_id"
                        :rules="[{ required: true, message: '应用ID是必填项' }]"
                    >
                        <el-input v-model="formPayChannel.app_id" maxlength="32" placeholder="请输入应用ID"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="秘钥"
                        prop="secret"
                        :rules="[{ required: true, message: '秘钥是必填项' }]"
                    >
                        <el-input v-model="formPayChannel.secret" placeholder="请输入秘钥"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="商户号"
                        prop="merchant"
                        :rules="[{ required: true, message: '商户号是必填项' }]"
                    >
                        <el-input v-model="formPayChannel.merchant" maxlength="32" placeholder="请输入商户号"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="状态"
                        prop="status"
                        :rules="[{ required: true, message: '状态是必选项' }]"
                    >
                        <el-select v-model="formPayChannel.status" placeholder="请选择">
                            <el-option v-for="type in statusArr" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="标记"
                        prop="markers"
                        :rules="[{ required: true, message: '标记是必填项' }]"
                    >
                        <el-input v-model="formPayChannel.markers" maxlength="64" placeholder="请输入标记"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item
                        label="备&nbsp;&nbsp;注"
                        prop="remark"
                    >
                        <el-input v-model="formPayChannel.remark" maxlength="64" placeholder="请输入备注"/>
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
                label: "通道名称",
            },
            {
                prop: "url",
                label: "请求地址",
            },
            {
                prop: "back_url",
                label: "代收回调地址",
            },
            {
                prop: "app_id",
                label: "应用ID",
            },
            {
                prop: "secret",
                label: "秘钥",
                width:200,
            },
            {
                prop: "payment_back_url",
                label: "代付回调地址",
            },
            {
                prop: "merchant",
                label: "商户号",
            },
            {
                prop: "status",
                label: "状态",
            },
            {
                prop: "markers",
                label: "标记",
            },
            {
                prop: "remark",
                label: "备注",
            },
        ]);
        const statusArr = [
            {label:"可用",value:1},
            {label:"停用",value:2},
        ];

        onMounted(() => {
            getPayConfigList(config);
        });

        const getPayConfigList = async (config) => {
            let res = await proxy.$api.getPayConfigList(config);

            list.value = res.list.map((item) => {
                item.status = item.status === 1 ? "可用" : "停用";
                return item;
            });

            config.total = res.total
        };
        const formInline = reactive({});
        const handleSearch = () => {
            config.name = formInline.name;
            getPayConfigList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.payChannelForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加的form数据
        const formPayChannel = reactive({});
        // 添加
        const onSubmit = () => {
            proxy.$refs.payChannelForm.validate(async (valid) => {
                if (formPayChannel.status === "可用"){
                    formPayChannel.status = 1;
                }else if (formPayChannel.status === "停用"){
                    formPayChannel.status = 2;
                }

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.savePayConfig(formPayChannel);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.payChannelForm.resetFields();
                            getPayConfigList(config);
                        }
                    } else {
                        let res = await proxy.$api.savePayConfig(formPayChannel);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.payChannelForm.resetFields();
                            getPayConfigList(config);
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
            proxy.$refs.payChannelForm.resetFields();
            reset()
        };
        const reset = () => {
            formPayChannel.id = 0;
            formPayChannel.created_at = "";
            formPayChannel.updated_at = "";
        }

        const config = reactive({
            size:10,
            total:0,
        });
        const changePage = (page) => {
            console.log(config)
            config.page = page;
            getPayConfigList(config);
        };

        // 区分编辑和新增
        const action = ref("add");
        // 编辑
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formPayChannel, row);
            });
        };
        // 新增
        const handleAdd = () => {
            action.value = "add";
            dialogVisible.value = true;
        };
        const handleDelete = (row) => {
            ElMessageBox.confirm("你确定删除吗?",{"autofocus": false})
                .then(async () => {
                    await proxy.$api.delConfig({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getPayConfigList(config);
                })
                .catch(() => {
                });
        };
        return {
            list,
            tableLabel,
            config,
            formInline,
            handleSearch,
            dialogVisible,
            handleClose,
            formPayChannel,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            changePage,
            handleAdd,
            handleDelete,
            statusArr,
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
