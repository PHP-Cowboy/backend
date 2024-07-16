<template>
    <div class="user-header">
        <el-button type="primary" plain @click="handleAdd">+新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-input v-model="formInline.name" maxlength="20" clearable placeholder="请输入充值名称"/>
            </el-form-item>
            <el-form-item>
                <el-input v-model.number="formInline.cash" maxlength="9" clearable placeholder="请输入到账金额"/>
            </el-form-item>
            <el-form-item>
                <el-input v-model.number="formInline.account" clearable maxlength="9" placeholder="请输入支付金额"/>
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
                :width="item.width ? item.width : 130"
            />
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" plain size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-dialog
        v-model="dialogVisible"
        :title="action === 'add' ? '新增充值礼物' : '编辑充值礼物'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formPayGift" ref="payGiftForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="充值名称"
                        prop="name"
                        :rules="[{ required: true, message: '充值名称是必填项' }]"
                    >
                        <el-input v-model="formPayGift.name" placeholder="请输入充值名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="到账金额"
                        prop="cash"
                        :rules="[
              { required: true, message: '到账金额是必填项' },
              { type: 'number', message: '到账金额必须是数字' },
            ]"
                    >
                        <el-input v-model.number="formPayGift.cash" maxlength="9" placeholder="请输入到账金额"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="支付金额"
                        prop="account"
                        :rules="[{ required: true, message: '支付金额是必填项' }]"
                    >
                        <el-input v-model.number="formPayGift.account" maxlength="9" placeholder="请输入支付金额"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="状态"
                        prop="status"
                        :rules="[{ required: true, message: '状态是必选项' }]"
                    >
                        <el-select v-model="formPayGift.status" placeholder="请选择">
                            <el-option v-for="type in statusArr" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="额外赠送winCash"
                        prop="add_money"
                        :rules="[{ required: true, message: '额外赠送winCash是必填项' }]"
                    >
                        <el-input v-model.number="formPayGift.add_money" maxlength="9" placeholder="请输入额外赠送winCash"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="额外赠送类型"
                        prop="add_money_type"
                        :rules="[{ required: true, message: '额外赠送类型是必选项' }]"
                    >
                        <el-select v-model="formPayGift.add_money_type" placeholder="请选择">
                            <el-option v-for="type in amountType" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="额外赠送cash"
                        prop="add_cash"
                        :rules="[{ required: true, message: '额外赠送cash是必填项' }]"
                    >
                        <el-input v-model.number="formPayGift.add_cash" maxlength="9" placeholder="请输入额外赠送cash"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="赠送cash类型"
                        prop="add_cash_type"
                        :rules="[{ required: true, message: '赠送cash类型是必选项' }]"
                    >
                        <el-select v-model="formPayGift.add_cash_type" placeholder="请选择">
                            <el-option v-for="type in amountType" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="额外赠送bonus"
                        prop="bonus"
                        :rules="[{ required: true, message: '额外赠送bonus是必填项' }]"
                    >
                        <el-input v-model.number="formPayGift.bonus" maxlength="9" placeholder="请输入额外赠送bonus"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="赠送bonus类型"
                        prop="bonus_type"
                        :rules="[{ required: true, message: '赠送bonus类型是必选项' }]"
                    >
                        <el-select v-model="formPayGift.bonus_type" placeholder="请选择">
                            <el-option v-for="type in amountType" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item
                    label="优惠比例(百分比,填整数值)"
                    prop="ratio"
                >
                    <el-input v-model.number="formPayGift.ratio" maxlength="64" placeholder="请输入优惠比例"/>
                </el-form-item>
                <el-form-item
                    label="备&nbsp;&nbsp;注"
                    prop="remark"
                >
                    <el-input v-model="formPayGift.remark" maxlength="64" placeholder="请输入备注"/>
                </el-form-item>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="赠送类型"
                        prop="type"
                        :rules="[{ required: true, message: '赠送类型是必选项' }]"
                    >
                        <el-select v-model="formPayGift.type" placeholder="请选择" @change="handleTypeChange">
                            <el-option v-for="type in typeArr" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" v-if="showReplace">
                    <el-form-item
                        label="替换目标"
                        prop="replace_id"
                    >
                        <el-select v-model="formPayGift.replace_id" placeholder="请选择">
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
                label: "充值名称",
            },
            {
                prop: "cash",
                label: "到账金额",
            },
            {
                prop: "account",
                label: "支付金额",
            },
            {
                prop: "status",
                label: "状态",
            },
            {
                prop: "add_money",
                label: "赠送winCash",
            },
            {
                prop: "add_money_type",
                label: "额外赠送类型",
            },
            {
                prop: "add_cash",
                label: "赠送cash",
            },
            {
                prop: "add_cash_type",
                label: "赠送cash类型",
            },
            {
                prop: "bonus",
                label: "赠送bonus",
            },
            {
                prop: "bonus_type",
                label: "赠送bonus类型",
            },
            {
                prop: "ratio",
                label: "优惠比例",
            },
            {
                prop: "remark",
                label: "备注",
            },
            {
                prop: "type",
                label: "类型",
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

        const amountType = [
            {label:"金额",value:1},
            {label:"比例",value:2},
        ];

        onMounted(() => {
            getReplaceList({status:1,type:1});
            getPayGiftList(config);
        });

        const config = reactive({
            name: "",
        });

        const replaceList = ref([])

        const typeMp = ref(new Map())

        let showReplace = ref(false); // 控制是否显示替换目标的标志

        function handleTypeChange(newValue) {
            showReplace.value = newValue === 2; // 当值为2（即首提）时显示替换目标
        }

        const getReplaceList = async (params) => {
            let res = await proxy.$api.getPayGiftList(params);

            let replaceArr = [{id:0,name:"Not Substituted"}];

            let mp = new Map();

            res.map((item)=>{
                replaceArr.push({id:item.id,name:item.name})
                mp.set(item.id,item.name)
            })

            replaceList.value = replaceArr
            typeMp.value = mp
        }

        const getPayGiftList = async (config) => {
            let res = await proxy.$api.getPayGiftList(config);

            list.value = res.map((item) => {
                item.status = item.status === 1 ? "在用" : "停用";
                item.add_money_type = item.add_money_type === 1 ? "金额" : "比例";
                item.cash_type = item.cash_type === 1 ? "金额" : "比例";
                item.store_type = item.store_type === 1 ? "金额" : "比例";
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
            getPayGiftList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.payGiftForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加的form数据
        const formPayGift = reactive({});
        // 添加
        const onSubmit = () => {
            proxy.$refs.payGiftForm.validate(async (valid) => {
                if (formPayGift.status === "在用"){
                    formPayGift.status = 1;
                }else if (formPayGift.status === "停用"){
                    formPayGift.status = 2;
                }

                if (formPayGift.add_money_type === "金额"){
                    formPayGift.add_money_type = 1;
                }else if (formPayGift.add_money_type === "比例"){
                    formPayGift.add_money_type = 2;
                }

                if (formPayGift.cash_type === "金额"){
                    formPayGift.cash_type = 1;
                }else if (formPayGift.cash_type === "比例"){
                    formPayGift.cash_type = 2;
                }

                if (formPayGift.store_type === "金额"){
                    formPayGift.store_type = 1;
                }else if (formPayGift.store_type === "比例"){
                    formPayGift.store_type = 2;
                }

                if (formPayGift.type === "正常"){
                    formPayGift.type = 1;
                }else if (formPayGift.type === "首提"){
                    formPayGift.type = 2;
                }

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.savePayGift(formPayGift);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.payGiftForm.resetFields();
                            getPayGiftList(config);
                        }
                    } else {
                        let res = await proxy.$api.savePayGift(formPayGift);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.payGiftForm.resetFields();
                            getPayGiftList(config);
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
            proxy.$refs.payGiftForm.resetFields();
            reset()
        };
        const reset = () => {
            formPayGift.id = 0;
            formPayGift.created_at = "";
            formPayGift.updated_at = "";
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
                Object.assign(formPayGift, row);
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
                    await proxy.$api.delPayGift({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getPayGiftList(config);
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
            formPayGift,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleAdd,
            handleDelete,
            amountType,
            statusArr,
            typeArr,
            replaceList,
            typeMp,
            showReplace,
            handleTypeChange,
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
