var contextmenu = document.querySelector('.menu');
var submenu = document.querySelector('.submenu');
var createFile = document.querySelector('.createfile');
(function () {
    createFile.dataset.id = 0;
    createFile.style.height = document.documentElement.clientHeight + 'px';
    createFile.style.width = document.documentElement.clientWidth + 'px';
})();
var selectedLi = null;
var num = 0;
var id = 0;
var fileId = []; // 文件夹
var cursor = []; //光标
var n = 0;
var copy = [];
var a = {
    createFloder: function (e) {
        var info = getInfo(id);
        info = info == undefined ? 0 : info.id;
        createFilename(e, {
            id: getMaxId() + 1,
            pid: info,
            type: 'floder',
            name: '新建文件夹',
            extname: ''
        });
    },
    changeBg: function () {
        var bg = document.querySelector('#bg');
        var bgImg = bg.querySelector('img');
        var changebg = document.querySelector('.changebg');
        var btn = document.querySelector('.changebg a');
        // var input = changebg.querySelector('input');
        var imgs = changebg.querySelectorAll('img');
        changebg.style.display = 'block';
        var bgArr = [
            'url(img/preset_bg_1.jpg)',
            'url(img/preset_bg_2.jpg)',
            'url(img/preset_bg_3.jpg)',
            'url(img/preset_bg_4.jpg)'
        ];
        // input.onchange = function () {
        //     console.log(input.files[0]);
        // }
        btn.onclick = function () {
            changebg.style.display = 'none';
        }
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].index = i;
            imgs[i].onclick = function () {
                console.log(this.index);
                bg.style.backgroundImage = bgArr[this.index % bgArr.length];
            }
        };
        drag(changebg)

    },
    upload: function () {
        var uploadbtn = document.querySelector('#uploadbtn');
        uploadbtn.click();
        console.dir(1)

    },
    refresh: function () {
        refresh();
    },
    open: function (e) {
        e.stopPropagation()

        if (selectedLi.dataset.type == 'calc') {
            calc.style.display = "block";
            calc.style.zIndex = zIndex;
        }
        if (selectedLi.dataset.type == 'floder' || selectedLi.dataset.type == 'app') {
            if (fileId.indexOf(selectedLi.item.id) == -1) {
                createWind(selectedLi.item)
                fileId.push(selectedLi.item.id)
            } else {
                var show = document.querySelector('#openW' + selectedLi.item.id);
                show.style.display = "block";
            };
            view(selectedLi.item.id, '#openfile' + selectedLi.item.id, '#crumbs' + selectedLi.item.id);
        }
    },
    rename: function (e) {
        var name = selectedLi.querySelector('p');
        var input = selectedLi.querySelector('input');
        rename(name, input)
        e.stopPropagation()
    },
    del: function () {
        del()
    },
    //复制粘贴
    copy: function () {
        data.menu.main.push({
            name: '粘贴',
            callbackname: 'paste'
        })
        createMenu(contextmenu, data.menu.main);
        data.menu.main.pop();
        var active = document.querySelectorAll('.active');
        for (var i = 0; i < active.length; i++) {
            getChildrensAndSelf(active[i].dataset.id).forEach(function (item) {
                copy.push(item)
            })
        };

        console.log(copy);
    },
    paste: function () {
        console.log('paste');
    }
};
createMenu(contextmenu, data.menu.main);
createMenu(submenu, data.menu.file);
view(id, '.createfile');


