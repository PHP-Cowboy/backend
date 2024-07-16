<template>
    <div class="user-header">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-input v-model.number="formInline.uid" maxlength="12" clearable placeholder="请输入用户ID"/>
            </el-form-item>

            <el-form-item>
                <el-form-item
                    label="付费属性"
                    prop="pay_status"
                >
                    <el-select v-model="formInline.pay_status" clearable placeholder="请选择">
                        <el-option v-for="ml in payStatusList" :label="ml.label" :value="ml.value"/>
                    </el-select>
                </el-form-item>
            </el-form-item>

            <el-form-item>
                <el-form-item
                    label="订单状态"
                    prop="status"
                >
                    <el-select v-model="formInline.status" clearable placeholder="请选择">
                        <el-option v-for="ml in statusList" :label="ml.label" :value="ml.value"/>
                    </el-select>
                </el-form-item>
            </el-form-item>

            <el-form-item>
                <el-form-item
                    label="渠道"
                    prop="channel_id"
                >
                    <el-select v-model="formInline.channel_id" clearable placeholder="请选择">
                        <el-option v-for="cl in channelList" :label="cl.channel_name" :value="cl.id"/>
                    </el-select>
                </el-form-item>
            </el-form-item>

            <el-form-item>
                <el-form-item
                    label="赠送金币渠道"
                    prop="pay_channel_id"
                >
                    <el-select v-model="formInline.pay_channel_id" clearable placeholder="请选择">
                        <el-option v-for="cl in giveChannelList" :label="cl.name" :value="cl.id"/>
                    </el-select>
                </el-form-item>
            </el-form-item>

            <el-form-item label="实际赠送金币比下限">
                <el-input v-model.number="formInline.give_rate_min" maxlength="12" clearable placeholder="请输入"/>
            </el-form-item>

            <el-form-item label="实际赠送金币比上限">
                <el-input v-model.number="formInline.give_rate_max" maxlength="12" clearable placeholder="请输入"/>
            </el-form-item>

            <el-form-item label="提交赠送金币比下限">
                <el-input v-model.number="formInline.commit_give_rate_min" maxlength="12" clearable placeholder="请输入"/>
            </el-form-item>

            <el-form-item label="提交赠送金币比上限">
                <el-input v-model.number="formInline.commit_give_rate_max" maxlength="12" clearable placeholder="请输入"/>
            </el-form-item>

            <el-form-item label="日期查询">
                <el-date-picker
                    v-model="formInline.created_at"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :size="size"
                />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" plain @click="handleSearch">搜索</el-button>
                <el-button type="success" @click="exportToExcel">导出</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div>
        <el-button type="primary" @click="batchPass">批量通过</el-button>
        <el-button type="danger" @click="batchRepulse">批量拒绝</el-button>
<!--        <el-button type="warning">批量主动取消</el-button>-->
        <el-button type="danger" @click="batchInvalid">批量作废</el-button>
        <el-button :type=buttonColor @click="autoApprovalRules">设置自动审批规则</el-button>
