/**
 * Created with JetBrains PhpStorm.
 * User: xuyifei
 * Date: 13-11-1
 * Time: 下午4:13
 * To change this template use File | Settings | File Templates.
 */

/**
 *
 * @param d 当前的鼠标点击的地方
 * @returns {Array} 返回流经该处的流量经过的路径
 */
function generateArr(d,link,node) {
    var b = [];
    //console.log(d.srcElement.__data__);
    for (var i = 0; i < link[0].length; i++) {
        //  console.log(link[0][i].__data__.source.name);
        //  console.log(d.srcElement.__data__.target.name);
        /*寻找源是目标,即找出下一条高亮路劲,不过现在只能找出一条*/
        if (link[0][i].__data__.source.name === d.srcElement.__data__.target.name)
            b.push(i);
    }
    /*把去路上的全部高亮了*/
    for (var j = 0; j < b.length; j++) {
        for (var i = 0; i < link[0].length; i++) {
            if (link[0][b[j]].__data__.target.name === link[0][i].__data__.source.name)    b.push(i);
        }
    }

    for (var i = 0; i < link[0].length; i++) {
        /*把当前的也加入*/
        if (link[0][i].__data__.target.name === d.srcElement.__data__.target.name && link[0][i].__data__.source.name === d.srcElement.__data__.source.name)
            b.push(i);
    }
    /***
     * source部分，这里的话应该是还要考虑所占比例的 = =|||怎么办.现在只能传入一个link的id啊TAT
     * 先传了再说吧,后面再尝试改
     */
    var a = [];
    for (var i = 0; i < link[0].length; i++) {
        if (link[0][i].__data__.target.name === d.srcElement.__data__.source.name) {
            a.push(i);
        }
    }
    for (var j = 0; j < a.length; j++) {
        for (var i = 0; i < link[0].length; i++) {
            if (link[0][a[j]].__data__.source.name === link[0][i].__data__.target.name) a.push(i);
        }
    }
    a = a.concat(b);
    return  a;
}

/**
 *
 * @param d
 * @returns {Array}
 * 找出点击link时候需要高亮的节点。
 */
function generateNode(d,link,node) {
    var res = [];
    var b = [];
    for (var i = 0; i < link[0].length; i++) {
        /*寻找源是目标,即找出下一条高亮路劲,不过现在只能找出一条*/
        if (link[0][i].__data__.source.name === d.srcElement.__data__.target.name) {
            res.push(d.srcElement.__data__.source.name);
            res.push(d.srcElement.__data__.target.name);
            res.push(link[0][i].__data__.target.name);
            b.push(i);
        }

    }
    /*把去路上的全部高亮了*/
    for (var j = 0; j < b.length; j++) {
        for (var i = 0; i < link[0].length; i++) {
            if (link[0][b[j]].__data__.target.name === link[0][i].__data__.source.name) {
                res.push(link[0][i].__data__.source.name);
                res.push(link[0][i].__data__.target.name);
                b.push(i);
            }
        }
    }

    for (var i = 0; i < link[0].length; i++) {
        /*把当前的也加入*/
        if (link[0][i].__data__.target.name === d.srcElement.__data__.target.name && link[0][i].__data__.source.name ===
            d.srcElement.__data__.source.name) {
            b.push(i);
            res.push(d.srcElement.__data__.source.name);
            res.push(d.srcElement.__data__.target.name);
        }
    }
    /***
     * source部分，这里的话应该是还要考虑所占比例的 = =|||怎么办.现在只能传入一个link的id啊TAT
     * 先传了再说吧,后面再尝试改
     */
    var a = [];
    for (var i = 0; i < link[0].length; i++) {
        if (link[0][i].__data__.target.name === d.srcElement.__data__.source.name) {
            a.push(i);
            res.push(link[0][i].__data__.target.name);
            res.push(link[0][i].__data__.source.name);
        }
    }
    for (var j = 0; j < a.length; j++) {
        for (var i = 0; i < link[0].length; i++) {
            if (link[0][a[j]].__data__.source.name === link[0][i].__data__.target.name) {
                a.push(i);
                res.push(link[0][a[j]].__data__.source.name);
                res.push(link[0][a[j]].__data__.target.name);
                res.push(link[0][i].__data__.source.name);
            }
        }
    }
    return  res;
}

/**
 * 点击link高亮函数
 */
function highLightFromLink(link,node) {
    var a = [];     //需要高亮的路径,存放数组
    var b = [];
    var point = 0;  //点击某个point之后动态生成a数组

    for (var i = 0; i < link[0].length; i++) {
        var k = 0;
        link[0][i].addEventListener("click", function (d) {   /*现在存在问题是点击之后返回当前点击的是哪个link*/
            a = generateArr(d,link,node);
            /*点击之后动态生成*/
            b = generateNode(d,link,node);
            b = b.unique();
            if (link[0][a[0]].className.animVal === oldLink) {
                for (var ii = 0; ii < link[0].length; ii++) {
                    link[0][ii].className.baseVal = oldLink;
                    link[0][ii].className.animVal = oldLink;
                }
                for (var ii = 0; ii < node[0].length; ii++) {
                    if (node[0][ii].className.animVal === firstNode) continue;
                    node[0][ii].className.animVal = oldNode;
                    node[0][ii].className.baseVal = oldNode;
                }

                for (k = 0; k < a.length; k++) {
                    link[0][a[k]].className.baseVal = newLink;
                    link[0][a[k]].className.animVal = newLink;
                }
                for (var j = 0; j < b.length; j++) {
                    for (var r = 0; r < node[0].length; r++) {
                        if (node[0][r].__data__.name === b[j]) {
                            if (node[0][r].__data__.targetLinks.length < 1) continue;
                            node[0][r].className.animVal = newNode;
                            node[0][r].className.baseVal = newNode;
                        }
                    }
                }
            }
            else {
                for (k = 0; k < a.length; k++) {
                    link[0][a[k]].className.baseVal = oldLink;
                    link[0][a[k]].className.animVal = oldLink;
                }
                for (var j = 0; j < b.length; j++) {
                    for (var r = 0; r < node[0].length; r++) {
                        if (node[0][r].__data__.name === b[j]) {
                            if (node[0][r].__data__.targetLinks.length < 1) continue;
                            node[0][r].className.animVal = oldNode;
                            node[0][r].className.baseVal = oldNode;
                        }
                    }
                }
            }
        });
    }
}

