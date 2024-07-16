<template>
    <el-tabs type="border-card">
        <el-tab-pane label="即发邮件">
            <el-form :model="formTimely" ref="timelyForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="邮件标题"
                            prop="title"
                            :rules="[{ required: true, message: '邮件标题是必填项' }]"
                        >
                            <el-input v-model="formTimely.title" maxlength="50" placeholder="请输入邮件标题"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="邮件内容"
                            prop="msg"
                            :rules="msgLen()"
                        >
                            <el-input :rows="6" type="textarea" v-model="formTimely.msg" maxlength="241"
                                      placeholder="请输入邮件内容,最多240个字"  />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="附&nbsp;件&nbsp;"
                        >
                            <el-button @click="addDomain">New Attachments</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="6">
                        <el-form-item
                            v-for="(att, index) in attachments"
                            :key="att.key"
                            :label="'附件' + (index + 1)"
                            :prop="'att.' + index + '.value'"
                        >
                            <el-input v-model.number="att.nums" />
                            <el-select v-model="att.item_id" placeholder="请选择">
                                <el-option
                                    v-for="item in itemList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                            <el-button class="mt-2" @click.prevent="removeDomain(att)">Delete Attachments</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="收件方"
                            prop="send_type"
                            :rules="[{ required: true, message: '收件方是必填项',trigger: 'change' }]"
                        >
                            <el-select v-model="formTimely.send_type" placeholder="请选择"
                                       @change="recipientTimelyChange">
                                <el-option
                                    v-for="item in recipient"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <br>
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="指定玩家ID"
                            prop="user_ids"
                            :rules="inputTimely"
                        >
                            <el-input :rows="6" type="textarea" :disabled="inputTimelyDisabled"
                                      v-model="formTimely.user_ids" maxlength="2048"
                                      placeholder="请输入对方ID，用“、”间隔"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item>
                        <el-button type="primary" @click="onSend">发送</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="预设邮件">
            <div class="user-header">
                <el-form :inline="true" :model="formInline">
                    <el-button type="primary" plain @click="handleAdd">+新增</el-button>
                    <el-form-item>
                        <el-select v-model.number="formInline.event_id" clearable placeholder="请选择">
                            <el-option
                                v-for="item in events"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
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
                        :width="item.width ? item.width : 140"
                    />
                    <el-table-column fixed="right" label="操作" min-width="180">
                        <template #default="scope">
                            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button type="danger" plain size="small" @click="handleDelete(scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog
                v-model="dialogVisible"
                :title="action === 'add' ? '新增邮件' : '编辑邮件'"
                width="55%"
                :before-close="handleClose"
            >
                <el-form :model="formPresets" ref="presetsForm">

                    <el-row>
                        <el-col :span="8">
                            <el-form-item
                                label="开始时间"
                                prop="start_time"
                            >
                                <el-date-picker
                                    v-model="formPresets.start_time"
                                    type="date"
                                    :default-value="todayDate"
                                    :disabled="disabled"
                                    @change="timeChange"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="结束时间"
                                prop="end_time"
                            >
                                <el-date-picker
                                    v-model="formPresets.end_time"
                                    type="date"
                                    :default-value="nextDate"
                                    :disabled="disabled"
                                    @change="timeChange"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-switch
                                v-model="formPresets.is_permanent"
                                class="ml-2"
                                inline-prompt
                                active-text="永久有效"
                                inactive-text="永久有效"
                                @change="permanent"
                            />
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="邮件标题"
                                prop="title"
                                :rules="[{ required: true, message: '邮件标题是必填项' }]"
                            >
                                <el-input v-model="formPresets.title" maxlength="32" placeholder="请输入邮件标题"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="邮件内容"
                                prop="msg"
                                :rules="[{ required: true, message: '邮件内容是必填项' }]"
                            >
                                <el-input :rows="6" type="textarea" v-model="formPresets.msg" maxlength="64"
                                          placeholder="请输入邮件内容"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="附&nbsp;件&nbsp;"
                                prop="annex_ids"
                            >
                                <el-select v-model="formPresets.annex_ids" multiple placeholder="请选择">
                                    <el-option
                                        v-for="item in annexs"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id.toString()"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="收件方"
                                prop="send_type"
                                :rules="[{ required: true, message: '收件方是必填项' }]"
                            >
                                <el-select v-model="formPresets.send_type" placeholder="请选择"
                                           @change="recipientPresetsChange">
                                    <el-option
                                        v-for="item in recipient"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <br>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="指定玩家ID"
                                prop="user_ids"
                                :rules="inputPresets"
                            >
                                <el-input :rows="6" type="textarea" :disabled="inputPresetsDisabled"
                                          v-model="formPresets.user_ids" maxlength="2048"
                                          placeholder="请输入对方ID，用“、”间隔"/>
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="关联事件"
                                prop="event_id"
                            >
                                <el-select v-model.number="formPresets.event_id" clearable placeholder="请选择">
                                    <el-option
                                        v-for="item in events"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item
                                label="发放条件"
                                prop="condition"
                            >
                                <el-select v-model.number="formPresets.condition" clearable placeholder="请选择">
                                    <el-option
                                        v-for="item in conditions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
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
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import {defineComponent, getCurrentInstance, onMounted, reactive, ref,toRaw,} from "vue";

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
                prop: "title",
                label: "邮件标题",
            },
            {
                prop: "msg",
                label: "邮件内容",
            },
            {
                prop: "status",
                label: "状态",
            },
            {
                prop: "annex",
                label: "附件",
            },
            {
                prop: "sendType",
                label: "发送类型",
            },
            {
                prop: "start_time",
                label: "开始时间",
            },
            {
                prop: "end_time",
                label: "结束时间",
            },
            {
                prop: "event",
                label: "关联事件",
            },
            {
                prop: "condition",
                label: "发放条件",
            },
        ]);
        const inputPresetsDisabled = ref(true);
        const inputTimelyDisabled = ref(true);

        const attachments = reactive([{}]);

        const events = ref([]);
        const annexs = ref([]);
        const itemList = ref([
            {name:'cash',id:2},
            {name:'bonus',id:3},
        ]);
        const disabled = ref(false);
        const conditions = [
            {label: "达成即发", value: 1},
            {label: "到时发送", value: 2},
        ];

        const recipient = [
            {label: "全服玩家", value: 1},
            {label: "当前在线玩家", value: 2},
            {label: "指定玩家", value: 3},
        ];

        onMounted(() => {
            getEmailAnnexList();
            getEmailEventList();
            getEmailList(config);
        });
        const config = reactive({});

        const stringToTimestamp = (str) => {
            return new Date(str).getTime()
        }

        const removeDomain = (item) => {
            const index = attachments.indexOf(item)
            if (index !== -1) {
                attachments.splice(index, 1)
            }
        }

        const addDomain = () => {
            if (attachments.length >= 3){
                ElMessage({
                    showClose: true,
                    message: "max 3",
                    type: "warning",
                });
                return
            }

            attachments.push({
                key: Date.now(),
                value: '',
            })
        }
        
        const timeChange = () => {

            let startTimestamp = stringToTimestamp(formPresets.start_time);
            let endTimestamp = stringToTimestamp(formPresets.end_time);

            if (endTimestamp > 0 && startTimestamp >= endTimestamp){
                ElMessage({
                    showClose: true,
                    message: "开始日期不能大于结束日期",
                    type: "warning",
                });
            }
        }
        const permanent = () => {
            disabled.value = !!formPresets.is_permanent;
        }

        const recipientPresetsChange = () => {
            inputPresetsDisabled.value = formPresets.send_type !== 3;
        }

        const inputPresets = () => {
            if (!inputPresetsDisabled) {
                return [{ required: true, message: '指定玩家ID是必填项' }]
            }
        }

        const recipientTimelyChange = () => {
            inputTimelyDisabled.value = formTimely.send_type !== 3;
        }

        const inputTimely = () => {
          if (!inputTimelyDisabled) {
              return [{ required: true, message: '指定玩家ID是必填项', trigger: 'blur' }]
          }
        }

        const msgLen = () => {
            const msg = formTimely.msg
            if (msg !== undefined && msg !== null) {
                if (msg.length > 240){
                    return [{ required:true, message: '不能超过240个字' }]
                }
            }
            return [{ required: true, message: '邮件内容是必填项' }]
        }

        const getEmailList = async (config) => {
            let data = await proxy.$api.getEmailList(config)
            data.forEach((item) => {
                if (item.status === 0) {
                    item.status = "未发送"
                } else if (item.status === 1) {
                    item.status = "已发送"
                } else if (item.status === 2) {
                    item.status = "发送中"
                }

                if (item.send_type === 1) {
                    item.sendType = "全服发送"
                } else if (item.send_type === 2) {
                    item.sendType = "在线玩家发送"
                } else if (item.send_type === 3) {
                    item.sendType = "指定玩家"
                }

                if (item.condition === 1) {
                    item.condition = "达成即发"
                } else if (item.condition === 2) {
                    item.condition = "到时发送"
                } else {
                    item.condition = ""
                }

                if (item.event_id === 0) {
                    item.event_id = ""
                }


            })
            list.value = data
        };
        const getEmailEventList = async () => {
            let res = await proxy.$api.getEmailEventList()
            events.value = res.list
        }
        const getEmailAnnexList = async () => {
            let res = await proxy.$api.getPrizeList()


            annexs.value = res.list
        }
        const formInline = reactive({});
        const handleSearch = () => {
            config.event_id = formInline.event_id;
            getEmailList(config);
        };
        // 控制模态框的显示隐藏
        const dialogVisible = ref(false);
        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗?")
                .then(() => {
                    proxy.$refs.timelyForm.resetFields();
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };


        // 添加的form数据
        const formTimely = reactive({});

        // 获取当前日期
        let currentDate = new Date();
        let todayDate = currentDate.toISOString().slice(0, 10);
        // 设置日期为下一天
        currentDate.setDate(currentDate.getDate() + 1);
        // 将日期转换为 YYYY-MM-DD 格式
        let nextDate = currentDate.toISOString().slice(0, 10);

        const formPresets = reactive({
            start_time: todayDate,
            end_time: nextDate,
        });
        // 添加
        const onSubmit = () => {
            proxy.$refs.presetsForm.validate(async (valid) => {
                formPresets.type = 2;
                formPresets.send_type = parseInt(formPresets.send_type);
                if (formPresets.condition === "") {
                    formPresets.condition = 0;
                }
                if (formPresets.event_id === "") {
                    formPresets.event_id = 0;
                }

                let startTimestamp = stringToTimestamp(formPresets.start_time);
                let endTimestamp = stringToTimestamp(formPresets.end_time);

                if (endTimestamp > 0 && startTimestamp >= endTimestamp){
                    ElMessage({
                        showClose: true,
                        message: "开始日期不能大于结束日期",
                        type: "warning",
                    });
                    return
                }

                if (valid) {
                    if (action.value === "add") {
                        let res = await proxy.$api.saveEmail(formPresets);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "新增成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.presetsForm.resetFields();
                            getEmailList(config);
                        }
                    } else {
                        // 编辑的接口
                        let res = await proxy.$api.saveEmail(formPresets);
                        if (res) {
                            ElMessage({
                                showClose: true,
                                message: "修改成功",
                                type: "success",
                            });
                            dialogVisible.value = false;
                            proxy.$refs.presetsForm.resetFields();
                            getEmailList(config);
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
            proxy.$refs.timelyForm.resetFields();
            proxy.$refs.presetsForm.resetFields();
            reset()
        };
        const onSend = () => {
            proxy.$refs.timelyForm.validate(async (valid) => {
                if (valid) {
                    ElMessageBox.confirm("您确定发送邮件吗?", {"autofocus": false})
                        .then(async () => {
                            formTimely.type = 1;
                            formTimely.send_type = parseInt(formTimely.send_type)
                            formTimely.attachments = attachments

                            console.log(formTimely)
                            // return

                            await proxy.$api.saveEmail(formTimely);

                            ElMessage({
                                showClose: true,
                                message: "发送成功",
                                type: "success",
                            });
                            proxy.$refs.timelyForm.resetFields();
                        })
                        .catch(() => {
                        });
                }
            });

        }
        const reset = () => {
            formPresets.id = 0;//编辑时携带的id未被重置
            formPresets.created_at = "";
            formPresets.updated_at = "";
        }
        // 区分编辑和新增
        const action = ref("add");
        // 编辑
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formPresets, row);
            });
        };
        // 新增
        const handleAdd = () => {
            action.value = "add";
            formPresets.condition = 1;
            formPresets.event_id = events.value[0].id;
            dialogVisible.value = true;
        };
        const handleDelete = (row) => {
            ElMessageBox.confirm("你确定删除吗?", {"autofocus": false})
                .then(async () => {
                    await proxy.$api.delSign({
                        id: row.id,
                    });

                    ElMessage({
                        showClose: true,
                        message: "删除成功",
                        type: "success",
                    });
                    getEmailList(config);
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
            formTimely,
            formPresets,
            onSubmit,
            handleCancel,
            action,
            handleEdit,
            handleDelete,
            handleAdd,
            conditions,
            events,
            annexs,
            itemList,
            inputPresetsDisabled,
            inputPresets,
            inputTimelyDisabled,
            inputTimely,
            msgLen,
            onSend,
            permanent,
            disabled,
            todayDate,
            currentDate,
            recipient,
            recipientPresetsChange,
            recipientTimelyChange,
            timeChange,
            attachments,
            addDomain,
            removeDomain,
        };
    },
});
</script>