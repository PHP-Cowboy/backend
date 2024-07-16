<template>
    <div class="user-header">
        <el-form :inline="true" :model="formInline">
            <el-form-item
                prop="type"
                clearable
            >
                <el-select v-model="formInline.type" placeholder="请选择类型" clearable>
                    <el-option v-for="type in types" :label="type.label" :value="type.value"/>
                </el-select>
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
                :width="item.width ? item.width : 110"
            />
        </el-table>
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
import {string} from "mockjs/src/mock/random/basic.js";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const types = ref([
            {label:'注册人数',value:1},
            {label:'实时在线人数',value:2},
            {label:'活跃人数',value:3},
            {label:'付费人数',value:4},
            {label:'付费额度',value:5},
            {label:'提现额度',value:6},
        ])
        const tableLabel = reactive([
            {
                prop: "ymd",
                label: "日期",
                width:80,
            },
            {
                prop: "zero_num",
                label: "0:00",
            },
            {
                prop: "one_num",
                label: "1:00",
            },
            {
                prop: "two_num",
                label: "2:00",
            },
            {
                prop: "three_num",
                label: "3:00",
            },
            {
                prop: "four_num",
                label: "4:00",
            },
            {
                prop: "five_num",
                label: "5:00",
            },
            {
                prop: "six_num",
                label: "6:00",
            },
            {
                prop: "seven_num",
                label: "7:00",
            },
            {
                prop: "eight_num",
                label: "8:00",
            },
            {
                prop: "nine_num",
                label: "9:00",
            },
            {
                prop: "ten_num",
                label: "10:00",
            },
            {
                prop: "eleven_num",
                label: "11:00",
            },
            {
                prop: "twelve_num",
                label: "12:00",
            },
            {
                prop: "thirteen_num",
                label: "13:00",
            },
            {
                prop: "fourteen_num",
                label: "14:00",
            },
            {
                prop: "fifteen_num",
                label: "15:00",
            },
            {
                prop: "sixteen_num",
                label: "16:00",
            },
            {
                prop: "seventeen_num",
                label: "17:00",
            },
            {
                prop: "eighteen_num",
                label: "18:00",
            },
            {
                prop: "nineteen_num",
                label: "19:00",
            },
            {
                prop: "twenty_num",
                label: "20:00",
            },
            {
                prop: "twenty_one_num",
                label: "21:00",
            },
            {
                prop: "twenty_two_num",
                label: "22:00",
            },
            {
                prop: "twenty_three_num",
                label: "23:00",
            },
        ]);

        onMounted(() => {
            // getPerHourDataNum(config);
        });
        const config = reactive({});
        const getPerHourDataNum = async (config) => {
            let res = await proxy.$api.getPerHourDataNum(config);

            list.value = res.list;
        };
        const formInline = reactive({});
        const handleSearch = () => {
            config.type = formInline.type

            getPerHourDataNum(config);
        };

        return {
            list,
            tableLabel,
            config,
            formInline,
            types,
            handleSearch,
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
