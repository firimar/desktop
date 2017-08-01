/**
 * 获取指定id的数据信息
 * @param id 要查找的id
 * @return {Object} 满足条件的数据
 */
function getInfo(id) {
    return data.list.filter(function (item) {
        return item.id == id
    })[0];
}

function getDockInfo(id) {
    return data.dock.filter(function (item) {
        return item.id == id
    })[0];
}
/**
 * 根据指定的id，返回其下的所有一级子数据
 * @param id 要查找的id
 * @returns {Array} 包含一级子数据的数组
 */
function getChildren(id) {
    return data.list.filter(function (item) {
        return item.pid == id
    });
}


function getDockChildren(id) {
    return data.dock.filter(function (item) {
        return item.pid == id
    });
}
/**
 * 查找所有子级(包括自己)
 */
function getChildrensAndSelf(id) {
    var self = getInfo(id);
    var childrens = getChildrens(id)
    var data = [];
    data = childrens.concat(self);
    return data;
};

function getChildrens(id) {
    // 得到一级子级 
    var children = getChildren(id);
    var data = []
    children.forEach(function (item) {
        data.push(item);
        data = data.concat(getChildrens(item.id));
    });
    return data;
}
/**
 * 查找所有子级并返回树结构
 */
function getTree(id, level) {
    var level = level || 0;
    // 得到一级子级
    var children = getChildren(id);
    var data = [];
    children.forEach(function (item) {
        item.level = level;
        data.push(item);
        data = data.concat(getTree(item.id, level + 1));
    });

    return data;
}

function getParent(id) {
    // 得到当前数据
    var info = getInfo(id);
    if (info) {
        // 根据自己的pid获取父级的info
        return getInfo(info.pid);
    }
}

function getDockParent(id) {
    // 得到当前数据
    var info = getDockInfo(id);
    if (info) {
        // 根据自己的pid获取父级的info
        return getDockInfo(info.pid);
    }
}
/**
 * 获取指定id的所有父级（不包括自己）
 * @param id
 * @return {Array} 返回一个包含所有父级数据的数组
 */
function getParents(id) {
    // 保存所有父级数据
    var parents = [];

    // 获取父级
    var parentInfo = getParent(id);
    // 如果父级信息存在
    if (parentInfo) {
        // 把当前父级的信息保存到parents里面
        parents.push(parentInfo);
        var more = getParents(parentInfo.id);
        parents = more.concat(parents);
    }

    return parents;
}

/**
 * 添加新数据
 * @param newData
 */
function addData(newData) {
    newData.id = getMaxId() + 1;
    data.list.push(newData);
}

/*
 * 获取数据中最大的id
 * */
function getMaxId() {
    var maxid = 0;
    data.list.forEach(function (item) {
        if (item.id > maxid) {
            maxid = item.id;
        }
    });
    return maxid;
}