//更换桌面
// (function () {
//     var bgArr = ['url(img/preset_bg_1.jpg)', 'url(img/preset_bg_2.jpg)', 'url(img/preset_bg_3.jpg)', 'url(img/preset_bg_4.jpg)'];
//     var bg = document.querySelector('#bg');
//     var change = document.querySelector('.change');
//     var num = 0;
//     change.onclick = function () {
//         num++
//         bg.style.backgroundImage = bgArr[num % bgArr.length];
//     }
// })();
//新建文件夹
(function () {
    var createFile = document.querySelector('.createfile ');
    var file = document.querySelector('.file'); //右键新建文件夹
    createFile.style.height = document.documentElement.clientHeight + 'px';
    createFile.style.width = document.documentElement.clientWidth + 'px';
    // file.onclick = function () {
    //     create()
    // };
    //按住shift+n
    // document.addEventListener('keyup', function (e) {
    //     if (e.keyCode == 78 && e.shiftKey) {
    //         create()
    //     }
    // })



})();
// //创建文件夹
function create(setname, setImg, res) {
    var createFile = document.querySelector('.createfile ');
    var subMenu = document.querySelector('.submenu');
    var newFile = document.createElement('li');
    var fileIco = document.createElement('span');
    var file = document.createElement('p');
    var input = document.createElement('input');
    var offset = getfileOffset();
    newFile.style.left = offset.x + "px";
    newFile.style.top = offset.y + "px";
    newFile.style.zIndex = 1;
    setImg = (typeof (setImg) == "undefined") ? 'url(img/1.png)' : setImg;
    fileIco.style.backgroundImage = setImg
    setname = (typeof (setname) == "undefined") ? getFileName() : setname;
    file.innerHTML = setname;
    addEv();
    submenu(); //文件夹菜单
    newFile.appendChild(fileIco);
    newFile.appendChild(file);
    newFile.appendChild(input);
    createFile.appendChild(newFile);
    //给创建的文件夹添加事件
    function addEv() {
        newFile.addEventListener('mouseover', function () {
            this.className = this.className == "show active" ? "show active" : "show";
        });
        newFile.addEventListener('click', function (e) {
            //按住shift
            e.stopPropagation();
            e.preventDefault();
            subMenu.style.display = 'none';
            if (!e.shiftKey) {
                var newFiles = createFile.querySelectorAll('li');
                for (var i = 0; i < newFiles.length; i++) {
                    newFiles[i].className = '';
                };
            }
            this.className = this.className == "show active" ? "show" : "show active";
        });
        newFile.addEventListener('mouseout', function () {
            this.className = this.className == "show active" ? "show active" : " ";
        });
        file.addEventListener('dblclick', function () {
            rename(file, input)
        });
        if (res) {
            newFile.addEventListener('dblclick', function () {
                //var img = new Image();
                //img.src = res;
                createWind();
            });
        }

    };
    //文件夹菜单
    function submenu() {
        var subMenu = document.querySelector('.submenu');
        var menu = document.querySelector('.menu');
        var btn = subMenu.querySelectorAll('li');
        newFile.addEventListener('contextmenu', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var newFiles = createFile.querySelectorAll('li');
            for (var i = 0; i < newFiles.length; i++) {
                newFiles[i].className = '';
            };
            newFile.className = "show active";
            menu.style.display = 'none';
            subMenu.style.display = 'block';
            subMenu.style.left = e.clientX + 'px';
            subMenu.style.top = e.clientY + 'px';

        });
        btn[0].addEventListener('click', function () {
            var nowFile = document.querySelector('.createfile .active');
            subMenu.style.display = 'none'
            rename(nowFile.children[1], nowFile.children[2]);


        });
        btn[1].addEventListener('click', function () {
            subMenu.style.display = 'none'
            del()
            resetOffset();
        })
    };
    // 拖拽删除
    var trash = document.querySelector('#trash');
    newFile.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var cloneFiles = [];
        var selectFile = createFile.querySelectorAll('.show ,.active');
        var startX = e.clientX;
        var startY = e.clientY;
        for (var i = 0; i < selectFile.length; i++) {
            var newNode = selectFile[i].cloneNode(true);
            newNode.startY = css(selectFile[i], 'top');
            newNode.startX = css(selectFile[i], 'left');
            css(newNode, "opacity", 40);
            newNode.style.zIndex = 0;
            createFile.appendChild(newNode);
            cloneFiles.push(newNode);
            if (selectFile[i] == this) {
                var self = newNode;
            }
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);

        function move(e) {
            var disX = e.clientX - startX;
            var disY = e.clientY - startY;
            for (var i = 0; i < cloneFiles.length; i++) {
                css(cloneFiles[i], "left", cloneFiles[i].startX + disX);
                css(cloneFiles[i], "top", cloneFiles[i].startY + disY);
            }
        }

        function end(e) {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);

            if (getCollide(self, trash)) {
                for (var i = 0; i < selectFile.length; i++) {
                    createFile.removeChild(selectFile[i]);
                }
            }
            resetOffset();
            for (var i = 0; i < cloneFiles.length; i++) {
                createFile.removeChild(cloneFiles[i]);
            }
        }
    })
}
//框选
(function () {
    var createFile = document.querySelector('.createfile ');
    document.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        e.preventDefault();
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
            div.style.width = Math.abs(nowX - startX) + 'px';
            div.style.height = Math.abs(nowY - startY) + 'px';
            div.style.left = Math.min(startX, nowX) + 'px';
            div.style.top = Math.min(startY, nowY) + 'px';
            var newFile = createFile.querySelectorAll('li');
            for (var i = 1; i < newFile.length; i++) {
                if (getCollide(div, newFile[i])) {
                    newFile[i].className = 'show active'
                } else {
                    newFile[i].className = ' '
                }
            };
        };

        function end() {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);
            document.body.removeChild(div);
        }
    });
})();

