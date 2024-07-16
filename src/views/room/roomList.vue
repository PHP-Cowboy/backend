<template>
    <div class="user-header">
        <el-button type="primary" plain @click="handleAdd">+新增</el-button>

        <el-upload
            action
            accept=".xlsx,.xls"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="uploadExcel"
        >
            <el-button type="success">Excel上传</el-button>
        </el-upload>

        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input v-model="formInline.keyword" clearable placeholder="房间名称"/>
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
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="small" @click="detail(scope.row)">配置明细</el-button>
                    <el-upload
                        action
                        accept=".xlsx,.xls"
                        :auto-upload="false"
                        :show-file-list="false"
                        :on-change="uploadExcel"
                    >
                        <el-button type="success">Excel上传</el-button>
                    </el-upload>
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
        :title="action === 'add' ? '新增房间' : '编辑房间'"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formRoom" ref="roomForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="服务器ID"
                        prop="svr_id"
                        :rules="[{ required: true, message: '服务器ID是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.svr_id" placeholder="请输入服务器ID"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="游戏ID"
                        prop="game_id"
                        :rules="[{ required: true, message: '游戏ID是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.game_id" placeholder="请输入游戏ID"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="房间index"
                        prop="room_index"
                        :rules="[{ required: true, message: '房间index是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.room_index" placeholder="请输入房间index"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="底注"
                        prop="base"
                        :rules="[{ required: true, message: '底注是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.base" placeholder="请输入底注"/>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="进入下限"
                        prop="min_entry"
                        :rules="[{ required: true, message: '进入下限是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.min_entry" placeholder="请输入进入下限"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="进入上限"
                        prop="max_entry"
                        :rules="[{ required: true, message: '进入上限是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.max_entry" placeholder="请输入进入上限"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="房间名称"
                        prop="room_name"
                        :rules="[{ required: true, message: '房间名称是必填项' }]"
                    >
                        <el-input v-model="formRoom.room_name" placeholder="请输入房间名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="房间描述"
                        prop="desc"
                    >
                        <el-input v-model="formRoom.desc" placeholder="请输入房间描述"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="房间赠送"
                        prop="room_welfare"
                        :rules="[{ required: true, message: '房间赠送是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.room_welfare" placeholder="请输入房间赠送"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="房间类型"
                        prop="room_type"
                        :rules="[{ required: true, message: '房间类型是必选项' }]"
                    >
                        <el-select v-model="formRoom.room_type" placeholder="请选择">
                            <el-option v-for="type in roomTypeArr" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="房间开关"
                        prop="room_switch"
                        :rules="[{ required: true, message: '房间开关是必选项' }]"
                    >
                        <el-select v-model="formRoom.room_switch" placeholder="请选择">
                            <el-option v-for="type in roomSwitchArr" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="税千分比"
                        prop="tax"
                        :rules="[{ required: true, message: '税千分比是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.tax" placeholder="请输入税千分比"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="比例千分比"
                        prop="bonus_discount"
                        :rules="[{ required: true, message: '比例千分比是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.bonus_discount" placeholder="请输入比例千分比"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="ai开关"
                        prop="ai_switch"
                        :rules="[{ required: true, message: 'ai开关是必选项' }]"
                    >
                        <el-select v-model="formRoom.ai_switch" placeholder="请选择">
                            <el-option v-for="type in aiSwitchArr" :label="type.label" :value="type.value"/>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="ai人数限制"
                        prop="ai_limit"
                        :rules="[{ required: true, message: 'ai人数限制是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.ai_limit" placeholder="请输入ai人数限制"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="奖金池ID"
                        prop="pool_id"
                        :rules="[{ required: true, message: '奖金池ID是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.pool_id" placeholder="请输入奖金池ID"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="充值准入值"
                        prop="recharge_limit"
                        :rules="[{ required: true, message: '充值准入值是必填项' }]"
                    >
                        <el-input v-model.number="formRoom.recharge_limit" placeholder="请输入充值准入值"/>
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


    <el-dialog
        v-model="showDetail"
        title="特殊配置"
        width="55%"
        :before-close="detailClose"
    >
        <el-form :inline="true" :model="formRoom" ref="roomForm">
            <textarea rows="20" cols="110" v-model="formRoom.ext_data" />
            <el-row style="justify-content: flex-end">
                <el-form-item>
                    <el-button type="primary" @click="detailClose">取消</el-button>
                    <el-button type="primary" @click="changeDetail">确定</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>
</template>


