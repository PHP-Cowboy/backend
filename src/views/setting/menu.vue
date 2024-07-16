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
                :width="item.width ? item.width : 200"
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

    </div>
    <el-dialog
        v-model="dialogVisible"
        :title="action === 'add' ? '新增菜单' : '编辑菜单'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formMenu" ref="menuForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="菜单名称"
                        prop="name"
                        :rules="[{ required: true, message: '菜单名称是必填项' }]"
                    >
                        <el-input v-model="formMenu.name" placeholder="请输入菜单名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="菜单路由"
                        prop="path"
                        :rules="[{ required: true, message: '菜单路由是必填项' }]"
                    >
                        <el-input v-model="formMenu.path" placeholder="请输入菜单路由"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="label"
                        prop="label"
                        :rules="[{ required: true, message: 'label是必填项' }]"
                    >
                        <el-input v-model="formMenu.label" placeholder="请输入label"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="图标"
                        prop="icon"
                    >
                        <el-input v-model="formMenu.icon" placeholder="请输入图标"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="前端组件url"
                        prop="url"
                        :rules="[{ required: true, message: '前端组件url是必填项' }]"
                    >
                        <el-input v-model="formMenu.url" placeholder="请输入前端组件url"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="状态"
                        prop="status"
                    >
                        <el-select v-model="formMenu.status" placeholder="请选择">
                            <el-option v-for="status in userStatus" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>

                <el-col :span="12">
                    <el-form-item
                        label="上级菜单"
                        prop="parent_id"
                        :rules="[{ required: true, message: '上级菜单是必填项' }]"
                    >
                        <el-select v-model="formMenu.parent_id" placeholder="请选择上级菜单">
                            <el-option v-for="p in parentList" :label="p.label" :value="p.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item
                        label="菜单级别"
                        prop="level"
                        :rules="[{ required: true, message: '菜单级别是必填项' }]"
                    >
                        <el-select v-model="formMenu.level" placeholder="请选择菜单级别">
                            <el-option v-for="l in levelList" :label="l.label" :value="l.value"/>
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
import {int} from "mockjs/src/mock/random/basic.js";

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
                label: "菜单名称",
            },
            {
                prop: "path",
                label: "菜单路由",
            },
            {
                prop: "label",
                label: "label",
            },
            {
                prop: "icon",
                label: "icon",
            },
            {
                prop: "url",
                label: "前端组件url",
            },
            {
                prop: "status",
                label: "状态",
            }
        ]);
        const userStatus = [
            {label:"启用",value:1},
            {label: "禁用",value: 2},
        ]

        const levelList = [
            {label:"一级",value:1},
            {label: "二级",value: 2},
        ]

        const parentList = reactive([
            {label:"根菜单",value:0}
        ])

        onMounted(() => {
            getMenuList(config);
            getLevelList();
        });
        const config = reactive({
            total:0,
            page: 1,
            size:30,
            name: "",
        });
        
        const getLevelList = async () => {
            let res = await proxy.$api.getLevelList({level:1});

            res.forEach(item=>{
                parentList.push({label:item.label,value:item.id})
            })
        }
        
        const getMenuList = async (config) => {
            let res = await proxy.$api.getMenuList(config);
            config.total = res.total;
            list.value = res.list.map((item) => {
                item.status = item.status === 1 ? "启用" : "禁用";
                return item;
            });
        };
        const changePage = (page) => {
            config.page = page;
            getMenuList(config);
        };
        const formInline = reactive({
            keyword: "",
        });
        const handleSearch = () => {
            config.name = formInline.keyword;
            getMenuList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.menuForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加用户的form数据
        const formMenu = reactive({
            name: "",
            path: "",
            status:1,
        });
        // 添加用户
        const onSubmit = () => {
            proxy.$refs.menuForm.validate(async (valid) => {
                if (formMenu.status === "启用"){
                    formMenu.status = 1
                }else if (formMenu.status === "禁用"){
                    formMenu.status = 2
                }

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.addMenu(formMenu);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.menuForm.resetFields();
                            getMenuList(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.changeMenu(formMenu);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.menuForm.resetFields();
                            getMenuList(config);
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
            proxy.$refs.menuForm.resetFields();
            reset()
        };
        const reset = () => {
            formMenu.id = 0;//编辑时携带的id未被重置
            formMenu.created_at = "";
            formMenu.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑用户
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formMenu, row);
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
                    getMenuList(config);
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
            formMenu,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleAdd,
            handleDelete,
            userStatus,
            levelList,
            parentList,
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
