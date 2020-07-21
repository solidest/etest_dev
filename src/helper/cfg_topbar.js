const cfg = {
    width: 360,
    pages: [{
        icon: 'mdi-animation-play-outline',
        title: '执行用例',
        catalog: 'program',
        type: 'tree',
        icons: {
            tcg: 'mdi-vector-polyline',
            actions: 'mdi-playlist-play',
            lua: 'mdi-script-text-outline',
        }
    }, {
        icon: 'mdi-chart-bell-curve-cumulative',
        title: '监控面板',
        catalog: 'panel',
        type: 'list',
        file_icon: 'mdi-chart-line-variant',
    }, {
        icon: 'mdi-function-variant',
        title: '仿真模型',
        catalog: 'simu',
        type: 'list',
        file_icon: 'mdi-function'
    }, {
        icon: 'mdi-comment-processing-outline',
        title: '通信协议',
        catalog: 'protocol',
        type: 'list',
        file_icon: 'mdi-message-outline',
    }, {
        icon: 'mdi-link-variant',
        title: '连接拓扑',
        catalog: 'topology',
        type: 'list',
        file_icon: 'mdi-link-box-variant-outline'
    }, {
        icon: 'mdi-developer-board',
        title: '设备接口',
        catalog: 'device',
        type: 'list',
        file_icon: 'mdi-dev-to'
    }, {
        icon: 'mdi-tools',
        title: '工具箱',
        catalog: 'tools',
        type: 'items',
        file_icon: 'mdi-help-rhombus-outline',
        items: [{
            name: '数据格式转换',
            value: 'tool_dataformat',
            id: 'tool_dataformat'
        }, {
            name: '组合配对',
            value: 'pairwise',
            id: 'tool_pairwise'
        }, {
            name: '图标库',
            value: 'iconlib',
            id: 'tool_iconlib'
        },
    ]
    }, {
        icon: 'mdi-cog-outline',
        title: '项目设置',
        catalog: 'project',
        type: 'items',
        file_icon: 'mdi-cogs',
        items: [{
            name: '基本设置',
            value: 'Setting',
            id: 'setting'
        }, {
            name: '自定义校验函数',
            value: 'Xtra',
            id: 'check'
        }, {
            name: '自定义打包函数',
            value: 'Xtra',
            id: 'pack'
        }, {
            name: '自定义解包函数',
            value: 'Xtra',
            id: 'unpack'
        }, {
            name: '接收过滤器',
            value: 'Xtra',
            id: 'recvfilter'
        }]
    }],

    list_bars: [{
        text: '新建文件',
        value: 'new_file',
        icon: 'mdi-file-plus-outline'
    }, {
        text: '修改名称',
        value: 're_name',
        icon: 'mdi-pencil'
    }, {
        text: '删除选中项',
        value: 'del_item',
        icon: 'mdi-delete-outline'
    }],

    tree_bars: [
        // {
        //     text: '新建目录',
        //     value: 'new_dir',
        //     disabled: false,
        //     icon: 'mdi-folder-plus-outline',
        // },
        {
            text: '新建文件',
            value: 'new_file',
            icon: 'mdi-file-plus-outline',
            items: [{
                    text: '目录',
                    value: 'dir',
                }, {
                    text: 'ETLua脚本',
                    value: 'lua',
                },
                {
                    text: 'AutoTCG模型',
                    value: 'tcg',
                }
            ]
        },
        {
            text: '修改名称',
            value: 're_name',
            disabled: false,
            icon: 'mdi-pencil'
        }, {
            text: '删除选中项',
            value: 'del_item',
            disabled: false,
            icon: 'mdi-delete-outline'
        }
    ],
}
export default cfg