function createMenu(contextmenu, data) {
    contextmenu.innerHTML = '';
    for (var i = 0; i < data.length; i++) {
        var li = document.createElement('li');
        var p = document.createElement('p');
        if (data[i].type) {
            p.className = data[i].type
        }
        p.innerHTML = data[i].name;
        li.appendChild(p);
        if (data[i].child) {
            var ul = document.createElement('ul');
            createMenu(ul, data[i].child);
            li.appendChild(ul);
        }
        p.addEventListener('click', a[data[i].callbackname]);
        p.addEventListener('click', function () {
            contextmenu.style.display = 'none';
        });
        contextmenu.appendChild(li);

    };
};
// 渲染
function view(pid, container, crumbcon, is) {
    var createFile = document.querySelector(container);
    var subMenu = document.querySelector('.submenu');
    id = pid;
    var show;
    var dataList = getChildren(id);
    if (is) {
        dataList = getDockChildren(id)
    }
    createFile.innerHTML = '';
    dataList.forEach(function (item) {
        var newname = item.name;
        if (item.extname) {
            newname += `(${item.extname})`;
        }
        var newFile = document.createElement('div');
        var fileIco = document.createElement('span');
        var fileName = document.createElement('p');
        var input = document.createElement('input');
        newFile.style.zIndex = 1;
        fileName.innerHTML = newname;
        fileIco.className = item.type;
        newFile.item = item;
        newFile.dataset.type = item.type;
        newFile.dataset.id = item.id;
        addEv();
        submenu(); //文件夹菜单
        newFile.appendChild(fileIco);
        newFile.appendChild(fileName);
        newFile.appendChild(input);
        createFile.appendChild(newFile);


        //给创建的文件夹添加事件
        function addEv() {
            // newFile.addEventListener('mouseover', function () {
            //     this.className = this.className == "show active" ? "show active" : "show";
            // });
            // newFile.addEventListener('mouseout', function () {
            //     this.className = this.className == "show active" ? "show active" : " ";
            // });
            var is;
            newFile.addEventListener('click', function (e) {
                //按住shift
                e.stopPropagation();
                e.preventDefault();
                subMenu.style.display = 'none';
                if (!e.shiftKey) {
                    var newFiles = createFile.querySelectorAll('div');
                    for (var i = 0; i < newFiles.length; i++) {
                        newFiles[i].className = '';
                    };
                };
                selectedLi = this;

                newFile.className = "active";
            });
            newFile.addEventListener('dblclick', function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (newFile.dataset.type == 'calc') {
                    calc.style.display = "block";
                    calc.style.zIndex = zIndex;
                }
                if (newFile.dataset.type == 'floder' ||
                    newFile.dataset.type == 'app' ||
                    newFile.dataset.type == 'trash') {
                    if (fileId.indexOf(item.id) == -1) {
                        createWind(item);
                        fileId.push(item.id)

                    } else {
                        show = document.querySelector('#openW' + item.id);
                        show.style.display = "block";
                    };
                    view(item.id, '#openfile' + item.id, '#crumbs' + item.id);
                }
                windCursor();

                //console.log(fileId.indexOf(item.id) != -1, item.id, fileId)
                //view(0, '.createfile');
            });
            fileName.addEventListener('dblclick', function (e) {
                e.stopPropagation()
                rename(fileName, input)
            });
            drag(newFile, self);
        };
        //文件夹菜单
        function submenu() {
            var subMenu = document.querySelector('.submenu');
            var menu = document.querySelector('.menu');
            var btn = subMenu.querySelectorAll('li');
            newFile.addEventListener('contextmenu', function (e) {
                selectedLi = this;
                var newFiles = createFile.querySelectorAll('.active');
                for (var i = 0; i < newFiles.length; i++) {
                    if (newFiles.length == 1) {
                        newFiles[i].className = '';
                    }
                };
                newFile.className = "active";
                menu.style.display = 'none';
            });
        };

    });
    var crumbsNav = document.querySelector('.crumbs');
    if (crumbcon != undefined || is) {
        crumbsNav && crumb(crumbcon)
    }


}

//面包屑导航
function crumb(crumbcon, is) {
    var crumb = document.querySelector(crumbcon);
    crumb.innerHTML = '';
    var a = document.createElement('a');
    a.href = 'javascript:;';
    a.innerHTML = '/';
    a.addEventListener('click', function (e) {
        e.stopPropagation();
        synId(e)
        view(0, '#openfile' + crumb.dataset.id, '#crumbs' + crumb.dataset.id);
    });
    crumb.appendChild(a);
    var pathList = getParents(id);
    if (is) {
        pathList = getDockParent(id)
    }
    pathList.forEach(function (value) {
        var newname = value.name;
        if (value.extname) {
            newname += `(${value.extname})`;
        };
        var a = document.createElement('a');
        var span = document.createElement('span');
        a.innerHTML = newname;
        a.href = 'javascript:;';
        span.innerHTML = '&gt;';
        a.addEventListener('click', function (e) {
            e.stopPropagation();
            synId(e)
            view(value.id, '#openfile' + crumb.dataset.id, '#crumbs' + crumb.dataset.id)
        });
        crumb.appendChild(span);
        crumb.appendChild(a);
    });
    // 当前所在目录
    var info = getInfo(id);
    if (info) {
        var a = document.createElement('a');
        var span = document.createElement('span');
        var newname = info.name;
        if (info.extname) {
            newname += `(${info.extname})`;
        }
        a.innerHTML = newname;
        a.href = 'javascript:;';
        span.innerHTML = '&gt;'
        crumb.appendChild(span);
        crumb.appendChild(a);
    }
}
//打开文件(夹)
var zIndex = 2;

