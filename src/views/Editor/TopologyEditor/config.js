let left_tools = [{
        text: '编辑/锁定',
        value: 'toggle_select',
        icon: 'mdi-check-all'
    }, {
        text: '向后添加接口',
        value: 'new_item_after',
        icon: 'mdi-table-row-plus-after'
    }, {
        text: '向前添加接口',
        value: 'new_item_before',
        icon: 'mdi-table-row-plus-before'
    }, {
        text: '上移',
        value: 'move_up',
        icon: 'mdi-arrow-up'
    }, {
        text: '下移',
        value: 'move_down',
        icon: 'mdi-arrow-down'
    }, {
        text: '剪切',
        value: 'cut',
        icon: 'mdi-content-cut'
    }, {
        text: '复制',
        value: 'copy',
        icon: 'mdi-content-copy'
    }, {
        text: '粘贴',
        value: 'paste',
        icon: 'mdi-content-paste'
    }, {
        text: '批量粘贴',
        value: 'paste_batch',
        icon: 'mdi-content-duplicate'
    }, {
        text: '撤销',
        value: 'undo',
        icon: 'mdi-undo'
    }, {
        text: '恢复',
        value: 'redo',
        icon: 'mdi-redo',
    }, {
        text: '删除',
        value: 'remove',
        icon: 'mdi-delete-outline'
    }, ];

let right_tools = [{
    text: 'ETL代码编辑',
    value: 'etl_code',
    icon: 'mdi-code-json'
}];

let intf_types = [
    {value: 'di', text: '数字输入'},
    {value: 'do', text: '数字输出'},
    {value: 'ai', text: '模拟输入'},
    {value: 'ao', text: '模拟输出'},
    {value: 'serial_232', text: '232串口'},
    {value: 'serial_422', text: '422串口'},
    {value: 'serial_485', text: '485串口'},
    {value: 'serial_ttl', text: 'UART'},
    {value: 'can', text: 'can总线接口'},
    {value: 'udp', text: 'UDP协议'},
    {value: 'tcp_client', text: 'TCP客户端'},
    {value: 'tcp_server', text: 'TCP服务器'},
];

let headers = [{width: 48}, {
        text: '接口类型',
        align: 'start',
        value: 'kind',
    }, {
        text: '接口名称',
        value: 'name'
    }, {
        text: '设置',
        value: 'config'
    }
];

let intf_alias = {
    di: 'DI',
    do: 'DO',
    ai: 'AI',
    ao: 'AO',
    serial_232: '232',
    serial_422: '422',
    serial_485: '485',
    serial_ttl: 'UART',
    can: 'CAN',
    udp: 'UDP',
    tcp_client: 'TCPC',
    tcp_server: 'TCPS',
}

let cfg = {
    kind: 'device',
    left_tools,
    right_tools,
    headers,
    intf_types,
    intf_alias,
}

export default cfg;