<!--        <el-button type="info">设置自动审批开关</el-button>-->
    </div>

    <div class="table">
        <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column
                sortable
                v-for="item in tableLabel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width ? item.width : 130"
            />
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
        title="设置自动审批规则"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formApprovalRules" ref="approvalRulesForm">
            <el-row>
                <span>
                    自动审批开关
                </span>
                <el-switch
                    :span="24"
                    v-model="formApprovalRules.switch"
                >
                </el-switch>

                <el-col :span="24">
                    <el-form-item
                        label="单笔最高金额"
                        prop="singleMaxAmount"
                        :rules="[{ required: true, message: '单笔最高金额是必填项' }]"
                    >
                        <el-input v-model="formApprovalRules.singleMaxAmount" placeholder="请输入单笔最高金额"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item
                        label="单日总金额"
                        prop="dailyTotal"
                        :rules="[
              { required: true, message: '单日总金额是必填项' }
            ]"
                    >
                        <el-input v-model="formApprovalRules.dailyTotal" maxlength="9" placeholder="请输入单日总金额"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item
                        label="自动审批充提比"
                        prop="rechargeWithdrawRate"
                        :rules="[{ required: true, message: '自动审批充提比是必填项' }]"
                    >
                        <el-input v-model="formApprovalRules.rechargeWithdrawRate" placeholder="请输入自动审批充提比"/>
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
import {exportExcel} from "../../assets/js/excel/export.js";
import {formatDateTimeRangeWithTimes} from "../../assets/js/utils/time_util.js";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const channelList = ref([])
        const giveChannelList = ref([]);
        const tableLabel = reactive([
            {
                prop: "id",
                label: "ID",
            },
            {
                prop: "user_name",
                label: "用户昵称",
                width:150,
            },
            {
                prop: "uid",
                label: "用户ID",
            },
            {
                prop: "pay_channel_name",
                label: "赠送金币渠道",
            },
            {
                prop:"amount",
                label: "赠送金币",
            },
            {
                prop: "amount_total",
                label: "赠送总币",
            },
            {
                prop: "recharge",
                label: "充值总币",
            },
            {
                prop: "give_rate",
                label: "实际赠送金币比",
            },
            {
                prop: "commit_give_rate",
                label: "提交赠送金币比",
            },
            {
                prop: "status",
                label: "订单状态",
            },
            {
                prop: "auditor",
                label: "审核人",
            },
            {
                prop: "audit_time",
                label: "审核时间",
            },
            {
                prop: "order_no",
                label: "订单号",
            },
            {
                prop: "trd_order_no",
                label: "三方单号",
            },
            {
                prop: "created_at",
                label: "申请时间",
            },
            {
                prop: "arrival_time",
                label: "到账时间",
            },
            {
                prop: "cancel_time",
                label: "主动取消时间",
            },
            {
                prop: "void_time",
                label: "作废时间",
            },
            {
                prop: "void_operator",
                label: "作废操作人",
            },
            {
                prop: "channel_code",
                label: "渠道号",
            },
            {
                prop: "give_mode",
                label: "赠送金币方式",
            },
            {
                prop: "ifsc",
                label: "IFSC",
                width:160,
            },
            {
                prop: "pay_status",
                label: "付费状态",
            },
            {
                prop: "tax_rate",
                label: "税收(%)",
            },
        ]);
        const statusList = [
            {label: "待审核", value: 1},
            {label: "用户取消", value: 2},
            {label: "拒绝", value: 3},
            {label: "作废", value: 4},
            {label: "等待第三方回复", value: 5},
            {label: "已到账", value: 6},
            {label: "代付失败", value: 7},
            {label: "代付上游撤销", value: 8},
            {label: "异常", value: 9},
        ];
        const dialogVisible = ref(false)
        const buttonColor = ref("success")
        let selectedIds = ref([]);
        let formApprovalRules = reactive({});

        const payStatusList = [
            {label: "付费用户", value: 1},
            {label: "免费用户", value: 0},
        ];

        const chanMap = reactive(new Map())
        const payChanMap = reactive(new Map())

        onMounted(() => {
            getRoleChannel();
            getPayConfigList();
            // getGiveList(config);
        });
        const config = reactive({
            size:10,
            total:0,
        });

        const handleSelectionChange = (val) => {
            selectedIds = []
            val.forEach(function (item) {
                selectedIds.push(item.id);
            })
        }

        //批量通过
        const batchPass = async () => {
            if (selectedIds.length <= 0){
                ElMessage({
                    showClose: true,
                    message: "请先选择要通过得数据",
                    type: "error",
                });
                return
            }

            let res = await proxy.$api.batchPass({"ids":selectedIds});
            if (res) {
                ElMessage({
                    showClose: true,
                    message: "通过成功",
                    type: "success",
                });
                dialogVisible.value = false;
                getGiveList(config)
            }else {
                ElMessage({
                    showClose: true,
                    message: "通过失败",
                    type: "error",
                });
            }
        }

        //批量拒绝
        const batchRepulse = async() => {
            if (selectedIds.length <= 0){
                ElMessage({
                    showClose: true,
                    message: "请先选择要拒绝得数据",
                    type: "error",
                });
            }
            let res = await proxy.$api.batchRepulse({"ids":selectedIds});
            if (res) {
                ElMessage({
                    showClose: true,
                    message: "拒绝成功",
                    type: "success",
                });
                dialogVisible.value = false;
                getGiveList(config)
            }else {
                ElMessage({
                    showClose: true,
                    message: "拒绝失败",
                    type: "error",
                });
            }
        }

        //批量作废
        const batchInvalid = async() => {
            if (selectedIds.length <= 0){
                ElMessage({
                    showClose: true,
                    message: "请先选择要作废得数据",
                    type: "error",
                });
            }

            let res = await proxy.$api.batchInvalid({"ids":selectedIds});
            if (res) {
                ElMessage({
                    showClose: true,
                    message: "作废成功",
                    type: "success",
                });
                dialogVisible.value = false;
                getGiveList(config)
            }else {
                ElMessage({
                    showClose: true,
                    message: "作废失败",
                    type: "error",
                });
            }
        }

        const autoApprovalRules = () => {
            dialogVisible.value = true
            getDictList({"type_code":"autoApprovalRules"})
        }

        const getDictList = async (params) => {
            let res = await proxy.$api.getDictList(params)

            res.map((item)=>{
                if (item.code === "switch"){
                    item.value = item.value !== "0";
                }
                formApprovalRules[item.code] = item.value;
            })
        }
        
        const onSubmit = () => {
            proxy.$refs.approvalRulesForm.validate(async (valid) => {
                if (formApprovalRules.switch){
                    formApprovalRules.switch = "1"
                }else {
                    formApprovalRules.switch = "0"
                }

                formApprovalRules.type_code = "autoApprovalRules"

                if (valid) {
                    let res = await proxy.$api.changeDictValues(formApprovalRules);
                    if (res) {
                        ElMessage({
                            showClose: true,
                            message: "设置成功",
                            type: "success",
                        });
                        dialogVisible.value = false;
                        proxy.$refs.approvalRulesForm.resetFields();
                        getPayGiftList(config);
                    }
                } else {
                    ElMessage({
                        showClose: true,
                        message: "请输入正确的内容",
                        type: "error",
                    });
                }
            });
        }

        // 取消
        const handleCancel = () => {
            dialogVisible.value = false;
            proxy.$refs.approvalRulesForm.resetFields();
        };

        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.approvalRulesForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        const changePage = (page) => {
            config.page = page;
            getGiveList(config);
        };

        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getGiveList(config);
        }
        const getRoleChannel = async () => {
            let res = await proxy.$api.getRoleChannel();

            channelList.value = res;

            let cMp = new Map();

            res.map((item) => {
                cMp.set(item.id,item.channel_name)
            });

            chanMap.value = cMp
        };
        const getPayConfigList = async () => {
            let res = await proxy.$api.getPayConfigList({page:1,size:100});

            giveChannelList.value = res.list;

            let pcMp = new Map();

            res.list.map((item) => {
                pcMp.set(item.id,item.name)
            });

            payChanMap.value = pcMp
        };
        const getGiveList = async (config) => {
            let res = await proxy.$api.getGiveList(config);

            list.value = res.list.map((item) => {

                switch (item.pay_status) {
                    case 0:
                        item.pay_status = "免费用户"
                        break

                    case 1:
                        item.pay_status = "付费用户"
                        break
                    default:
                        item.pay_status = "其他"
                        break
                }

                switch (item.status){
                    case 1:
                        item.status = "待审核"
                        break

                    case 2:
                        item.status = "用户取消"
                        break

                    case 3:
                        item.status = "拒绝"
                        break

                    case 4:
                        item.status = "作废"
                        break

                    case 5:
                        item.status = "等待第三方回复"
                        break

                    case 6:
                        item.status = "已到账"
                        break

                    case 7:
                        item.status = "代付失败"
                        break

                    case 8:
                        item.status = "代付上游撤销"
                        break

                    case 9:
                        item.status = "异常单"
                        break
                }

                item.channel = chanMap.value.get(item.channel_id);
                item.pay_channel = payChanMap.value.get(item.pay_channel_id)
                return item;
            });

            config.total = res.total
        };
        const formInline = reactive({});

        const getConfig = () => {
            config.uid = formInline.uid;
            config.pay_status = formInline.pay_status;
            config.status = formInline.status;
            config.channel_id = formInline.channel_id;
            config.pay_channel_id = formInline.pay_channel_id;
            config.give_rate_min = formInline.give_rate_min;
            config.give_rate_max = formInline.give_rate_max;
            config.commit_give_rate_min = formInline.commit_give_rate_min;
            config.commit_give_rate_max = formInline.commit_give_rate_max;

            if (typeof formInline.created_at !== "undefined"){
                config.created_at = formatDateTimeRangeWithTimes(formInline.created_at);
            }

            return config
        }

        const handleSearch = () => {
            let config = getConfig()

            getGiveList(config);
        };

        const exportToExcel = async () => {
            let config = getConfig()

            let size = config.size

            config.page = 1;
            config.size = 9999

            const ws_data = [];

            let res = await proxy.$api.getGiveList(config);

            config.size = size;

            const header = [];

            tableLabel.forEach((item) => {
                header.push(item.label);
            });

            ws_data.push(header);

            res.list.forEach((item) => {

                switch (item.pay_status) {
                    case 0:
                        item.pay_status = "免费用户"
                        break

                    case 1:
                        item.pay_status = "付费用户"
                        break
                    default:
                        item.pay_status = "其他"
                        break
                }

                switch (item.status) {
                    case 1:
                        item.status = "待审核"
                        break

                    case 2:
                        item.status = "用户取消"
                        break

                    case 3:
                        item.status = "拒绝"
                        break

                    case 4:
                        item.status = "作废"
                        break

                    case 5:
                        item.status = "打款中"
                        break

                    case 6:
                        item.status = "已到账"
                        break

                    case 7:
                        item.status = "代付失败"
                        break

                    case 8:
                        item.status = "代付上游撤销"
                        break

                    case 9:
                        item.status = "异常单"
                        break
                }

                const row = [
                    item.id,item.user_name,item.uid,item.pay_channel_name,item.amount,item.amount_total,item.recharge,item.give_rate,item.commit_give_rate,
                    item.status,item.auditor,item.audit_time,item.order_no,item.trd_order_no,item.created_at,item.arrival_time,item.cancel_time,item.void_time,
                    item.void_operator,item.channel_code,item.give_mode,item.ifsc,item.pay_status,item.tax_rate,
                ];
                ws_data.push(row);
            })

            exportExcel(ws_data,"赠送记录");
        }

        return {
            list,
            tableLabel,
            config,
            formInline,
            handleSearch,
            exportToExcel,
            statusList,
            payStatusList,
            getPayConfigList,
            channelList,
            giveChannelList,
            payChanMap,
            chanMap,
            autoApprovalRules,
            changePage,
            handleSizeChange,
            buttonColor,
            dialogVisible,
            handleClose,
            formApprovalRules,
            handleCancel,
            onSubmit,
            selectedIds,
            handleSelectionChange,
            batchPass,
            batchRepulse,
            batchInvalid,
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