/**
 *
 * @param d
 * @returns {Array}
 * 根据点击的节点m返回需要高亮的link，和generateArr基本相同,后面可以合成一个函数.
 *
 */
function generateLink(d,link,node) {
    var b = [];
    /*先找去路的*/
    for (var i = 0; i < link[0].length; i++) {
        if (link[0][i].__data__.source.name === d.srcElement.__data__.name) b.push(i);
    }
    /*把去路上的全部高亮了*/
    for (var j = 0; j < b.length; j++) {
        for (var i = 0; i < link[0].length; i++) {
            if (link[0][b[j]].__data__.target.name === link[0][i].__data__.source.name)    b.push(i);
        }
    }
    /*再找去路的*/
    var a = [];
    for (var i = 0; i < link[0].length; i++) {
        if (link[0][i].__data__.target.name === d.srcElement.__data__.name) {
            a.push(i);
        }
    }
    for (var j = 0; j < a.length; j++) {
        for (var i = 0; i < link[0].length; i++) {
            if (link[0][a[j]].__data__.source.name === link[0][i].__data__.target.name) a.push(i);
        }
    }
    a = a.concat(b);
    return a;
}

/**
 *
 * @param d
 * @returns {Array}
 * 返回点击node后需要高亮的node数组
 */
function generateNodeII(d,link,node) {
    var res = [];
    var b = [];
    for (var i = 0; i < link[0].length; i++) {
        /*寻找源是目标,即找出下一条高亮路劲,不过现在只能找出一条*/
        if (link[0][i].__data__.source.name === d.srcElement.__data__.name) {
            res.push(d.srcElement.__data__.name);
            res.push(link[0][i].__data__.target.name);
            b.push(i);
        }
    }
    /*把去路上的全部高亮了*/
    for (var j = 0; j < b.length; j++) {
        for (var i = 0; i < link[0].length; i++) {
            if (link[0][b[j]].__data__.target.name === link[0][i].__data__.source.name) {
                res.push(link[0][i].__data__.source.name);
                res.push(link[0][i].__data__.target.name);
                b.push(i);
            }
        }
    }

    var a = [];
    for (var i = 0; i < link[0].length; i++) {
        if (link[0][i].__data__.target.name === d.srcElement.__data__.name) {
            a.push(i);
            res.push(link[0][i].__data__.target.name);
            res.push(link[0][i].__data__.source.name);
        }
    }
    for (var j = 0; j < a.length; j++) {
        for (var i = 0; i < link[0].length; i++) {
            if (link[0][a[j]].__data__.source.name === link[0][i].__data__.target.name) {
                a.push(i);
                res.push(link[0][a[j]].__data__.source.name);
                res.push(link[0][a[j]].__data__.target.name);
                res.push(link[0][i].__data__.source.name);
            }
        }
    }
    return  res;
}
/**
 * node点击高亮函数
 */
function highLightFromNode(link,node) {

    for (var i = 0; i < node[0].length; i++) {
        node[0][i].addEventListener("click", function (d) {
            var linkArr = [];
            var nodeArr = [];
            linkArr = generateLink(d,link,node);
            nodeArr = generateNodeII(d,link,node);
            nodeArr = nodeArr.unique();

            if (link[0][linkArr[0]].className.animVal === oldLink) {
                for (var ii = 0; ii < link[0].length; ii++) {
                    link[0][ii].className.baseVal = oldLink;
                    link[0][ii].className.animVal = oldLink;
                }
                for (var ii = 0; ii < node[0].length; ii++) {
                    if (node[0][ii].className.animVal === firstNode) continue;
                    node[0][ii].className.animVal = oldNode;
                    node[0][ii].className.baseVal = oldNode;
                }

                for (k = 0; k < linkArr.length; k++) {
                    link[0][linkArr[k]].className.baseVal = newLink;
                    link[0][linkArr[k]].className.animVal = newLink;
                }
                for (var j = 0; j < nodeArr.length; j++) {
                    for (var r = 0; r < node[0].length; r++) {
                        if (node[0][r].__data__.targetLinks.length < 1) continue;
                        if (node[0][r].__data__.name === nodeArr[j]) {
                            node[0][r].className.animVal = newNode;
                            node[0][r].className.baseVal = newNode;
                        }
                    }
                }
            }
            else {
                for (k = 0; k < linkArr.length; k++) {
                    link[0][linkArr[k]].className.baseVal = oldLink;
                    link[0][linkArr[k]].className.animVal = oldLink;
                }
                for (var j = 0; j < nodeArr.length; j++) {
                    for (var r = 0; r < node[0].length; r++) {
                        if (node[0][r].__data__.targetLinks.length < 1) continue;
                        if (node[0][r].__data__.name === nodeArr[j]) {
                            node[0][r].className.animVal = oldNode;
                            node[0][r].className.baseVal = oldNode;
                        }
                    }
                }
            }
        });
    }
}

