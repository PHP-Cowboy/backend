<template>
    <div class="user-header">
        <el-button type="primary" plain @click="handleAdd">+新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-input v-model="formInline.name" maxlength="20" clearable placeholder="请输入赠送配置名称"/>
            </el-form-item>
            <el-form-item>
                <el-form-item
                    label="状态"
                    prop="status"
                >
                    <el-select v-model="formInline.status" clearable placeholder="请选择">
                        <el-option v-for="type in statusArr" :label="type.label" :value="type.value"/>
                    </el-select>
                </el-form-item>
            </el-form-item>
            <el-form-item>
                <el-form-item
                    label="赠送类型"
                    prop="type"
                >
                    <el-select v-model="formInline.type" clearable placeholder="请选择">
                        <el-option v-for="type in typeArr" :label="type.label" :value="type.value"/>
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
                v-for="item in tableLabel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width ? item.width : 230"
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
        :title="action === 'add' ? '新增赠送配置' : '编辑赠送配置'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formGaveConfig" ref="gaveConfigForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="赠送名称"
                        prop="name"
                        :rules="[{ required: true, message: '赠送名称是必填项' }]"
                    >
                        <el-input v-model="formGaveConfig.name" placeholder="请输入赠送名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="赠送金额"
                        prop="account"
                        :rules="[
              { required: true, message: '赠送金额是必填项' },
              { type: 'number', message: '赠送金额必须是数字' },
            ]"
                    >
                        <el-input v-model.number="formGaveConfig.account" maxlength="9" placeholder="请输入赠送金额"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="状态"
                        prop="status"
                        :rules="[{ required: true, message: '状态是必选项' }]"
                    >
                        <el-select v-model="formGaveConfig.status" placeholder="请选择">
                            <el-option v-for="type in statusArr" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item
                        label="赠送类型"
                        prop="type"
                        :rules="[{ required: true, message: '赠送类型是必选项' }]"
                    >
                        <el-select v-model="formGaveConfig.type" placeholder="请选择" @change="handleTypeChange">
                            <el-option v-for="type in typeArr" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12" v-if="showReplace">
                    <el-form-item
                        label="替换目标"
                        prop="replace_id"
                    >
                        <el-select v-model="formGaveConfig.replace_id" placeholder="请选择">
                            <el-option v-for="type in replaceList" :label="type.name" :value="type.id"/>
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
            },
            {
                prop: "name",
                label: "赠送名称",
            },
            {
                prop: "account",
                label: "赠送金额",
            },
            {
                prop: "status",
                label: "状态",
            },
            {
                prop: "type",
                label: "赠送类型",
            },
            {
                prop: "replace",
                label: "替换的目标",
            },
        ]);
        const statusArr = [
            {label:"在用",value:1},
            {label:"停用",value:2},
        ];

        const typeArr = [
            {label:"正常",value:1},
            {label:"首提",value:2},
        ];

        const replaceList = ref([])
        const typeMp = ref(new Map())

        let showReplace = ref(false); // 控制是否显示替换目标的标志

        function handleTypeChange(newValue) {
            showReplace.value = newValue === 2; // 当值为2（即首提）时显示替换目标
        }

        onMounted(() => {
            getGaveConfigList({type:1,status:1});
            getGaveConfigPageList(config);
        });
        const config = reactive({
            name: "",
            page:1,
            total:0,
        });
        
        const getGaveConfigList = async (params) => {
            let res = await proxy.$api.getGaveConfigList(params)

            let replaceArr = [{id:0,name:"Not Substituted"}];

            let mp = new Map();

            res.map((item)=>{
                replaceArr.push({id:item.id,name:item.name})
                mp.set(item.id,item.name)
            })

            replaceList.value = replaceArr
            typeMp.value = mp
        }
        
        const getGaveConfigPageList = async (config) => {
            let res = await proxy.$api.getGaveConfigPageList(config);

            list.value = res.list.map((item) => {
                item.status = item.status === 1 ? "在用" : "停用";
                item.type = item.type === 1 ? "正常" : "首提";
                item.replace= typeMp.value.get(item.replace_id);
                return item;
            });
        };
        const formInline = reactive({});
        const handleSearch = () => {
            config.name = formInline.name;
            config.money = formInline.money;
            config.account = formInline.account;
            config.status = formInline.status;
            config.type = formInline.type;
            getGaveConfigPageList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.gaveConfigForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加的form数据
        const formGaveConfig = reactive({});
        // 添加
        const onSubmit = () => {
            proxy.$refs.gaveConfigForm.validate(async (valid) => {
                if (formGaveConfig.status === "在用"){
                    formGaveConfig.status = 1;
                }else if (formGaveConfig.status === "停用"){
                    formGaveConfig.status = 2;
                }

                if (formGaveConfig.type === "正常"){
                    formGaveConfig.type = 1;
                }else if (formGaveConfig.type === "首提"){
                    formGaveConfig.type = 2;
                }

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveGiveConfig(formGaveConfig);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.gaveConfigForm.resetFields();
                            getGaveConfigPageList(config);
                        }
                    } else {
                        let res = await proxy.$api.saveGiveConfig(formGaveConfig);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.gaveConfigForm.resetFields();
                            getGaveConfigPageList(config);
                        }
                    }

                    getGaveConfigList({type:1,status:1});

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
            proxy.$refs.gaveConfigForm.resetFields();
            reset()
        };
        const reset = () => {
            formGaveConfig.id = 0;
            formGaveConfig.created_at = "";
            formGaveConfig.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            showReplace.value = row.type === "首提";
            proxy.$nextTick(() => {
                Object.assign(formGaveConfig, row);
            });
        };
        // 新增
        const handleAdd = () => {
            action.value = "add";
            showReplace.value = true;
            dialogVisible.value = true;
        };
        const handleDelete = (row) => {
            ElMessageBox.confirm("你确定删除吗?",{"autofocus": false})
                .then(async () => {
                    await proxy.$api.delGiveConfig({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getGaveConfigPageList(config);
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
            formGaveConfig,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleAdd,
            handleDelete,
            statusArr,
            typeArr,
            replaceList,
            handleTypeChange,
            showReplace,
            typeMp,
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
