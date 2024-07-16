<template>
    <div class="user-header">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-input v-model.number="formInline.uid" maxlength="12" clearable placeholder="请输入用户ID"/>
            </el-form-item>

            <el-form-item>
                <el-form-item
                    label="房间"
                    prop="room_id"
                >
                    <el-select v-model="formInline.room_id" clearable placeholder="请选择">
                        <el-option v-for="r in roomList" :label="r.room_name" :value="r.room_id"/>
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

            <el-form-item label="充值金币范围">
                <el-input v-model.number="formInline.recharge_min" maxlength="12" clearable placeholder="请输入"/>
            </el-form-item>

            <el-form-item label="-" style="margin-left:-20px">
                <el-input v-model.number="formInline.recharge_max" maxlength="12" clearable placeholder="请输入"/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" plain @click="handleSearch">搜索</el-button>
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
import {defineComponent, getCurrentInstance, onMounted, reactive, ref,} from "vue";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const channelList = ref([])
        const roomList = ref([])
        const chanMap = reactive(new Map())
        const tableLabel = reactive([
            {
                prop: "uid",
                label: "用户ID",
                width:180,
            },
            {
                prop: "nickname",
                label: "用户昵称",
                width:180,
            },
            {
                prop: "game_name",
                label: "所在游戏",
            },
            {
                prop: "room_name",
                label: "所在房间",
            },
            {
                prop: "coin",
                label: "当前账户",
            },
            {
                prop: "win_cash",
                label: "可赠送金币账户",
                width: 180,
            },
            {
                prop: "recharge_total",
                label: "总充值金币",
            },
            {
                prop: "give_total",
                label: "总赠送金币",
            },
            {
                prop: "reg_time",
                label: "注册时间",
                width: 200,
            },
            {
                prop: "channel_name",
                label: "渠道名称",
            },
            {
                prop: "channel_code",
                label: "渠道号",
            },
        ]);

        onMounted(() => {
            getRoleChannel();
            getCommonRoomList();
            // getOnlineList(config);
        });
        const config = reactive({
            page:1,
            size:10,
            total:0,
        });
        const changePage = (page) => {
            config.page = page;
            getOnlineList(config);
        };
        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getOnlineList(config);
        }

        const getRoleChannel = async () => {
            let res = await proxy.$api.getRoleChannel();

            channelList.value = res;

            let mp = new Map();

            res.map((item) => {
                mp.set(item.id, {"channel_name":item.channel_name,"code":item.code})
            });

            chanMap.value = mp

        };

        const getCommonRoomList = async () => {
            roomList.value = await proxy.$api.getCommonRoomList();
        };

        const getOnlineList = async (config) => {
            let res = await proxy.$api.getOnlineList(config);

            // console.log(chanMap)

            list.value = res.list.map((item) => {
                let data = chanMap.value.get(item.channel_id)

                item.channel_name = data.channel_name;
                item.channel_code = data.code;
                return item;
            });

            config.total = res.total
        };
        const formInline = reactive({});
        const handleSearch = () => {
            config.page = 1;
            config.uid = formInline.uid;
            config.room_id = formInline.room_id;
            config.channel_id = formInline.channel_id;
            config.recharge_min = formInline.recharge_min;
            config.recharge_max = formInline.recharge_max;
            getOnlineList(config);
        };

        return {
            list,
            tableLabel,
            config,
            formInline,
            handleSearch,
            roomList,
            channelList,
            chanMap,
            changePage,
            handleSizeChange,
        };
    },
});
</script>

<style lang="less" scoped>
.table {
    position: relative;
    height: 620px;
}

.user-header {
    display: flex;
    justify-content: space-between;
}
</style>
