import {
  CUR_YEAR,
  UPPER_LIMIT_YEAR
} from "vue-cron-generator/src/constant/filed";


export default {
  common: {
    addOk: "添加成功",
    updateOk: "更新成功",
    saveOk: "保存成功",
    submitOk: "提交成功",
    deleteOk: "已删除", // 删除成功
    batchDeleteOk: "已批量删除", // 批量删除成功
    deleteConfirm: "确定要删除该记录吗？",
    submitConfirm: "确定提交吗？",
    cancel: "取消",
    submit: "提交",
    delete: "删除",
    ok: "确定",
    demoTips: "演示环境，禁止操作",
    startOk: "启动成功",
    stopOk: "停止成功",
    pauseOk: "暂停成功",
    resumeOk:"重启成功",
    // 添加corn汉化
    from: '从',
    fromThe: '从第',
    start: '开始',
    every: '每',
    between: '在',
    and: '到',
    end: '之间的',
    specified: '固定的',
    symbolTip: '通配符支持',
    valTip: '值为',
    nearest: '最近的',
    current: '本',
    nth: '第',
    index: '个',
    placeholder: '请选择',
    placeholderMulti: '请选择(支持多选)',
    help: '帮助',
    wordNumError: '格式不正确，必须有6或7位',
    reverse: '反向解析',
    reset: '重置',
    tagError: '表达式不正确',
    numError: '含有非法数字',
    use: '使用',
    inputPlaceholder: 'Cron表达式'
  },
  custom: {
    unspecified: '不固定',
    workDay: '工作日',
    lastTh: '倒数第',
    lastOne: '最后一个',
    latestWorkday: '最后一个工作日',
    empty: '不配置'
  },
  second: {
    title: '秒',
    val: '0 1 2...59'
  },
  minute: {
    title: '分',
    val: '0 1 2...59'
  },
  hour: {
    title: '时',
    val: '0 1 2...23'
  },
  dayOfMonth: {
    timeUnit: '日',
    title: '日',
    val: '1 2...31'
  },
  month: {
    title: '月',
    val: '1 2...12，或12个月的缩写(JAN ... DEC)'
  },
  dayOfWeek: {
    timeUnit: '日',
    title: '周',
    val: '1 2...7或星期的缩写(SUN ... SAT)',
    SUN: '星期天',
    MON: '星期一',
    TUE: '星期二',
    WED: '星期三',
    THU: '星期四',
    FRI: '星期五',
    SAT: '星期六'
  },
  year: {
    title: '年',
    val: CUR_YEAR + ' ... ' + UPPER_LIMIT_YEAR
  },
  period: {
    startError: '开始格式不符',
    cycleError: '循环格式不符'
  },
  range: {
    lowerError: '下限格式不符',
    upperError: '上限格式不符',
    lowerBiggerThanUpperError: '下限不能比上限大'
  },
  weekDay: {
    weekDayNumError: '周数格式不符',
    nthError: '天数格式不符'
  },
  exception: {
    e403: "抱歉，你无权访问该页面",
    e404: "抱歉，你访问的页面不存在",
    e500: "抱歉，服务器出错了",
    btn: "返回首页"
  },
  admin: {}
};
