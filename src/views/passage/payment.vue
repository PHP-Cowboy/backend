<template>
    <div class="user-header">
        <el-form :inline="true" :model="formInline">
            <el-button type="primary" plain @click="handleAdd">+新增</el-button>
            <el-form-item>

                <el-form-item
                    label="通道状态"
                    prop="payment_status"
                >
                    <el-select v-model="formInline.payment_status" clearable placeholder="请选择">
                        <el-option v-for="e in statusList" :label="e.label" :value="e.value"/>
                    </el-select>
                </el-form-item>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" plain @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="list" style="width: 100%">
            <el-table-column
                sortable
                v-for="item in tableLabel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width ? item.width : 120"
            />

            <el-table-column label="渠道配置" width="200">
                <template #default="scope">
                    <el-select
                        multiple
                        clearable
                        @change="changeStatus(scope.row,'paymentChannel')"
                        v-model="scope.row.payment_channel_ids"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="cl in channels"
                            :key="cl.id"
                            :label="cl.channel_name"
                            :value="cl.id.toString()"
                        />
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" :type="scope.row.payment_status_name === '开启' ? 'warning' : 'success'" @click="changeStatus(scope.row,'paymentStatus')">{{scope.row.payment_status_name === "开启" ? "关闭" : "开启"}}</el-button>
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" plain size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


    </div>

    <el-dialog
        v-model="dialogVisible"
        :title="action === 'add' ? '新增代收' : '编辑代收'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formPassage" ref="passageForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="通道"
                        prop="passage_id"
                        :rules="[{ required: true, message: '通道是必选项' }]"
                    >
                        <el-select v-model="formPassage.passage_id" placeholder="请选择">
                            <el-option v-for="el in passageList" :label="el.name" :value="el.id"/>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="排序"
                        prop="payment_sort"
                        :rules="[{ required: true, message: '排序是必填项' }]"
                    >
                        <el-input v-model.number="formPassage.payment_sort" maxlength="9" placeholder="请输入排序"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="代收费率"
                        prop="payment_rate"
                        :rules="[{ required: true, message: '代收费率是必填项' }]"
                    >
                        <el-input v-model.number="formPassage.payment_rate" maxlength="9" placeholder="请输入代收费率"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item
                        label="通道状态"
                        prop="payment_status"
                    >
                        <el-switch
                            v-model="formPassage.payment_status"
                            class="mb-2"
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            active-text="开启"
                            inactive-text="关闭"
                        />
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>

                <el-col :span="12">
                    <el-form-item
                        label="渠道配置"
                        prop="payment_channel_ids"
                        :rules="[{ required: true, message: '渠道配置是必选项' }]"
                    >
                        <el-select
                            multiple
                            clearable
                            v-model="formPassage.payment_channel_ids"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="cl in channels"
                                :key="cl.id"
                                :label="cl.channel_name"
                                :value="cl.id.toString()"
                            />
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
import {defineComponent, getCurrentInstance, onMounted, reactive, ref,} from "vue";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const channels = ref([])
        const passageList = ref([])
        const tableLabel = reactive([
            {
                prop: "id",
                label: "ID",
            },
            {
                prop: "passage_id",
                label: "通道id",
            },
            {
                prop: "name",
                label: "通道名称",
            },
            {
                prop: "payment_rate",
                label: "代付费率",
            },
            {
                prop: "payment_status_name",
                label: "状态",
            },
            {
                prop: "payment_sort",
                label: "排序",
            },
            {
                prop: "created_at",
                label: "创建时间",
                width:260,
            },
            {
                prop: "updated_at",
                label: "更新时间",
                width:280,
            }
        ]);

        const statusList = [
            {"label":"开启",value:1},
            {"label":"关闭",value:2},
        ];

        onMounted(() => {
            getChannelList();
            getPayConfigList();
            // getPassageList(config);
        });
        const config = reactive({
            size:10,
            total:0,
        });
        const changePage = (page) => {
            config.page = page;
            getPassageList(config);
        };
        const getChannelList = async () => {
            channels.value = await proxy.$api.getAllChannel()
        };

        const payChanMap = reactive(new Map())
        const getPayConfigList = async () => {

            let res = await proxy.$api.getPayConfigList({page:1,size:100});

            passageList.value = res.list

            let passageMp = new Map();

            res.list.map((item) => {
                passageMp.set(item.id,item.name)
            });

            payChanMap.value = passageMp
        };
        const getPassageList = async (config) => {
            let res = await proxy.$api.getPassageList(config);

            list.value = res.list.map((item) => {
                switch (item.payment_status) {
                    case 1:
                        item.payment_status_name = "开启";
                        break
                    case 2:
                        item.payment_status_name = "关闭";
                        break
                    default:
                        item.payment_status_name = "未知";
                }

                item.name = payChanMap.value.get(item.passage_id)

                return item;
            });

            config.total = res.total
        };
        const formInline = reactive({});
        const handleSearch = () => {
            config.entrance = formInline.entrance;
            config.payment_status = formInline.payment_status;
            getPassageList(config);
        };

        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.passageForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };

        // 添加的form数据
        const formPassage = reactive({});
        // 添加
        const onSubmit = () => {
            proxy.$refs.passageForm.validate(async (valid) => {
                if (formPassage.payment_status_name){
                    formPassage.payment_status = 1;
                }else {
                    formPassage.payment_status = 2;
                }

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.passageSave(formPassage);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.passageForm.resetFields();
                            getPassageList(config);
                        }
                    } else {
                        let res = await proxy.$api.passageSave(formPassage);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.passageForm.resetFields();
                            getPassageList(config);
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
            proxy.$refs.passageForm.resetFields();
            reset()
        };
        const reset = () => {
            formPassage.id = 0;
            formPassage.created_at = "";
            formPassage.updated_at = "";
        }

        const changeStatus = async(row,type) => {

            let params = {
                id: row.id,
                type:type,
            }

            if (type === "paymentStatus"){
                if (row.payment_status_name === "开启"){
                    params.payment_status = 2
                }else {
                    params.payment_status = 1
                }

            }else if (type === "paymentChannel"){
                if (row.payment_channel_ids.length <= 0){
                    ElMessage({
                        showClose: true,
                        message: "渠道不能为空,操作失败",
                        type: "error",
                    });
                    getPassageList(config);
                    return
                }
                params.payment_channel_ids = row.payment_channel_ids
            }

            await proxy.$api.passageChange(params);

            getPassageList(config);
        }

        // 区分编辑和新增
        const action = ref("add");

        //编辑
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;

            row.payment_status = row.payment_status_name === "开启";

            proxy.$nextTick(() => {
                Object.assign(formPassage, row);
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
                    await proxy.$api.passageDel({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getPassageList(config);
                })
                .catch(() => {
                });
        };

        return {
            list,
            tableLabel,
            config,
            formInline,
            formPassage,
            handleSearch,
            passageList,
            channels,
            statusList,
            changePage,
            action,
            handleEdit,
            changeStatus,
            handleAdd,
            handleDelete,
            dialogVisible,
            handleClose,
            handleCancel,
            onSubmit,
            payChanMap,
        };
    },
});
</script>

<style lang="less" scoped>
.table {
    position: relative;
    height: 720px;
}

.user-header {
    display: flex;
    justify-content: space-between;
}
</style>
