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
        :title="action === 'add' ? '新增奖励' : '编辑奖励'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formPrize" ref="prizeForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="奖励名称"
                        prop="name"
                        :rules="[{ required: true, message: '奖励名称是必填项' }]"
                    >
                        <el-input v-model="formPrize.name" placeholder="请输入奖励名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="奖励英文名称"
                        prop="en_name"
                        :rules="[{ required: true, message: '奖励英文名称是必填项' }]"
                    >
                        <el-input v-model="formPrize.en_name" placeholder="请输入奖励英文名称"/>
                    </el-form-item>
                </el-col>


            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="物品数量"
                        prop="goods_num"
                        :rules="[
              { required: true, message: '物品数量是必填项' },
              { type: 'number', message: '物品数量必须是数字' },
            ]"
                    >
                        <el-input v-model.number="formPrize.goods_num" maxlength="9" placeholder="请输入物品数量"/>

                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="物品类别"
                        prop="goods_type"
                        :rules="[{ required: true, message: '物品类别是必选项' }]"
                    >
                        <el-select v-model="formPrize.goods_type" placeholder="请选择">
                            <el-option v-for="type in amountType" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-form-item
                    label="备&nbsp;&nbsp;注"
                    prop="remark"
                >
                    <el-input v-model="formPrize.remark" placeholder="请输入备注"/>
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
                prop: "name",
                label: "奖励名称",
            },
            {

                prop: "en_name",
                label: "奖励英文名称",
            },
            {
                prop: "goods_num",
                label: "物品数量",
            },
            {
                prop: "goods_type",
                label: "物品类别",

            },
            {
                prop: "remark",
                label: "备注",
            },
        ]);

        const amountType = [
            {label: "cash", value: 2},
            {label: "bonus", value: 3},
        ]

        onMounted(() => {
            // getPrizeList(config);
        });
        const config = reactive({
            name: "",
            size:10,
            total:0,
        });
        const getPrizeList = async (config) => {
            let res = await proxy.$api.getPrizeList(config);

            list.value = res.list.map((item) => {
                item.goods_type = item.goods_type === 2 ? "cash" : "bonus";

                return item;
            });

            config.total = res.total
        };
        const formInline = reactive({
            keyword: "",
        });
        const handleSearch = () => {
            config.name = formInline.keyword;
            getPrizeList(config);
        };

        const changePage = (page) => {
            config.page = page;
            getPrizeList(config);
        };

        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getPrizeList(config);
        }

        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.prizeForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加的form数据
        const formPrize = reactive({
            name: "", // 添加用户的 用户名
            goods_num: "",
            goods_type: "bonus",

            remark: "",
        });
        // 添加
        const onSubmit = () => {
            proxy.$refs.prizeForm.validate(async (valid) => {

                if (formPrize.goods_type === "bonus") {
                    formPrize.goods_type = 3
                } else if (formPrize.goods_type === "cash") {
                    formPrize.goods_type = 2
                }
                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.savePrize(formPrize);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });

                            dialogVisible.value = false;
                            proxy.$refs.prizeForm.resetFields();
                            getPrizeList(config);
                        }
                    } else {

                        let res = await proxy.$api.savePrize(formPrize);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });

                            dialogVisible.value = false;
                            proxy.$refs.prizeForm.resetFields();
                            getPrizeList(config);
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
            proxy.$refs.prizeForm.resetFields();

            reset()
        };
        const reset = () => {
            formPrize.id = 0;
            formPrize.created_at = "";
            formPrize.updated_at = "";
        }

        // 区分编辑和新增
        const action = ref("add");
        // 编辑
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formPrize, row);
            });
        };
        // 新增
        const handleAdd = () => {
            action.value = "add";
            dialogVisible.value = true;
        };

        const handleDelete = (row) => {
            ElMessageBox.confirm("你确定删除吗?", {"autofocus": false})
                .then(async () => {
                    await proxy.$api.delPrize({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getPrizeList(config);
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
            changePage,
            handleSizeChange,
            dialogVisible,
            handleClose,
            formPrize,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleAdd,
            handleDelete,
            amountType,

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