function createWind(item) {
    var show = document.createElement('div');
    show.className = 'openW';
    show.id = 'openW' + item.id;
    show.dataset.id = item.id;
    var nav = document.createElement('nav');
    nav.className = 'navbtn';
    nav.innerHTML = '<a href="javascript:;"></a><a href="javascript:;"></a><a href="javascript:;"></a>'
    var div = document.createElement('div');
    div.className = 'openfile';
    div.id = 'openfile' + item.id;
    div.dataset.id = item.id;
    var crumbs = document.createElement('div');
    crumbs.className = 'crumbs';
    crumbs.id = 'crumbs' + item.id;
    crumbs.dataset.id = item.id;
    show.appendChild(nav);
    show.appendChild(div);
    show.appendChild(crumbs);
    show.style.zIndex = zIndex++;
    document.body.appendChild(show);
    drag(show);
    scale(show)
    var btn = nav.querySelectorAll('a');
    btn[0].addEventListener('click', function (e) {
        e.stopPropagation();

        document.body.removeChild(show);
        fileId = fileId.filter(function (value) {
            return value != item.id
        })
        windCursor();
    });
    btn[1].addEventListener('click', function (e) {
        e.stopPropagation();
        show.style.display = "none";
    });
    var is, lastL, lastT, lastW, lastH;
    btn[2].addEventListener('click', function (e) {
        e.stopPropagation();
        if (is) {
            show.style.left = lastL + 'px';
            show.style.top = lastT + 'px';
            show.style.width = lastW + 'px';
            show.style.height = lastH + 'px';
        } else {
            lastL = css(show, 'left');
            lastT = css(show, 'top');
            lastW = css(show, 'width');
            lastH = css(show, 'height');
            show.style.left = '0';
            show.style.top = '0';
            show.style.width = createFile.clientWidth + 'px';
            show.style.height = createFile.clientHeight + 'px';
        }
        is = !is
    })

};

/**
 * 
 * 拖拽移动
 * @param {any} show 要拖动的元素
 * @param {any} self 不传默认拖动框口的状态栏可移动元素,传了点击整个元素都可以移动
 */
