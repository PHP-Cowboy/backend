<template>
    <div class="user-header">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-input v-model.number="formInline.uid" maxlength="12" clearable placeholder="请输入用户ID"/>
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
                    label="登录方式"
                    prop="is_guest"
                >
                    <el-select v-model="formInline.is_guest" clearable placeholder="请选择">
                        <el-option v-for="ml in modeList" :label="ml.label" :value="ml.value"/>
                    </el-select>
                </el-form-item>
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

            <el-form-item label="资产范围下限">
                <el-input v-model.number="formInline.asset_min" maxlength="12" clearable placeholder="请输入资产范围下限"/>
            </el-form-item>

            <el-form-item label="资产范围上限">
                <el-input v-model.number="formInline.asset_max" maxlength="12" clearable placeholder="请输入资产范围上限"/>
            </el-form-item>

            <el-form-item label="充值总币范围下限">
                <el-input v-model.number="formInline.recharge_min" maxlength="12" clearable placeholder="请输入充值总币范围下限"/>
            </el-form-item>

            <el-form-item label="充值总币范围上限">
                <el-input v-model.number="formInline.recharge_max" maxlength="12" clearable placeholder="请输入充值总币范围上限"/>
            </el-form-item>

            <el-form-item label="赠送总币范围下限">
                <el-input v-model.number="formInline.gift_coin_min" maxlength="12" clearable placeholder="请输入赠送总币范围下限"/>
            </el-form-item>

            <el-form-item label="赠送总币范围上限">
                <el-input v-model.number="formInline.gift_coin_max" maxlength="12" clearable placeholder="请输入赠送总币范围上限"/>
            </el-form-item>

            <el-form-item label="注册时间">
                <el-date-picker
                    v-model="formInline.created_at"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :size="size"
                />
            </el-form-item>

            <el-form-item label="最后登录时间">
                <el-date-picker
                    v-model="formInline.updated_at"
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
    <div class="table">
        <el-table :data="list" style="width: 100%">
            <el-table-column
                sortable
                v-for="item in tableLabel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width ? item.width : 130"
            />
            <el-table-column fixed="right" label="操作" min-width="75">
                <template #default="scope">
                    <el-button size="small" @click="detail(scope.row)">明细</el-button>
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

</template>

<script>
import {
    defineComponent,
    getCurrentInstance,
    onMounted,
    ref,
    reactive,
} from "vue";

import { useRouter } from 'vue-router';
import {formatDateTimeRangeWithTimes} from "../../assets/js/utils/time_util.js";
import {exportExcel} from "../../assets/js/excel/export.js";


export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const router = useRouter();
        const currentComponent = ref(null);
        const list = ref([]);
        const channelList = ref([])
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
                prop:"phone",
                label: "手机号",
            },
            {
                prop: "is_guest",
                label: "登录方式",
            },
            {
                prop: "pay_status",
                label: "付费状态",
            },
            {
                prop: "channel",
                label: "渠道",
            },
            {
                prop: "channel_id",
                label: "渠道号",
            },
            {
                prop: "reg_version",
                label: "注册版本号",
            },
            {
                prop: "created_at",
                label: "注册时间",
                width:160,
            },
            {
                prop: "updated_at",
                label: "最后登录时间",
                width:160,
            },
            {
                prop: "asset",
                label: "总资产",
            },
            {
                prop: "recharge",
                label: "充值金币总额",
            },
            {
                prop: "gift_cash",
                label: "赠送金币总额",
            },
            {
                prop: "reg_ip",
                label: "注册ip",
            },
            {
                prop: "device",
                label: "注册设备号",
                width:320,
            },
        ]);
        const modeList = [
            {label: "游客", value: 1},
            {label: "手机号", value: 0},
        ];

        const payStatusList = [
            {label: "付费用户", value: 1},
            {label: "免费用户", value: 0},
        ];

        const chanMap = reactive(new Map())

        onMounted(() => {
            getRoleChannel();
            // getGameUserList(config);
        });
        const config = reactive({
            size:10,
            total:0,
        });
        const changePage = (page) => {
            config.page = page;
            getGameUserList(config);
        };

        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getGameUserList(config);
        }
        
        const detail = (row) => {
            currentComponent.value = 'userList';
            router.push({ path: 'userInfo', query: { uid: row.uid } });
        }
        
        const getRoleChannel = async () => {
            let res = await proxy.$api.getRoleChannel();

            channelList.value = res;

            let mp = new Map();

             res.map((item) => {
                mp.set(item.id,item.channel_name)
            });

            chanMap.value = mp
        };
        const getGameUserList = async (config) => {
            let res = await proxy.$api.getGameUserList(config);

            list.value = res.list.map((item) => {
                switch (item.is_guest) {
                    case 1:
                        item.is_guest = "游客";
                        break
                    case 0:
                        item.is_guest = "手机号";
                        break
                    default:
                        item.is_guest = "其他";
                }

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

                item.channel = chanMap.value.get(item.channel_id);
                return item;
            });

            config.total = res.total
        };
        const formInline = reactive({});

        const getConfig = () => {
            if (formInline.is_guest === 0 || formInline.is_guest === 1){
                config.is_guest = formInline.is_guest;
            }else {
                config.is_guest = null
            }
            config.uid = formInline.uid;
            config.channel_id = formInline.channel_id;
            config.pay_status = formInline.pay_status;
            config.asset_min = formInline.asset_min;
            config.asset_max = formInline.asset_max;
            config.recharge_min = formInline.recharge_min;
            config.recharge_max = formInline.recharge_max;
            config.gift_coin_min = formInline.gift_coin_min;
            config.gift_coin_max = formInline.gift_coin_max;

            if (formInline.created_at === undefined || formInline.created_at === null){
                delete config.created_at;
            }else {
                config.created_at = formatDateTimeRangeWithTimes(formInline.created_at);
            }

            if (formInline.updated_at === undefined || formInline.updated_at === null){
                delete config.updated_at;
            }else {
                config.updated_at = formatDateTimeRangeWithTimes(formInline.updated_at);
            }

            return config
        }

        const handleSearch = () => {

            let config = getConfig()

            getGameUserList(config);
        };

        const exportToExcel = async () => {
            let config = getConfig()

            let size = config.size

            config.page = 1;
            config.size = 9999

            const ws_data = [];

            let res = await proxy.$api.getGameUserList(config);

            config.size = size;

            const header = [];

            tableLabel.forEach((item) => {
                header.push(item.label);
            });

            ws_data.push(header);

            res.list.forEach((item) => {
                switch (item.is_guest) {
                    case 1:
                        item.is_guest = "游客";
                        break
                    case 0:
                        item.is_guest = "手机号";
                        break
                    default:
                        item.is_guest = "其他";
                }

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

                item.channel = chanMap.value.get(item.channel_id);

                const row = [
                    item.id,item.user_name,item.uid,item.phone,item.is_guest,item.pay_status,item.channel,item.channel_id,
                    item.reg_version,item.created_at,item.updated_at,item.asset,item.recharge,item.gift_cash,item.reg_ip,item.device,
                ];

                ws_data.push(row);
            });

            exportExcel(ws_data,"用户列表");
        }

        return {
            list,
            tableLabel,
            config,
            formInline,
            handleSearch,
            exportToExcel,
            modeList,
            payStatusList,
            channelList,
            chanMap,
            changePage,
            handleSizeChange,
            detail,
        };
    },
});
</script>

<style lang="less" scoped>
.table {
    position: relative;
    height: 560px;
}

.user-header {
    display: flex;
    justify-content: space-between;
}
</style>
