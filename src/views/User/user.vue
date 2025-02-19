<template>
    <div class="user-header">
        <el-button type="primary" plain @click="handleAdd">+新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input v-model="formInline.keyword" placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain @click="handleSerch">搜索</el-button>
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
                :width="item.width ? item.width : 125"
            />
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
                        label="姓名"
                        prop="name"
                        :rules="[{ required: true, message: '姓名是必填项' }]"
                    >
                        <el-input v-model="formUser.name" placeholder="请输入姓名"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="年龄"
                        prop="age"
                        :rules="[
              { required: true, message: '年龄是必填项' },
              { type: 'number', message: '年龄必须是数字' },
            ]"
                    >
                        <el-input v-model.number="formUser.age" placeholder="请输入年龄"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="性别"
                        prop="sex"
                        :rules="[{ required: true, message: '性别是必选项' }]"
                    >
                        <el-select v-model="formUser.sex" placeholder="请选择">
                            <el-option label="男" value="0"/>
                            <el-option label="女" value="1"/>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="出生日期"
                        prop="birth"
                        :rules="[{ required: true, message: '出生日期是必选项' }]"
                    >
                        <el-date-picker
                            v-model="formUser.birth"
                            type="date"
                            label="出生日期"
                            placeholder="请输入"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item
                    label="地址"
                    prop="addr"
                    :rules="[{ required: true, message: '地址是必填项' }]"
                >
                    <el-input v-model="formUser.addr" placeholder="请输入地址"/>
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
                prop: "name",
                label: "姓名",
            },
            {
                prop: "age",
                label: "年龄",
            },
            {
                prop: "sexLabel",
                label: "性别",
            },
            {
                prop: "birth",
                label: "出生日期",
                width: 200,
            },
            {
                prop: "addr",
                label: "地址",
                width: 320,
            },
        ]);
        onMounted(() => {
            getUserData(config);
        });
        const config = reactive({
            total: 0,
            page: 1,
            name: "",
        });
        const getUserData = async (config) => {
            let res = await proxy.$api.getUserData(config);
            // console.log(res);
            config.total = res.count;
            list.value = res.list.map((item) => {
                item.sexLabel = item.sex === 0 ? "女" : "男";
                return item;
            });
        };
        const changePage = (page) => {
            // console.log(page);
            config.page = page;
            getUserData(config);
        };
        const formInline = reactive({
            keyword: "",
        });
        const handleSerch = () => {
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
            name: "", // 添加用户的 用户名
            age: "",
            sex: "",
            birth: "",
            addr: "",
        });
        const timeFormat = (time) => {
            var time = new Date(time);
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var date = time.getDate();

            function add(m) {
                return m < 10 ? "0" + m : m;
            }

            return year + "-" + add(month) + "-" + add(date);
        };
        // 添加用户
        const onSubmit = () => {
            proxy.$refs.userForm.validate(async (valid) => {
                if (valid) {
                    if (action.value == "add") {
                        formUser.birth = timeFormat(formUser.birth);
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
                        let res = await proxy.$api.editUser(formUser);
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
            row.sex == 1 ? (row.sex = "男") : (row.sex = "女");
            proxy.$nextTick(() => {
                Object.assign(formUser, row);
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
                    getUserData(config);
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
            handleSerch,
            dialogVisible,
            handleClose,
            formUser,
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
