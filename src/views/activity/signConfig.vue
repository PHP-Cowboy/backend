<template>
    <div class="table">
        <el-table :data="list" style="width: 100%">

            <el-table-column
                v-for="item in tableLabel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width ? item.width : 210"
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
        :title="action === 'add' ? '新增配置' : '编辑配置'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formConfig" ref="configForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="名称"
                        prop="name"
                        :rules="[{ required: true, message: '名称是必填项' }]"
                    >
                        <el-input v-model="formConfig.name" placeholder="请输入名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="签到次数"
                        prop="sign_num"
                        :rules="[
              { required: true, message: '签到次数是必填项' },
              { type: 'number', message: '签到次数必须是数字' },
            ]"
                    >
                        <el-input v-model.number="formConfig.sign_num" maxlength="2" placeholder="请输入签到次数"/>

                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="cash奖励"
                        prop="prize_cash_id"
                    >
                        <el-select v-model="formConfig.prize_cash_id" placeholder="请选择">
                            <el-option
                                v-for="item in prizeCash"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="bonus奖励"
                        prop="prize_bonus_id"
                    >
                        <el-select v-model="formConfig.prize_bonus_id" placeholder="请选择">
                            <el-option
                                v-for="item in prizeBonus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="签到频次"
                        prop="unit"
                    >
                        <el-select v-model="formConfig.unit" placeholder="请选择">
                            <el-option
                                v-for="item in units"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-form-item
                    label="备&nbsp;&nbsp;注"
                    prop="remark"
                >
                    <el-input v-model="formConfig.remark" placeholder="请输入备注"/>
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
import {defineComponent, getCurrentInstance, onMounted, reactive, ref,} from "vue";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const prizeCash = ref([]);
        const prizeBonus = ref([]);
        const tableLabel = reactive([
            {
                prop: "id",
                label: "ID",
            },
            {
                prop: "name",
                label: "名称",
            },
            {
                prop: "sign_num",
                label: "签到次数",
            },
            {
                prop: "cash",
                label: "cash奖励",
            },
            {
                prop: "bonus",
                label: "bonus奖励",
            },
            {
                prop: "unit",
                label: "签到频次",
            },
            {
                prop: "remark",
                label: "备注",
            },
        ]);

        const prizes = ref([]);
        const units = [
            {label:"DAY",value:"DAY"},
        ];
        onMounted(() => {
            getPrizeList()
            getSignList(config);
        });
        const config = reactive({
            name: "",
        });
        const getSignList = async (config) => {
            let data = await proxy.$api.getSignList(config)
            data.forEach((item)=>{
                if(item.prize_cash_id === 0){
                    item.prize_cash_id = ""
                }

                if (item.prize_bonus_id === 0){
                    item.prize_bonus_id = ""
                }
            })
            list.value = data
        };
        const getPrizeList = async () => {
            let cashArr= [{label:"",value:""}];
            let bonusArr = [{label:"",value:""}];
            let res = await proxy.$api.getPrizeList({page:1,size:100})

            res.list.forEach((item)=>{
                if(item.goods_type===2){
                    cashArr.push({label:item.name,value:item.id})
                }else if(item.goods_type===3){
                    bonusArr.push({label:item.name,value:item.id})
                }
            })

            prizeCash.value = cashArr
            prizeBonus.value = bonusArr

            prizes.value = res.list
        }
        const formInline = reactive({
            keyword: "",
        });
        const handleSearch = () => {
            config.name = formInline.keyword;
            getSignList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.configForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加的form数据
        const formConfig = reactive({
            id:0,
            name: "", // 添加用户的 用户名
            sign_num: "",
            prize_cash_id: "",
            prize_bonus_id: "",
            unit: "",
            remark: "",
            created_at:"",
            updated_at:"",
        });
        // 添加
        const onSubmit = () => {
            proxy.$refs.configForm.validate(async (valid) => {
                if (formConfig.prize_bonus_id === ""){
                    formConfig.prize_bonus_id = 0
                }

                if (formConfig.prize_cash_id === ""){
                    formConfig.prize_cash_id = 0
                }

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveSign(formConfig);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.configForm.resetFields();
                            getSignList(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.saveSign(formConfig);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.configForm.resetFields();
                            getSignList(config);
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
            proxy.$refs.configForm.resetFields();
            reset();
        };
        const reset = () => {
            formConfig.id = 0;//编辑时携带的id未被重置
            formConfig.created_at = "";
            formConfig.updated_at = "";
        }

        // 区分编辑和新增
        const action = ref("add");
        // 编辑
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formConfig, row);
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
                    await proxy.$api.delSign({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getSignList(config);
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
            formConfig,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleDelete,
            handleAdd,
            prizes,
            units,
            prizeBonus,
            prizeCash,
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
