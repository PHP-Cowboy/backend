/**
 * 整个项目api的管理
 *
 */
import request from "./request"

export default {
    // home组件 左侧表格数据获取
    getTableData(params) {
        return request({
            url: '/home/getTableData',
            method: 'get',
            data: params,
            mock: true
        })
    },

    getChartData() {
        return request({
            url: '/home/getChartData',
            method: 'get',
            mock: true
        })
    },

    getUserData(params) {
        return request({
            url: '/user/list',
            method: 'get',
            data: params
        })
    },

    addUser(params) {
        return request({
            url: '/user/add',
            method: 'post',
            data: params
        })
    },

    changeUser(params) {
        return request({
            url: '/user/change',
            method: 'post',
            data: params
        })
    },

    deleteUser(params) {
        return request({
            url: '/user/delete',
            method: 'get',
            data: params
        })
    },
    //登录
    login(params) {
        return request({
            url: 'login',
            method: 'post',
            data: params
        })
    },
    // 根据用户的用户名不同 返回不一样的菜单列表
    getMenu(params) {
        return request({
            url: 'user/tree',
            method: 'get',
            data: params
        })
    },

    getSignList(params) {
        return request({
            url: '/sign/getList',
            method: 'get',
            data: params
        })
    },

    saveSign(params) {
        return request({
            url: '/sign/saveSign',
            method: 'post',
            data: params
        })
    },

    delSign(params) {
        return request({
            url: '/sign/delSign',
            method: 'post',
            data: params
        })
    },

    getPrizeList(params) {
        return request({
            url: '/sign/prizeList',
            method: 'get',
            data: params
        })
    },

    savePrize(params) {
        return request({
            url: '/sign/savePrize',
            method: 'post',
            data: params
        })
    },

    delPrize(params) {
        return request({
            url: '/sign/delPrize',
            method: 'post',
            data: params
        })
    },

    getRoleList(params) {
        return request({
            url: '/role/list',
            method: 'get',
            data: params
        })
    },

    addRole(params) {
        return request({
            url: '/role/add',
            method: 'post',
            data: params
        })
    },
    changeRole(params) {
        return request({
            url: '/role/change',
            method: 'post',
            data: params
        })
    },

    getMenuList(params) {
        return request({
            url: '/menu/list',
            method: 'get',
            data: params
        })
    },

    getMenuTree(params) {
        return request({
            url: '/menu/tree',
            method: 'get',
            data: params
        })
    },

    getLevelList(params) {
        return request({
            url: '/menu/getLevelList',
            method: 'get',
            data: params
        })
    },

    addMenu(params) {
        return request({
            url: '/menu/add',
            method: 'post',
            data: params
        })
    },
    changeMenu(params) {
        return request({
            url: '/menu/change',
            method: 'post',
            data: params
        })
    },

    updateUserGoogleCaptcha(params){
        return request({
            url: '/user/updateUserGoogleCaptcha',
            method: 'post',
            data: params
        })
    },

    getCaptchaQrBySecret(params){
        return request({
            url: '/user/getCaptchaQrBySecret',
            method: 'get',
            data: params
        })
    },

    getCaptchaQr(params){
        return request({
            url: '/user/getCaptchaQr',
            method: 'get',
            data: params
        })
    },

    bindGoogleCaptcha(params){
        return request({
            url: '/user/bindGoogleCaptcha',
            method: 'post',
            data: params
        })
    },

    getDictList(params) {
        return request({
            url: '/dict/list',
            method: 'get',
            data: params
        })
    },

    saveDict(params) {
        return request({
            url: '/dict/save',
            method: 'post',
            data: params
        })
    },

    changeDictValues(params) {
        return request({
            url: '/dict/changeValues',
            method: 'post',
            data: params
        })
    },

    getOneDict(params) {
        return request({
            url: '/dict/one',
            method: 'get',
            data: params
        })
    },

    getEventList(params) {
        return request({
            url: '/giftPack/getEventList',
            method: 'get',
            data: params
        })
    },

    eventStatus(params) {
        return request({
            url: '/giftPack/eventStatus',
            method: 'post',
            data: params
        })
    },

    onOffEvent(params) {
        return request({
            url: '/giftPack/onOffEvent',
            method: 'post',
            data: params
        })
    },

    saveEvent(params) {
        return request({
            url: '/giftPack/saveEvent',
            method: 'post',
            data: params
        })
    },

    delEvent(params) {
        return request({
            url: '/giftPack/delEvent',
            method: 'post',
            data: params
        })
    },

    getRechargeGiftList(params) {
        return request({
            url: '/giftPack/getRechargeGiftList',
            method: 'get',
            data: params
        })
    },

    saveRechargeGift(params) {
        return request({
            url: '/giftPack/saveRechargeGift',
            method: 'post',
            data: params
        })
    },

    rechargeGiftStatus(params) {
        return request({
            url: '/giftPack/rechargeGiftStatus',
            method: 'post',
            data: params
        })
    },

    onOffRechargeGift(params) {
        return request({
            url: '/giftPack/onOffRechargeGift',
            method: 'post',
            data: params
        })
    },

    delRechargeGift(params) {
        return request({
            url: '/giftPack/delRechargeGift',
            method: 'post',
            data: params
        })
    },

    getRechargePackList(params) {
        return request({
            url: '/giftPack/getRechargePackList',
            method: 'get',
            data: params
        })
    },

    saveRechargePack(params) {
        return request({
            url: '/giftPack/saveRechargePack',
            method: 'post',
            data: params
        })
    },

    delRechargePack(params) {
        return request({
            url: '/giftPack/delRechargePack',
            method: 'post',
            data: params
        })
    },

    getVipList(params) {
        return request({
            url: '/giftPack/getVipList',
            method: 'get',
            data: params
        })
    },

    saveVip(params) {
        return request({
            url: '/giftPack/saveVip',
            method: 'post',
            data: params
        })
    },

    delVip(params) {
        return request({
            url: '/giftPack/delVip',
            method: 'post',
            data: params
        })
    },

    getBenefitList(params) {
        return request({
            url: '/giftPack/getBenefitList',
            method: 'get',
            data: params
        })
    },

    saveBenefit(params) {
        return request({
            url: '/giftPack/saveBenefit',
            method: 'post',
            data: params
        })
    },

    onOffBenefit(params) {
        return request({
            url: '/giftPack/onOffBenefit',
            method: 'post',
            data: params
        })
    },

    benefitStatus(params) {
        return request({
            url: '/giftPack/benefitStatus',
            method: 'post',
            data: params
        })
    },

    delBenefit(params) {
        return request({
            url: '/giftPack/delBenefit',
            method: 'post',
            data: params
        })
    },

    getOnlyList(params) {
        return request({
            url: '/giftPack/getOnlyList',
            method: 'get',
            data: params
        })
    },

    saveOnly(params) {
        return request({
            url: '/giftPack/saveOnly',
            method: 'post',
            data: params
        })
    },

    onOffOnly(params) {
        return request({
            url: '/giftPack/onOffOnly',
            method: 'post',
            data: params
        })
    },

    onlyStatus(params) {
        return request({
            url: '/giftPack/onlyStatus',
            method: 'post',
            data: params
        })
    },

    delOnly(params) {
        return request({
            url: '/giftPack/delOnly',
            method: 'post',
            data: params
        })
    },


    saveEmail(params){
        return request({
            url: '/email/save',
            method: 'post',
            data: params
        })
    },

    getEmailList(params) {
        return request({
            url: '/email/list',
            method: 'get',
            data: params
        })
    },

    getEmailAnnexList(params) {
        return request({
            url: '/email/annexList',
            method: 'get',
            data: params
        })
    },

    getEmailEventList(params) {
        return request({
            url: '/email/eventList',
            method: 'get',
            data: params
        })
    },

    saveEmailEvent(params) {
        return request({
            url: '/email/saveEvent',
            method: 'post',
            data: params
        })
    },

    getPayGiftList(params) {
        return request({
            url: '/pay/list',
            method: 'get',
            data: params
        })
    },

    savePayGift(params) {
        return request({
            url: '/pay/save',
            method: 'post',
            data: params
        })
    },

    delPayGift(params) {
        return request({
            url: '/pay/del',
            method: 'post',
            data: params
        })
    },

    getGaveConfigList(params) {
        return request({
            url: '/pay/gaveConfigList',
            method: 'get',
            data: params
        })
    },

    getGaveConfigPageList(params) {
        return request({
            url: '/pay/gaveConfigPageList',
            method: 'get',
            data: params
        })
    },

    saveGiveConfig(params) {
        return request({
            url: '/pay/saveGiveConfig',
            method: 'post',
            data: params
        })
    },

    delGiveConfig(params) {
        return request({
            url: '/pay/delGiveConfig',
            method: 'post',
            data: params
        })
    },

    getPayOrderList(params) {
        return request({
            url: '/pay/orderList',
            method: 'get',
            data: params
        })
    },

    getPayBankList(params) {
        return request({
            url: '/pay/bankList',
            method: 'get',
            data: params
        })
    },

    getPayConfigList(params) {
        return request({
            url: '/pay/configList',
            method: 'get',
            data: params
        })
    },

    delConfig(params){
        return request({
            url: '/pay/delConfig',
            method: 'post',
            data: params
        })
    },

    savePayConfig(params) {
        return request({
            url: '/pay/saveConfig',
            method: 'post',
            data: params
        })
    },

    getRechargeRecords(params) {
        return request({
            url: '/pay/rechargeRecords',
            method: 'get',
            data: params
        })
    },

    getRoomList(params) {
        return request({
            url: '/room/list',
            method: 'get',
            data: params
        })
    },

    getColumnComment(params){
        return request({
            url: '/room/getColumnComment',
            method: 'get',
            data: params
        })
    },

    saveRoom(params) {
        return request({
            url: '/room/save',
            method: 'post',
            data: params
        })
    },

    updateExtDataByExcel(params) {
        return request({
            url: '/room/updateExtDataByExcel',
            method: 'post',
            data: params
        })
    },

    getGameList(params) {
        return request({
            url: '/common/gameList',
            method: 'get',
            data: params
        })
    },

    getCommonRoomList(params) {
        return request({
            url: '/common/roomList',
            method: 'get',
            data: params
        })
    },

    getChannelPageList(params) {
        return request({
            url: '/common/channelPageList',
            method: 'get',
            data: params
        })
    },

    getAllChannel(params) {
        return request({
            url: '/common/allChannel',
            method: 'get',
            data: params
        })
    },

    getRoleChannel(params) {
        return request({
            url: '/common/roleChannel',
            method: 'get',
            data: params
        })
    },

    saveChannel(params) {
        return request({
            url: '/common/saveChannel',
            method: 'post',
            data: params
        })
    },

    getUserStatistics(params) {
        return request({
            url: '/statistics/user',
            method: 'get',
            data: params
        })
    },

    getRechargeStatistics(params) {
        return request({
            url: '/statistics/recharge',
            method: 'get',
            data: params
        })
    },

    getWithdrawalStatistics(params) {
        return request({
            url: '/statistics/withdrawal',
            method: 'get',
            data: params
        })
    },

    getPaidUserRetention(params) {
        return request({
            url: '/statistics/paidUserRetention',
            method: 'get',
            data: params
        })
    },

    getUserRetention(params) {
        return request({
            url: '/statistics/userRetention',
            method: 'get',
            data: params
        })
    },

    getFiveMinuteData(params) {
        return request({
            url: '/statistics/fiveMinuteData',
            method: 'get',
            data: params
        })
    },

    getFundsFlowTp(params) {
        return request({
            url: '/fundsFlow/tp',
            method: 'get',
            data: params
        })
    },

    getFundsFlowSlot(params) {
        return request({
            url: '/fundsFlow/slot',
            method: 'get',
            data: params
        })
    },

    getPerHourDataNum(params) {
        return request({
            url: '/statistics/perHourDataNum',
            method: 'get',
            data: params
        })
    },

    getPerHourGameNum(params) {
        return request({
            url: '/statistics/perHourGameNum',
            method: 'get',
            data: params
        })
    },

    getLoginLogList(params) {
        return request({
            url: '/gameUser/loginLogList',
            method: 'get',
            data: params
        })
    },

    getGameUserList(params) {
        return request({
            url: '/gameUser/list',
            method: 'get',
            data: params
        })
    },

    getGiveList(params) {
        return request({
            url: '/gameUser/giveList',
            method: 'get',
            data: params
        })
    },

    batchPass(params) {
        return request({
            url: '/batch/pass',
            method: 'post',
            data: params
        })
    },

    batchRepulse(params) {
        return request({
            url: '/batch/repulse',
            method: 'post',
            data: params
        })
    },

    batchInvalid(params) {
        return request({
            url: '/batch/invalid',
            method: 'post',
            data: params
        })
    },

    getGameUserInfo(params) {
        return request({
            url: '/gameUser/info',
            method: 'get',
            data: params
        })
    },

    changeRecharge(params) {
        return request({
            url: '/gameUser/changeRecharge',
            method: 'post',
            data: params
        })
    },

    editUserCoin(params) {
        return request({
            url: '/gameUser/editUserCoin',
            method: 'post',
            data: params
        })
    },

    withdrawInfoRecord(params) {
        return request({
            url: '/gameUser/withdrawInfoRecord',
            method: 'get',
            data: params
        })
    },

    banned(params) {
        return request({
            url: '/gameUser/banned',
            method: 'post',
            data: params
        })
    },

    unseal(params) {
        return request({
            url: '/gameUser/unseal',
            method: 'post',
            data: params
        })
    },

    getPassageList(params) {
        return request({
            url: '/passage/list',
            method: 'get',
            data: params
        })
    },

    passageSave(params) {
        return request({
            url: '/passage/save',
            method: 'post',
            data: params
        })
    },

    passageDel(params) {
        return request({
            url: '/passage/del',
            method: 'post',
            data: params
        })
    },

    passageChange(params) {
        return request({
            url: '/passage/change',
            method: 'post',
            data: params
        })
    },

    getOnlineList(params) {
        return request({
            url: '/online/list',
            method: 'get',
            data: params
        })
    },
}