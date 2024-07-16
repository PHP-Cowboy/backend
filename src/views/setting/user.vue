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
                :width="item.width ? item.width : 150"
            />
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="small" @click="updateSecret(scope.row)">更新secret</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
    <el-dialog
        v-model="dialogVisible"
        :title="action === 'add' ? '新增用户' : '编辑用户'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formUser" ref="userForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="账户"
                        prop="username"
                        :rules="[{ required: true, message: '账户是必填项' }]"
                    >
                        <el-input v-model="formUser.username" placeholder="请输入账户"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="姓名"
                        prop="name"
                        :rules="[{ required: true, message: '姓名是必填项' }]"
                    >
                        <el-input v-model="formUser.name" placeholder="请输入姓名"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="手机号"
                        prop="phone"
                        :rules="[{ required: true, message: '手机号是必填项' }, { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的手机号'}]"
                    >
                        <el-input v-model="formUser.phone" placeholder="请输入手机号"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="邮箱"
                        prop="email"
                        :rules="[{ pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请输入正确的邮箱地址', trigger: 'blur' },]"
                    >
                        <el-input v-model="formUser.email" placeholder="请输入邮箱"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="状态"
                        prop="status"
                    >
                        <el-select v-model="formUser.status" placeholder="请选择">
                            <el-option v-for="status in userStatus" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="用户角色"
                        prop="roleList"
                    >
                        <el-select v-model="formUser.role_list" multiple placeholder="请选择">
                            <el-option v-for="r in roleList"  :label="r.name" :value="r.id"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-form-item
                    label="密码"
                    prop="password"
                    :rules="pwdRules()"
                >
                    <el-input v-model="formUser.password" type="password" placeholder="请输入密码"/>
                </el-form-item>
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
                prop: "username",
                label: "登录名",
            },
            {
                prop: "name",
                label: "姓名",
            },
            {
                prop: "phone",
                label: "手机号",
            },
            {
                prop: "email",
                label: "邮箱",
                width: 300,
            },
            {
                prop: "status",
                label: "状态",
            },
            {
                prop: "secret",
                label: "secret",
                width: 300,
            },
            {
                prop: "is_bind",
                label: "绑定状态",
            }
        ]);
        const userStatus = [
            {label:"启用",value:1},
            {label: "禁用",value: 2},
        ]

        const roleList = ref([])

        onMounted(() => {
            getUserData(config);
            getRoleList()
        });
        const config = reactive({
            page: 1,
            size:30,
            name: "",
            phone: "",
        });

        const getRoleList = async () => {
            let res = await proxy.$api.getRoleList();
            roleList.value = res.list
        };
        const getUserData = async (config) => {
            let res = await proxy.$api.getUserData(config);
            config.total = res.total;
            list.value = res.list.map((item) => {
                item.status = item.status === 1 ? "启用" : "禁用";
                item.is_bind = item.is_bind === 1 ? "已绑" : "未绑";
                return item;
            });
        };
        const changePage = (page) => {
            config.page = page;
            getUserData(config);
        };
        const formInline = reactive({
            keyword: "",
        });

        const handleSearch = () => {
            config.name = formInline.keyword;
            getUserData(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.userForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加用户的form数据
        const formUser = reactive({
            username:"",
            name: "",
            phone: "",
            email: "",
            password: "",
            status:1,
        });
        // 添加用户
        const onSubmit = () => {
            proxy.$refs.userForm.validate(async (valid) => {
                if (formUser.status === "启用"){
                    formUser.status = 1
                }else if (formUser.status === "禁用"){
                    formUser.status = 2
                }
                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.addUser(formUser);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.userForm.resetFields();
                            getUserData(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.changeUser(formUser);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.userForm.resetFields();
                            getUserData(config);
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
            proxy.$refs.userForm.resetFields();
            reset();
        };
        const reset = () => {
            formUser.id = 0;//编辑时携带的id未被重置
            formUser.created_at = "";
            formUser.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑用户
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formUser, row);
            });
        };

        const updateSecret = async (row) => {
            let res = await proxy.$api.updateUserGoogleCaptcha({uid:row.id})

            if (res){
                ElMessage({
                    showClose: true,
                    message: "更新成功",
                    type: "success",
                });
            }else {
                ElMessage({
                    showClose: true,
                    message: "更新失败:"+res.msg,
                    type: "error",
                });
            }

            console.log(res);

            getUserData(config);
        }

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
                    getUserData(config);
                })
                .catch(() => {
                    // catch error
                });
        };
        const pwdRules = () =>{
            let ruleData = [
                {
                    pattern: /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: '密码必须同时包含数字和字母，且长度至少为8',
                    trigger: 'blur'
                },
            ];
            if (action.value === "add"){
                ruleData.push({ required: true, message: '创建用户时密码是必填项', trigger: 'blur' })
            }
            return ruleData
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
            formUser,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            updateSecret,
            handleAdd,
            handleDelete,
            userStatus,
            pwdRules,
            roleList,
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
