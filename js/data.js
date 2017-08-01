/**
 * 数据
 * @type {Object}
 */
var data = {
    'menu': {
        'main': [{
            name: '新建文件',
            child: [{
                name: '新建文件夹',
                callbackname: 'createFloder',
            }]
        }, {
            name: '更换桌面背景...',
            callbackname: 'changeBg'
        }, {
            name: '整理',
            callbackname: 'refresh'
        }, {
            name: '排序',
            child: [{
                name: '创建时间'
            }, {
                name: '名称'
            }]
        }],
        'file': [{
            name: '打开',
            callbackname: 'open'
        }, {
            name: '复制',
            callbackname: 'copy'
        }, {
            name: '重命名',
            callbackname: 'rename'
        }, {
            name: '删除',
            callbackname: 'del'
        }]
    },
    'list': [{
            id: 1,
            pid: 0,
            type: 'trash',
            name: '回收站',
            extname: ''
        },
        {
            id: 2,
            pid: 0,
            type: 'app',
            name: 'Launchpad',
            extname: ''
        },
        {
            id: 3,
            pid: 0,
            type: 'floder',
            name: '下载',
            extname: ''
        },
        {
            id: 4,
            pid: 0,
            type: 'floder',
            name: '图片',
            extname: ''
        },
        {
            id: 5,
            pid: 0,
            type: 'floder',
            name: '文稿',
            extname: ''
        },
        {
            id: 6,
            pid: 2,
            type: 'calc',
            name: '计算器',
            extname: ''
        },
        {
            id: 7,
            pid: 2,
            type: 'floder',
            name: 'Wechat',
            extname: ''
        },
        {
            id: 9,
            pid: 3,
            type: 'floder',
            name: '1.txt',
            extname: ''
        },
        {
            id: 10,
            pid: 4,
            type: 'floder',
            name: '1.jpg'
        },
        {
            id: 11,
            pid: 4,
            type: 'floder',
            name: '2.png',
            extname: ''
        },
        {
            id: 12,
            pid: 5,
            type: 'floder',
            name: '13.zip',
            extname: ''
        },
    ],
    'dock': [{
        id: 5,
        pid: 0,
        type: 'finder',
        name: 'finder',
        extname: ''
    }, {
        id: 2,
        pid: 0,
        type: 'app',
        name: 'Launchpad',
        extname: ''
    }, {
        id: 3,
        pid: 0,
        type: 'calc',
        name: '计算器',
        extname: ''
    }, {
        id: 4,
        pid: 0,
        type: 'cale',
        name: '日历',
        extname: ''
    }, {
        id: 1,
        pid: 0,
        type: 'trash',
        name: '回收站',
        extname: ''
    }, ]
}