function drag(show, self) {
    var is, lock;
    self = self == undefined ? show.children[0] : (is = true) && show;
    self.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.button == 0) {
            var startX = e.clientX;
            var startY = e.clientY;
            var rect = show.getBoundingClientRect()
            var showL = rect.left;
            var showT = rect.top;

            if (is) {
                if (show.className != 'active' && !e.shiftKey) {
                    var active = document.querySelectorAll('.active');
                    for (var i = 0; i < active.length; i++) {
                        active[i].className = '';
                    };
                    show.className = 'active';
                }
                var activeFile = document.querySelectorAll('.active');
                var open = document.querySelectorAll(".openfile");
                var desktop = document.querySelector(".createfile");
                var parent = show.parentNode;
                var floders = document.querySelectorAll('[data-type="floder"],[data-type="app"],[data-type="trash"]');
                var clones = [];
                var selecteClone = []; //存放clone坐标
                var nowClone = null;
                var nowNode = null;
            } else {
                show.style.zIndex = zIndex++;

            }
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', end);

            function move(e) {
                var disX = e.clientX - startX;
                var disY = e.clientY - startY;

                if (is) {
                    if (!nowClone) {
                        for (var i = 0; i < activeFile.length; i++) {
                            nowClone = activeFile[i].cloneNode(true);
                            clones.push(nowClone)
                            var rect1 = activeFile[i].getBoundingClientRect()
                            var l = rect1.left;
                            var t = rect1.top;
                            selecteClone.push({
                                left: l,
                                top: t
                            });
                            parent.appendChild(nowClone);
                            nowClone.style.position = "fixed";
                            nowClone.style.zIndex = 9999;
                            if (show == activeFile[i]) {
                                nowNode = nowClone;
                            };
                            css(clones[i], "left", selecteClone[i].left);
                            css(clones[i], "top", selecteClone[i].top);
                        }
                    }
                    for (var i = 0; i < clones.length; i++) {
                        css(clones[i], "left", selecteClone[i].left + disX);
                        css(clones[i], "top", selecteClone[i].top + disY);
                    };

                    for (var i = 0; i < open.length; i++) {
                        if (show.item.id == Number(open[i].dataset.id)) {
                            nowNode.style.cursor = 'not-allowed'
                        } else {
                            nowNode.style.cursor = 'pointer';
                        };
                        if (show.item.id != Number(open[i].dataset.id) && getCollide(nowNode, open[i])) {
                            open[i].parentNode.style.zIndex = zIndex++;
                        }

                    };

                } else {
                    css(show, "left", showL + disX);
                    css(show, "top", showT + disY);
                }
            }

            function end(e) {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', end);
                if (is && nowClone) {

                    var pid = [] //记录拖动的所有子集id包括自身
                    getChildrensAndSelf(show.item.id).forEach(function (item) {
                        pid.push(item.id)

                    });

                    for (var i = 0; i < activeFile.length; i++) {
                        for (var j = 0; j < open.length; j++) {
                            console.log(show.item.id != Number(open[j].dataset.id) &&
                                pid.indexOf(Number(open[j].dataset.id)) == -1 &&
                                Number(activeFile[i].item.id) != Number(open[j].dataset.id));
                            if (show.item.id != Number(open[j].dataset.id) &&
                                pid.indexOf(Number(open[j].dataset.id)) == -1 &&
                                Number(activeFile[i].item.id) != Number(open[j].dataset.id) &&
                                getCollide(nowNode, open[j])) {
                                lock = true;
                                activeFile[i].item.pid = Number(open[j].dataset.id);
                            }
                        };
                    };
                    for (var i = 0; i < activeFile.length; i++) {
                        for (var j = 0; j < floders.length; j++) {
                            if (show.item.id != floders[j].dataset.id &&
                                activeFile[i].item.id != Number(floders[j].dataset.id) &&
                                getCollide(nowNode, floders[j])) {
                                lock = true;
                                activeFile[i].item.pid = Number(floders[j].dataset.id);
                            }
                        };
                        if (!lock && show.item.id != Number(desktop.dataset.id)) {
                            activeFile[i].item.pid = Number(desktop.dataset.id);
                        }
                    }

                    refresh();
                }
            }
        }

    });
};