<script>
import {readFile, delay, slot} from '../../assets/js/utils.js';
import * as xlsx from "xlsx";
import {
    defineComponent,
    getCurrentInstance,
    onMounted,
    ref,
    reactive, onBeforeMount,
} from "vue";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const tableLabel = reactive([
            {
                prop: "room_id",
                label: "RoomId",
                width:120,
            },
            {
                prop: "svr_id",
                label: "服务器ID",
            },
            {
                prop: "game_id",
                label: "游戏ID",
            },
            {
                prop: "base",
                label: "底注",
            },
            {
                prop: "min_entry",
                label: "进入下限",
            },
            {
                prop: "max_entry",
                label: "进入上限",
            },
            {
                prop: "room_name",
                label: "房间名称",
            },
            {
                prop: "room_type_str",
                label: "房间类型",
            },
            {
                prop: "room_switch_str",
                label: "房间开关",
            },
            {
                prop: "room_welfare",
                label: "房间赠送",
            },
            {
                prop: "tax",
                label: "税千分比",
            },
            {
                prop: "bonus_discount",
                label: "比例千分比",
            },
            {
                prop: "ai_switch_str",
                label: "ai开关",
            },
            {
                prop: "ai_limit",
                label: "ai人数限制",
            },
            {
                prop: "pool_id",
                label: "奖金池ID",
            },
            {
                prop: "recharge_limit",
                label: "充值准入值",
            },
        ]);
        const columns = ref([])
        onBeforeMount(()=>{
            getColumnComment()
        })

        onMounted(() => {
            // getRoomList(config);
        });
        const roomTypeArr = reactive([
            {label:"体验大厅",value:1},
            {label:"大厅",value:2},
        ]);

        const roomSwitchArr = reactive([
            {label:"关",value:0},
            {label:"开",value:1},
        ]);

        const aiSwitchArr = reactive([
            {label:"开",value:0},
            {label:"关",value:1},
        ]);

        const config = reactive({
            size:10,
            total:0,
        });

        const getColumnComment = async (config) => {
            let data = await proxy.$api.getColumnComment(config);

            data.forEach(item => {

                tableLabel.push({prop:item.column_name,label:item.column_comment})

            })

            columns.value = data

            console.log(columns.value)
        }

        const getRoomList = async (config) => {
            let data = await proxy.$api.getRoomList(config);
            config.total = data.total;
            list.value = data.list.map((item)=>{
                switch (item.room_type){
                    case 1:
                        item.room_type_str = '体验大厅';
                        break
                    case 2:
                        item.room_type_str = '大厅';
                        break
                }
                item.ai_switch === 1 ? item.ai_switch_str = '关' : item.ai_switch_str = '开';
                item.room_switch === 0 ? item.room_switch_str = '关' : item.room_switch_str = '开';
                return item
            })
        };
        const changePage = (page) => {
            config.page = page;
            getRoomList(config);
        };

        const handleSizeChange = (size) => {
            config.page = Math.ceil(config.total / size)
            config.size = size;
            getPrizeList(config);
        }

        const formInline = reactive({
            keyword: "",
        });
        const handleSearch = () => {
            config.room_name = formInline.keyword;
            getRoomList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const showDetail = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.roomForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };
        // 添加的form数据
        const formRoom = reactive({
            name: "", // 添加 事件名称
        });

        const changeDetail = async () => {
            let res = await proxy.$api.saveRoom(formRoom);
            if (res) {
                ElMessage({
                    showClose: true,
                    message: "修改成功",
                    type: "success",
                });
                showDetail.value = false;
                getRoomList(config);
            }else {
                ElMessage({
                    showClose: true,
                    message: "修改失败",
                    type: "error",
                });
            }
        }

        // 添加
        const onSubmit = () => {
            proxy.$refs.roomForm.validate(async (valid) => {

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveRoom(formRoom);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.roomForm.resetFields();
                            getRoomList(config);
                        }
                    } else {
                        let res = await proxy.$api.saveRoom(formRoom);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.roomForm.resetFields();
                            getRoomList(config);
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
            proxy.$refs.roomForm.resetFields();
            reset()
        };
        const reset = () => {
            formRoom.id = 0;
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formRoom, row);
            });
        };
        const detail = (row) => {
            showDetail.value = true;
            proxy.$nextTick(() => {
                Object.assign(formRoom, row);
            });
        }

        const detailClose = () => {
            showDetail.value = false;
        };

        // 新增
        const handleAdd = () => {
            action.value = "add";
            dialogVisible.value = true;
        };
        const uploadExcel = async (e) =>{
            let file = e.raw
            if (!file) return

            await delay(300)

            // 读取FILE中的数据
            let data = await readFile(file)
            let workbook = xlsx.read(data, { type: 'binary' }),
                worksheet = workbook.Sheets[workbook.SheetNames[0]],
                list = xlsx.utils.sheet_to_json(worksheet)
            // console.log(list)

            // 把读取出来的数据变为可以提交为服务器的数据格式
            let arr = []
            let oldData = JSON.parse(window.localStorage.getItem('excel') || '[]')
            let index = oldData.length
            list.forEach(item => {
                let obj = {}
                for (let key in slot) {
                    if (!slot.hasOwnProperty(key)) break
                    let v = slot[key],
                        text = v.text,
                        type = v.type
                    v = item[text] || ''
                    type === 'string' ? (v = String(v)) : null;
                    type === 'number' ? (v = Number(v)) : null;
                    type === 'array' ? (v= v.slice(1, -1).split(",").map(Number)) : [];
                    obj[key] = v
                }
                obj.id = ++index
                obj.time = new Date()
                arr.push(obj)
            })

            let res = await proxy.$api.updateExtDataByExcel(arr);
            if (res) {
                ElMessage({
                    showClose: true,
                    message: "上传成功",
                    type: "success",
                });
            }

            // console.log(arr);
        }
        return {
            list,
            tableLabel,
            config,
            formInline,
            handleSearch,
            dialogVisible,
            showDetail,
            handleClose,
            detailClose,
            formRoom,
            changeDetail,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            detail,
            handleAdd,
            changePage,
            handleSizeChange,
            roomTypeArr,
            roomSwitchArr,
            aiSwitchArr,
            uploadExcel,
        };
    },
});
</script>

<style lang="less" scoped>
.table {
    position: relative;
    height: 700px;
}

.user-header {
    display: flex;
    justify-content: space-between;
}
</style>