//键盘事件
(function () {
    var lastKey = "";
    document.addEventListener('keydown', function (e) {
        //F2键重命名
        if (e.keyCode == 113) {
            var files = document.querySelector('.createfile .active');
            var file = files.querySelector('p');
            var input = files.querySelector('input');
            rename(file, input)
        };
        //Mac下cmd加delete删除和pc下delete删除

        if ((lastKey == 93 && e.keyCode == 8) || e.keyCode == 46) {
            del()
            resetOffset();
        };
        lastKey = e.keyCode;
    });
})();
// 删除
function del() {
    var files = document.querySelectorAll('.createfile .active');
    for (var i = 0; i < files.length; i++) {
        files[i].parentNode.removeChild(files[i])
    };

}
//窗口改变修改文件夹位置
window.addEventListener('resize', resetOffset);
//位置重新设置
function resetOffset() {
    var files = document.querySelectorAll('.createfile li');
    for (var i = 0; i < files.length; i++) {
        var offset = getfileOffset(i);
        files[i].style.left = offset.x + "px";
        files[i].style.top = offset.y + "px";
    }
}
//重命名
function rename(file, input) {
    file.style.display = "none";
    input.style.display = "block";
    input.value = file.innerHTML;
    input.select();
    //enter
    document.addEventListener('keydown', function (e) {
        if (e.keyCode == 13) {
            input.blur()
        }
    })
    // 重命名检测
    input.onblur = function () {
        if (hasName(input.value, file)) {
            alertWind();
            return;
        }
        if (input.value.trim("") == "") {
            input.value = file.innerHTML;
            input.select();
        } else {
            file.innerHTML = input.value;
            file.style.display = "block";
            input.style.display = "none";
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
        btn[0].onclick = function () {
            mask.style.display = 'none';
            console.log(input)
            input.select();
        };
        btn[1].onclick = function () {
            file.style.display = "block";
            input.style.display = "none";
            mask.style.display = 'none';
        }
    };

};
//上传
// (function () {
//     var file = document.querySelector('.upload');
//     file.onchange = function (e) {
//         var type = file.files[0].type.split("/")[0];

//         switch (type) {
//             case "image":
//                 createImg(file.files[0]);
//                 break;
//             case "video":
//                 createVideo(file.files[0]);
//                 break;
//             case "audio":
//                 createAudio(file.files[0]);
//                 break;
//             case "text":
//                 createText(file.files[0])
//                 break;
//             default:
//                 alert("对不起，暂时不支持该类型的文件");
//         }
//     };

//     function createImg(files) {
//         var reader = new FileReader();
//         var name = files.name;

//         reader.onload = function (e) {
//             var img = new Image();
//             img.src = e.target.result;
//             create(name, 'url(img/photo.png)', e.target.result)
//         };
//         reader.readAsDataURL(files);
//     }

//     function createText(files) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             var name = files.name
//             var img = document.createElement("p");
//             img.innerHTML = e.target.result;
//             create(name, 'url(img/txt.png)', e.target.result)
//             e.preventDefault();
//         };
//         reader.readAsText(files);
//     }

//     function createVideo(files) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             var name = files.name
//             var v = document.createElement("video");
//             v.src = e.target.result;
//             v.setAttribute('controls', "")
//             createWind(v)
//             create(file, name, 'url(img/video.png)')
//         };
//         reader.readAsDataURL(files);
//     }

//     function createAudio(files) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             var name = files.name

//             var a = document.createElement("audio");
//             a.src = e.target.result;
//             a.setAttribute('controls', "")
//             createWind(a)
//             create(file, name, 'url(img/music.png)')
//         };
//         reader.readAsDataURL(files);
//     }
// })();

function createWind(el) {
    var show = document.createElement('div');
    show.className = 'uploadf'
    var nav = document.createElement('nav');
    nav.innerHTML += '<a href="javascript:;"></a><a href="javascript:;"></a><a href="javascript:;"></a>'
    var div = document.createElement('div');
    div.className = 'uploadfile'
    show.appendChild(nav);
    show.appendChild(div);
    div.appendChild(el);
    document.body.appendChild(show);
    // el.style.maxWidth = show.offsetWidth + 'px';
    // el.style.maxHeight = show.offsetHeight - 20 + 'px';
    show.style.zIndex = 2;
    show.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var startX = e.clientX;
        var startY = e.clientY;
        var showL = css(show, "left");
        var showT = css(show, "top")
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);

        function move(e) {
            var disX = e.clientX - startX;
            var disY = e.clientY - startY;
            css(show, "left", showL + disX);
            css(show, "top", showT + disY);

        }

        function end(e) {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);

        }
    })
    var btn = nav.querySelectorAll('a');
    btn[0].addEventListener('click', function (e) {
        e.stopPropagation();
        show.style.display = "none";
    })
}
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