var isScale; //控制缩放框选
//框选
(function () {
    document.addEventListener('mousedown', function (e) {
        if (isScale || e.button == 2) {
            return;
        }
        var open = document.getElementById('openW' + n);
        if (e.target.className == "openfile") {
            var divs = open.querySelectorAll('.openfile>div');
        } else {
            var divs = document.querySelectorAll('.createfile>div');
        };
        var startX = e.clientX;
        var startY = e.clientY;
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);
        var div = document.createElement('div');
        div.className = 'select';
        document.body.appendChild(div);

        function move(e) {
            var nowX = e.clientX;
            var nowY = e.clientY;
            var disX = Math.abs(nowX - startX);
            var disY = Math.abs(nowY - startY);
            //disX = disX >= open.offsetWidth ? open.offsetWidth : disX;
            //disY = disY >= open.offsetHeight ? open.offsetHeight : disY;
            div.style.zIndex = zIndex++;
            div.style.width = disX + 'px';
            div.style.height = disY + 'px';
            div.style.top = Math.min(startY, nowY) + 'px';
            div.style.left = Math.min(startX, nowX) + 'px';
            for (var i = 0; i < divs.length; i++) {
                if (getCollide(div, divs[i])) {
                    divs[i].className = 'active';
                } else {
                    divs[i].className = ' '
                }
            };
        }

        function end() {
            document.body.removeChild(div);
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);
        }
    })
})();
//缩放 
function scale(div) {
    var l, t, w, h, a, b;
    div.onmousemove = function (e) {
        l = div.offsetLeft;
        t = div.offsetTop;
        w = div.offsetWidth;
        h = div.offsetHeight;
        mX = e.clientX - l;
        mY = e.clientY - t;
        a = (mX > (w - 10) && mX < (w + 10));
        b = (mY > (h - 10) && mY < (h + 10));
        c = (mX > -10 && mX < +10);
        d = (mY > -10 && mY < +10);
        if (mX > -5 && mX < 5) {
            div.style.cursor = 'ew-resize';
        } else if (mX > (w - 5) && mX < (w + 5)) {
            div.style.cursor = 'ew-resize';
        } else if ((mY > -5 && mY < 5)) {
            div.style.cursor = 'ns-resize';
        } else if (mY > (h - 5) && mY < (h + 5)) {
            div.style.cursor = 'ns-resize';
        } else if ((a && b) || (c && b)) {
            div.style.cursor = 'move';
        } else {
            div.style.cursor = '';
        };
    };
    div.addEventListener('mousedown', function (e) {
        var isL, isR, isT, isB;
        if (mX > -5 && mX < 5) {
            isScale = isL = true;
        } else if (mX > (w - 5) && mX < (w + 5)) {
            isScale = isR = true;
        } else if ((mY > 0 && mY < 2)) {
            isScale = isT = true;
        } else if (mY > (h - 5) && mY < (h + 5)) {
            isScale = isB = true;
        } else if (a && b) {
            isScale = isR = isB = true;
        } else if (c && b) {
            isScale = isL = isB = true;
        } else {
            isScale = false;
        };
        var L = div.offsetLeft;
        var T = div.offsetTop;
        var W = div.offsetWidth;
        var H = div.offsetHeight;
        var X = e.clientX;
        var Y = e.clientY;
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);

        function move(e) {
            var disX = Math.abs(e.clientX - X);
            var disY = Math.abs(e.clientY - Y);
            var nX = e.clientX;
            var nY = e.clientY;
            var minW = W - disX
            var minH = H - disY;
            if (minH <= 150) {
                minH = 150
                nY = div.offsetTop
            }
            if (minW <= 150) {
                minW = 150
                nX = div.offsetLeft;
            }
            if (isL) {
                if (X > nX) {
                    div.style.width = W + disX + 'px';
                } else {
                    div.style.width = minW + 'px';
                };
                div.style.left = nX + 'px';
            } else if (isR) {
                if (X < nX) {
                    div.style.width = W + disX + 'px';
                } else {
                    div.style.width = minW + 'px';
                };
            } else if (isT) {
                if (Y > nY) {
                    div.style.height = H + disY + 'px';
                } else {
                    div.style.height = minH + 'px';
                }
                div.style.top = nY + 'px';
            } else if (isB) {
                if (Y < nY) {
                    div.style.height = H + disY + 'px';
                } else {
                    div.style.height = minH + 'px';
                }
            }
            if (isR && isB) {
                if (Y < nY && X < nX) {
                    div.style.width = W + disX + 'px';
                    div.style.height = H + disY + 'px';
                } else {
                    div.style.width = minW + 'px';
                    div.style.height = minH + 'px';
                }
            } else if (isL && isB) {
                if (Y < nY && X < nX) {
                    div.style.width = W + disX + 'px';
                    div.style.height = H + disY + 'px';
                } else {
                    div.style.width = minW + 'px';
                    div.style.height = minH + 'px';
                }
            }
        }

        function end() {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);

        }
    })
}
//右键菜单
function menu(e, menu) {
    var menu = document.querySelector(menu);
    var lis = menu.querySelectorAll('li');
    var li = menu.querySelectorAll('li>ul');
    for (var i = 0; i < lis.length; i++) {
        lis[i].className = '';
    }
    for (var i = 0; i < li.length; i++) {
        li[i].style.display = 'none';
    }
    menu.style.display = 'block';
    resetMenu(e)

    function resetMenu(e) {
        var maxX = document.documentElement.clientWidth - menu.offsetWidth;
        var maxY = document.documentElement.clientHeight - menu.offsetHeight;
        var x = e.clientX - 1;
        var y = e.clientY - 3;
        if (maxX < x) {
            menu.style.left = (x - menu.offsetWidth) + "px";
        } else {
            menu.style.left = x + "px";
        };
        if (maxY < y) {
            menu.style.top = (y - menu.offsetHeight) + "px";
        } else {
            menu.style.top = y + "px";
        }
    }
    for (var i = 0; i < lis.length; i++) {
        lis[i].index = i;
        var now = -1;
        lis[i].addEventListener('mouseover', function () {
            var sub = this.children[0].nextElementSibling
            if (now > -1) {
                lis[now].children[0].nextElementSibling.style.display = 'none';
                lis[now].className = '';
            }
            if (sub) {
                sub.style.cssText = 'display:block';
                resetSub()

                function resetSub() {
                    var w = sub.getBoundingClientRect();
                    if (w.right > document.documentElement.clientWidth) {
                        sub.style.left = -sub.offsetWidth + 'px';
                    }
                    if (w.bottom > document.documentElement.clientHeight) {
                        sub.style.top = -(sub.offsetHeight - sub.parentNode.offsetHeight) + 'px';
                    }
                }
            }
            this.className = 'show';
        });
        lis[i].addEventListener('mouseout', function (e) {
            // e.stopPropagation();
            var sub = this.children[0].nextElementSibling
            for (var i = 0; i < lis.length; i++) {
                lis[i].className = '';
            }
            if (sub) {
                this.className = 'show';
                sub.style.display = 'block';
                now = this.index;
            }
        })
    }
};
//刷新
function refresh() {
    var open = document.querySelectorAll(".openfile");
    for (var i = 0; i < open.length; i++) {
        view(open[i].dataset.id, '#openfile' + open[i].dataset.id, '#crumbs' + open[i].dataset.id)
    };
    view(0, '.createfile');
}
// 删除
function del() {
    var active = document.querySelectorAll('.active');
    for (var i = 0; i < active.length; i++) {
        data.list.forEach(function (item) {
            if (item.id == active[i].dataset.id) {
                item.pid = 1
            }
        })
    };
    refresh()
    var trash = document.querySelector('.trash');
    trash.style.backgroundImage = 'url(img/trashfull.png)';
}
//新建文件夹自动+(1)
function createFilename(e, filedata) {
    var existFiles = checkName(filedata);
    if (existFiles.length) {

        for (var i = 1; i <= existFiles.length; i++) {
            var v = existFiles.find(function (ele) {
                return ele.extname == i + 1;
            });
            if (v === undefined) {
                filedata.extname = i + 1;
                break;
            }
        }
    }
    data.list.push(filedata);
    var info = getInfo(id);
    info = info == undefined ? 0 : info.id;
    if (info == 0) {
        view(0, '.createfile')
    } else {
        view(info, '#openfile' + info, '#crumbs' + info)
    }
}

