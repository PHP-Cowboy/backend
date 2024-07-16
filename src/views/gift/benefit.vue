<template>

    <div class="user-header">

        <el-button type="primary" plain @click="handleAdd">+新增</el-button>
        <el-button v-if="!onOff" type="success" @click="onOffToggle(0)" plain>开启礼包</el-button>
        <el-button v-if="onOff" type="warning" @click="onOffToggle(1)" plain>关闭礼包</el-button>

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
            <el-table-column fixed="right" label="操作" min-width="145">
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
        :title="action === 'add' ? '新增救济金配置' : '编辑救济金配置'"
        width="45%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formBenefit" ref="benefitForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="用户类型"
                        prop="user_type"
                    >
                        <el-input v-model="formBenefit.user_type" placeholder="请输入用户类型"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="累计充值最小额度"
                        prop="minimum"
                        :rules="[{ required: true, message: '累计充值最小额度是必填项' }]"
                    >
                        <el-input v-model.number="formBenefit.minimum" maxlength="9" placeholder="请输入累计充值最小额度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="累计充值最大额度"
                        prop="maximum"
                        :rules="[{ required: true, message: '累计充值最大额度是必填项' }]"
                    >
                        <el-input v-model.number="formBenefit.maximum" maxlength="9" placeholder="请输入累计充值最大额度"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="触发破产礼包未购次数下限"
                        prop="mini_times"
                        :rules="[{ required: true, message: '触发破产礼包未购次数下限是必填项' }]"
                    >
                        <el-input v-model.number="formBenefit.mini_times" maxlength="9" placeholder="请输入触发破产礼包未购次数下限"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="触发破产礼包未购次数上限"
                        prop="maxi_times"
                        :rules="[{ required: true, message: '触发破产礼包未购次数上限是必填项' }]"
                    >
                        <el-input v-model.number="formBenefit.maxi_times" maxlength="9" placeholder="请输入触发破产礼包未购次数上限"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="推荐礼包档位"
                        prop="quota"
                        :rules="[{ required: true, message: '推荐礼包档位是必填项' }]"
                    >
                        <el-input v-model.number="formBenefit.quota" maxlength="9" placeholder="请输入推荐礼包档位"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="价值"
                        prop="value"
                        :rules="[{ required: true, message: '价值是必填项' }]"
                    >
                        <el-input v-model.number="formBenefit.value" maxlength="9" placeholder="请输入价值"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="基础奖励"
                        prop="basic_rewards"
                        :rules="[{ required: true, message: '基础奖励是必填项' }]"
                    >
                        <el-input v-model.number="formBenefit.basic_rewards" maxlength="9" placeholder="请输入基础奖励"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="基础奖励类别"
                        prop="basic_type"
                        :rules="[{ required: true, message: '基础奖励类别是必填项' }]"
                    >
                        <el-select v-model="formBenefit.basic_type" placeholder="请选择基础奖励类别">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="赠送额度"
                        prop="reward_giveaways"
                        :rules="[{ required: true, message: '赠送额度是必填项' }]"
                    >
                        <el-input v-model.number="formBenefit.reward_giveaways" maxlength="9" placeholder="请输入赠送额度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="赠送类别"
                        prop="gift_type"
                        :rules="[{ required: true, message: '赠送类别是必填项' }]"
                    >
                        <el-select v-model="formBenefit.gift_type" placeholder="请选择赠送类别">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="赠送2额度"
                        prop="bonus"
                        :rules="[{ required: true, message: '赠送2额度是必填项' }]"
                    >
                        <el-input v-model.number="formBenefit.bonus" maxlength="9" placeholder="请输入赠送2额度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="赠送2类别"
                        prop="bonus_type"
                        :rules="[{ required: true, message: '赠送2类别是必填项' }]"
                    >
                        <el-select v-model="formBenefit.bonus_type" placeholder="请选择赠送2类别">
                            <el-option v-for="status in coinTypes" :label="status.label" :value="status.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="折扣比例"
                        prop="ratio"
                        :rules="[{ required: true, message: '折扣比例是必填项' }]"
                    >
                        <el-input v-model.number="formBenefit.ratio" maxlength="9" placeholder="请输入折扣比例"/>
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
                width:40,
            },
            {
                prop: "user_type",
                label: "用户类型",
                width:80,
            },
            {
                prop: "minimum",
                label: "累计充值最小额度",
                width:100,
            },
            {
                prop: "maximum",
                label: "累计充值最大额度",
                width:100,
            },
            {
                prop: "mini_times",
                label: "触发破产礼包未购次数下限",
                width:80,
            },
            {
                prop: "maxi_times",
                label: "触发破产礼包未购次数上限",
                width:80,
            },
            {
                prop: "quota",
                label: "推荐礼包档位",
                width:120,
            },
            {
                prop: "value",
                label: "价值",
                width:120,
            },
            {
                prop: "basic_rewards",
                label: "基础奖励",
                width:120,
            },
            {
                prop: "basic_type",
                label: "基础奖励类别",
                width:120,
            },
            {
                prop: "reward_giveaways",
                label: "赠送额度",
                width:120,
            },
            {
                prop: "gift_type",
                label: "赠送类别",
                width:120,
            },
            {
                prop: "bonus",
                label: "赠送2额度",
                width:120,
            },
            {
                prop: "bonus_type",
                label: "赠送2类别",
                width:120,
            },
            {
                prop: "ratio",
                label: "折扣比例",
                width:120,
            },
        ]);
        const onOff = ref(false)
        const coinTypes = [
            {label: "cash", value: 1},
            {label: "bonus", value: 2},
            {label: "giftCash", value: 3},
        ];
        onMounted(() => {
            benefitStatus()
            // getBenefitList(config);
        });
        const config = reactive({
            user_type: "",
            size:10,
            total:0,
        });

        const benefitStatus = async() => {
            onOff.value = await proxy.$api.benefitStatus();
        }

        const onOffToggle = async (status) => {
            ElMessageBox.confirm("确定?")
                .then(() => {
                    let res = proxy.$api.onOffBenefit({status:status});

                    if (res) {
                        ElMessage({
                            showClose: true,
                            message: "操作成功",
                            type: "success",
                        });
                    }
                    onOff.value = !status

                    // benefitStatus()
                })
                .catch(() => {
                    // catch error
                });


        }

        const getBenefitList = async (config) => {
            let res = await proxy.$api.getBenefitList(config);

            config.total = res.total

            list.value = res.list.map((item) => {
                switch (item.basic_type){
                    case 1:
                        item.basic_type = "cash"
                        break

                    case 2:
                        item.basic_type = "bonus"
                        break

                    case 3:
                        item.basic_type = "giftCash"
                        break
                }

                switch (item.gift_type){
                    case 1:
                        item.gift_type = "cash"
                        break

                    case 2:
                        item.gift_type = "bonus"
                        break

                    case 3:
                        item.gift_type = "giftCash"
                        break
                }

                switch (item.bonus_type){
                    case 1:
                        item.bonus_type = "cash"
                        break

                    case 2:
                        item.bonus_type = "bonus"
                        break

                    case 3:
                        item.bonus_type = "giftCash"
                        break
                }

                return item;
            });
        };
        const changePage = (page) => {
            config.page = page;
            getBenefitList(config);
        };

        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getBenefitList(config);
        }

        const formInline = reactive({
            keyword: "",
        });
        const handleSearch = () => {
            config.user_type = formInline.keyword;
            getBenefitList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.benefitForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加用户的form数据
        const formBenefit = reactive({});
        // 添加用户
        const onSubmit = () => {
            proxy.$refs.benefitForm.validate(async (valid) => {
                switch (formBenefit.basic_type) {
                    case "cash":
                        formBenefit.basic_type = 1
                        break

                    case "bonus":
                        formBenefit.basic_type = 2
                        break

                    case "giftCash":
                        formBenefit.basic_type = 3
                        break
                }

                switch (formBenefit.gift_type) {
                    case "cash":
                        formBenefit.gift_type = 1
                        break

                    case "bonus":
                        formBenefit.gift_type = 2
                        break

                    case "giftCash":
                        formBenefit.gift_type = 3
                        break
                }

                switch (formBenefit.bonus_type) {
                    case "cash":
                        formBenefit.bonus_type = 1
                        break

                    case "bonus":
                        formBenefit.bonus_type = 2
                        break

                    case "giftCash":
                        formBenefit.bonus_type = 3
                        break
                }

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveBenefit(formBenefit);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.benefitForm.resetFields();
                            getBenefitList(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.saveBenefit(formBenefit);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.benefitForm.resetFields();
                            getBenefitList(config);
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
            proxy.$refs.benefitForm.resetFields();
            reset()
        };
        const reset = () => {
            formBenefit.id = 0;//编辑时携带的id未被重置
            formBenefit.created_at = "";
            formBenefit.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑用户
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formBenefit, row);
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
                    await proxy.$api.delBenefit({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getBenefitList(config);
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
            handleSizeChange,
            formInline,
            handleSearch,
            dialogVisible,
            handleClose,
            formBenefit,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleAdd,
            handleDelete,
            coinTypes,
            onOff,
            onOffToggle,
        };
    },
});
</script>

<style lang="less" scoped>
.table {
    position: relative;
    height: 760px;
}

.user-header {
    display: flex;
    //justify-content: space-between;
}

</style>