// function getFileName() {
//     var start = "新建文件夹";
//     var fillNames = document.querySelectorAll('.createfile p');
//     var names = [];
//     fillNames.forEach(function (file) {
//         names.push(file.innerHTML);
//     });
//     names = names.filter(function (value) {
//         if (
//             (value == start) ||
//             (value.substring(0, 6) == "新建文件夹(" /*前后6位是新建文件夹( */ &&
//                 value.charAt(value.length - 1) == ")" /*最后一位是) */ &&
//                 Number(value.substring(6, value.length - 1)) > 1 /* 不能是 新建文件夹(0)和新建文件夹(1)  */ &&
//                 parseInt(value.substring(6, value.length - 1)) + "" === value.substring(6, value.length - 1) /* 排除小数 和 前边有0的 */
//             )
//         ) {
//             return true;
//         }
//         return false;
//     });
//     names.sort(function (a, b) {
//         a = a.length < 6 ? 0 : a.substring(6, a.length - 1);
//         b = b.length < 6 ? 0 : b.substring(6, b.length - 1);
//         return a - b;
//     });
//     if (names.length == 0 || names[0] != start) {
//         return start;
//     }
//     for (var i = 1; i < names.length; i++) {
//         if (start + "(" + (i + 1) + ")" !== names[i]) {
//             return start + "(" + (i + 1) + ")";
//         }
//     }
//     return start + "(" + (names.length + 1) + ")";
// }
/* 判断这个名字是否存在 */
//name 新名字  now 当前是第几个文件 
function hasName(name, now) {
    var fillNames = document.querySelectorAll('.createfile p');
    for (var i = 0; i < fillNames.length; i++) {
        if (now != fillNames[i] && fillNames[i].innerHTML == name) {
            return true;
        }
    }
    return false;
}