function checkName(filedata) {
    var files = [];
    for (var i = 0; i < data.list.length; i++) {
        if (filedata.type == data.list[i].type &&
            filedata.name == data.list[i].name &&
            filedata.pid == data.list[i].pid) {
            files.push(data.list[i])
        }
    };
    return files;
};
//重命名
function rename(name, input) {
    name.style.display = "none";
    input.style.display = "block";
    input.value = name.innerHTML;
    input.select();
    //enter
    document.addEventListener('keydown', function (e) {
        if (e.keyCode == 13) {
            input.blur()
        }
    })
    // 重命名检测

    input.onblur = function () {
        var is;
        var start = input.value.lastIndexOf('(');
        var end = input.value.lastIndexOf(')');
        var num = input.value.slice(start + 1, end);
        var newname = input.value.slice(0, start);
        if (isNaN(num) || num == '') {
            newname = input.value;
            num = '';
        }
        for (var i = 0; i < data.list.length; i++) {
            if (input.value != name.innerHTML &&
                newname == data.list[i].name &&
                selectedLi.item.type == data.list[i].type &&
                selectedLi.item.pid == data.list[i].pid &&
                num == data.list[i].extname) {
                is = true;
                break;
            }
        };
        if (is) {
            alertWind();
        } else if (input.value.trim("") == "") {
            input.value = name.innerHTML;
            input.select();
        } else {
            input.style.display = "none";
            name.style.display = "block";
            selectedLi.item.name = newname;
            selectedLi.item.extname = num;
            var info = getInfo(id);
            if (info == undefined) {
                view(0, '.createfile')
            } else {
                view(info.id, '#openfile' + info.id, '#crumbs' + info.id)
            }
        }
    }

    // 重命名弹窗
    function alertWind() {
        var mask = document.querySelector('.mask');
        var al = mask.querySelector('.alert');
        var btn = mask.querySelectorAll('a');
        mask.style.display = 'block';
        startMove({
            el: al,
            target: {
                right: 5
            },
            time: 500,
            type: 'easeBoth'
        });
        btn[0].onclick = function (e) {
            e.stopPropagation()
            mask.style.display = 'none';
            input.select();
        };
        btn[1].onclick = function () {
            name.style.display = "block";
            input.style.display = "none";
            mask.style.display = 'none';
        }
    };
};
//碰撞检测
function getCollide(el, el2) {
    var rect = el.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();
    if (rect.right < rect2.left || rect.left > rect2.right || rect.bottom < rect2.top || rect.top >
        rect2.bottom) {
        return false;
    }
    return true;
}
//窗口光标管理
function windCursor() {
    cursor = []
    var openW = document.querySelectorAll('.openW');
    if (openW.length > 0) {
        for (var i = 0; i < openW.length; i++) {
            cursor.push({
                id: Number(openW[i].dataset.id),
                zIndex: css(openW[i], 'zIndex')
            })
        };
        cursor.sort(function (a, b) {
            return b.zIndex - a.zIndex;
        });
        n = cursor[0].id

        //框口光标
        var nav = document.querySelectorAll('.openW>nav');
        var a = document.querySelectorAll('.openW>nav>a');
        var open = document.querySelector('#openW' + n);
        var openNav = open.querySelector('nav');
        var btn = open.querySelectorAll('nav a');
        nav.forEach(function (item) {
            item.className = 'navbtn default';
        })
        openNav.className = 'navbtn';
        for (var i = 0; i < a.length; i++) {
            a[i].className = 'default';

        };
        for (var i = 0; i < btn.length; i++) {
            btn[i].className = '';

        };
    }

};


