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
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
    <el-dialog
        v-model="dialogVisible"
        :title="action === 'add' ? '新增权限' : '编辑权限'"
        width="45%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formRole" ref="roleForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="角色名称"
                        prop="name"
                        :rules="[{ required: true, message: '角色名称是必填项' }]"
                    >
                        <el-input v-model="formRole.name" placeholder="请输入角色名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="角色描述"
                        prop="desc"
                    >
                        <el-input v-model="formRole.desc" placeholder="请输入角色描述"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="状态"
                        prop="status"
                    >
                        <el-select v-model="formRole.status" placeholder="请选择">
                            <el-option v-for="status in userStatus" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item
                        label="角色渠道"
                        prop="roleList"
                    >
                        <el-select v-model="formRole.channelList" multiple placeholder="请选择">
                            <el-option v-for="r in channelList"  :label="r.channel_name" :value="r.id"/>
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>
                <el-col>
                    <el-form-item
                        label="角色渠道"
                        prop="roleList"
                    >
                        <el-tree-select
                            v-model="formRole.menuList"
                            :data="treeList"
                            multiple
                            :render-after-expand="false"
                            show-checkbox
                        />
                    </el-form-item>
                </el-col>
            </el-row>

<!--            <el-transfer-->
<!--                v-model="rightList"-->
<!--                filterable-->
<!--                filter-placeholder="菜单列表"-->
<!--                :titles="titles"-->
<!--                :button-texts="['取消','选择']"-->
<!--                :data="leftList"-->
<!--                @left-check-change="leftChange"-->
<!--                @right-check-change="rightChange"-->
<!--            />-->





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
                label: "角色名称",
            },
            {
                prop: "desc",
                label: "角色描述",
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

        const treeList = ref([])
        const channelList = ref([])

        const rightList = ref([
            {label:'首页',key:1},
        ]);
        const leftList = ref([
            {label:'首页',key:1},
            {label:'用户',key:2},
            {label:'用户列表',key:3},
        ]);
        const titles = ['未选菜单','已选菜单'];

        onMounted(() => {
            getRoleList(config);
            getMenuTree();
            getAllChannelList();

        });
        const config = reactive({
            total:0,
            page: 1,
            size:30,
            name: "",
        });


        const getMenuTree = async () => {
            treeList.value = await proxy.$api.getMenuTree(config);
        }

        const getAllChannelList = async () => {
            channelList.value = await proxy.$api.getAllChannel(config);
        }

        const getRoleList = async (config) => {
            let res = await proxy.$api.getRoleList(config);
            config.total = res.total;
            list.value = res.list.map((item) => {
                item.status = item.status === 1 ? "启用" : "禁用";
                return item;
            });
        };
        const changePage = (page) => {
            config.page = page;
            getRoleList(config);
        };
        const formInline = reactive({
            keyword: "",
        });
        const handleSearch = () => {
            config.name = formInline.keyword;
            getRoleList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.roleForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加用户的form数据
        const formRole = reactive({
            name: "",
            desc: "",
            status:1,
        });
        // 添加用户
        const onSubmit = () => {
            proxy.$refs.roleForm.validate(async (valid) => {

                if (formRole.status === "启用"){
                    formRole.status = 1
                }else if (formRole.status === "禁用"){
                    formRole.status = 2
                }
                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.addRole(formRole);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.roleForm.resetFields();
                            getRoleList(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.changeRole(formRole);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.roleForm.resetFields();
                            getRoleList(config);
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
            proxy.$refs.roleForm.resetFields();
            reset()
        };
        const reset = () => {
            formRole.id = 0;//编辑时携带的id未被重置
            formRole.created_at = "";
            formRole.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑用户
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formRole, row);
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
                    getRoleList(config);
                })
                .catch(() => {
                    // catch error
                });
        };
        
        const changeRoleMenu = (a,b,c) => {
            console.log(1111)
            console.log(a)
            console.log(b)
            console.log(c)
        }

        const leftChange = (a,b,c) => {
            console.log("left")
            console.log(a)
            console.log(b)
            console.log(c)
        }

        const rightChange = (a,b,c) => {
            console.log("right")
            console.log(a)
            console.log(b)
            console.log(c)
        }

        return {
            list,
            tableLabel,
            config,
            changePage,
            formInline,
            handleSearch,
            dialogVisible,
            handleClose,
            formRole,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleAdd,
            handleDelete,
            userStatus,
            leftList,
            rightList,
            titles,
            changeRoleMenu,
            leftChange,
            rightChange,
            treeList,
            channelList,
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