//键盘事件
(function () {
    var lastKey = "";
    document.addEventListener('keydown', function (e) {
        //按住shift+n
        var createfile = document.querySelector('.file')
        if (e.keyCode == 78 && e.shiftKey) {
            createfile.click();
        }
        //F2键重命名
        if (e.keyCode == 113) {
            var file = selectedLi.querySelector('p');
            var input = selectedLi.querySelector('input');
            rename(file, input)
        };
        //Mac下cmd加delete删除和pc下delete删除
        if ((lastKey == 93 && e.keyCode == 8) || e.keyCode == 46) {
            del()
        };
        lastKey = e.keyCode;
    });
})();
// id 同步
function synId(e) {
    if (e.target.id == "bg" || e.target.className == "createfile") {
        id = 0;
    } else if (e.target.parentNode.className == "crumbs") {
        id = Number(e.target.parentNode.dataset.id)
        e.target.parentNode.parentNode.style.zIndex = zIndex++;
        windCursor();
    } else if (e.target.parentNode.className == "openW") {
        id = Number(e.target.dataset.id);
        e.target.parentNode.style.zIndex = zIndex++;
        windCursor();
    };

}
//左键点击清除所有状态
(function () {
    document.addEventListener('click', function (e) {
        e.stopPropagation();
        //e.preventDefault();
        synId(e)
        var divs = document.querySelectorAll('.createfile>div,.openfile>div');
        for (var i = 0; i < divs.length; i++) {
            divs[i].className = " ";
        };
        var menu = document.querySelector('.menu');
        var subMenu = document.querySelector('.submenu');
        menu.style.display = subMenu.style.display = 'none';
    })

})();
//记录右键菜单在哪呼出并更改id;
(function () {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.id == "bg" || e.target.className == "createfile") {
            id = 0;
        } else if (e.target.className == "openfile") {
            id = Number(e.target.dataset.id);

        };
        //右键菜单调用
        console.log(e.target.tagName);
        if (e.target.tagName == "DIV") {
            menu(e, '.menu');
        } else if (e.target.tagName == "P" || e.target.tagName == "SPAN") {
            menu(e, '.submenu');
        };
    })
})();

//dock
(function () {
    var dock = document.querySelector('.dock');
    d = getDockChildren(0)
    d.forEach(function (item) {
        var li = document.createElement('li');
        li.className = item.type;
        li.dataset.type = item.type;
        dock.appendChild(li);
        // li.addEventListener('click', function () {
        //     createWind(item);
        //     fileId.push(item.id)
        //     view(item.id, '#openfile' + item.id, '#crumbs' + item.id, true);
        // });
    })
    var lis = dock.querySelectorAll('li');
    document.onmousemove = function (e) {
        for (var i = 0; i < lis.length; i++) {
            var x = lis[i].offsetLeft + lis[i].offsetWidth / 2;
            var y = lis[i].offsetTop + lis[i].offsetHeight / 2 + dock.offsetTop;
            var a = e.clientX - x;
            var b = e.clientY - y;
            var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
            var scale = 1 - c / 300;
            if (scale < 0.5) {
                scale = 0.5;
            }
            lis[i].style.width = scale * 120 + 'px';
            lis[i].style.height = scale * 120 + 'px';
            lis[i].style.backgroundSize = scale * 120 + 'px' + ' ' + scale * 120 + 'px'
        }

    };
})()