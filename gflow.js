// JavaScript Document
var margin = {top: 1, right: 1, bottom: 6, left: 1},
    width = 4300 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
    format = function (d) {
        return formatNumber(d) + " 访问次数";
    },
    format_for_node = function (d) {
        return formatNumber(d) + " 浏览流量";
    },
    color = d3.scale.category20();
/*颜色是随机变化的*/

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var sankey = d3.sankey()
    .nodeWidth(187)
    .nodePadding(10)        //nodePadding 是指同一列中node之间的距离
    .size([width, height]);

var path = sankey.link();

var oldLink = "link";  //原来的class,点击之后变为新的class
var newLink = "link2";
var oldNode = "node1";
var newNode = "node2";
var firstNode = "node0";    /*第一个node单独标记*/


d3.json("data.json", function (energy) {

    sankey
        .nodes(energy.nodes)
        .links(energy.links)
        .layout(0);         //layout里的参数表示什么意思啊

    var link = svg.append("g").selectAll(".link")
            .data(energy.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("style", "display:block")
            .attr("d", path)
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            })
            .sort(function (a, b) {
                return b.dy - a.dy;
            })
        ;

    /*
     设置鼠标点击事件,高亮显示流经某处的流量（好吧,这只是目标）
     现在....
     */

    /**
     *
     * @param d 当前的鼠标点击的地方
     * @returns {Array} 返回流经该处的流量经过的路径
     */
    function generateArr(d) {
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
    function generateNode(d) {
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


    /*显示路径的说明*/
    link.append("title")
        .text(function (d) {
            return d.source.name + " 到 " + d.target.name + "\n" + format(d.value);
        });
    /*link加个div标签*/
    link.append("div")
        .style(function () {
            return "background:red"
        })
        .text("rrr");

    var node = svg.append("g").selectAll(".node")
        .data(energy.nodes)
        .enter().append("g")
        .attr("class", function (d) {
            if (d.targetLinks.length < 1) return "node0";
            else return "node1";
        })
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })

    node.append("rect")
        .attr("height", function (d) {
            return d.dy;
        })
        .attr("width", sankey.nodeWidth())

        //          .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function (d) {
            return d.name + "\n" + format_for_node(d.value);
        })
    ;


    node.append("text")
        .attr("y", function (d) {
            return d.dy / 12;
        })
        .attr("dy", ".5em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
            return d.name;
        })
        .filter(function (d) {
            return d.x < width / 2;
        })
        .attr("x", sankey.nodeWidth() / 10)  //删掉了上面对x属性赋值的操作,没啥用~主要是为了改变附加的说明,这个到后面换成标签
        .attr("text-anchor", "start");




    node.append("line")
        .attr("x1", "195")
        .attr("x2", "195")
        .attr("y1", function (d) {
            var source = 0;
            var target = 0;
            var dy = 0;
            source = d.value;
            for (var i = 0; i < d.sourceLinks.length; i++) {
                target += d.sourceLinks[i].value;
                dy += d.sourceLinks[i].dy;
            }

            if (d.dy < 6) return dy;
            return dy+6;
        })
        .attr("y2", function (d) {
            return d.dy -6;
        })
        .attr("stroke", "red")
        .attr("stroke-width", "15")
        .attr("stroke-linecap", "square")
        .attr("style", "line")
        .attr("display",function(d) {
            var dy = 0;
            for (var i = 0; i < d.sourceLinks.length; i++) {
                dy += d.sourceLinks[i].dy;
            }
            if (d.dy-dy < 0.001) return "none";
        })

        .append("title")
        .text(function (d) {
            return "13.2k 流失次数";
        });
    /**
     * 增加节点的说明标签
     * @type {Array}
     */


    var a = [];     //需要高亮的路径,存放数组
    var b = [];
    var point = 0;  //点击某个point之后动态生成a数组

    for (var i = 0; i < link[0].length; i++) {
        var k = 0;
        link[0][i].addEventListener("click", function (d) {   /*现在存在问题是点击之后返回当前点击的是哪个link*/
            a = generateArr(d);
            /*点击之后动态生成*/
            b = generateNode(d);
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

    /**
     *
     * @param d
     * @returns {Array}
     * 根据点击的节点m返回需要高亮的link，和generateArr基本相同,后面可以合成一个函数.
     *
     */
    function generateLink(d) {
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
    function generateNodeII(d) {
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

    for (var i = 0; i < node[0].length; i++) {
        node[0][i].addEventListener("click", function (d) {
            var linkArr = [];
            var nodeArr = [];
            linkArr = generateLink(d);
            nodeArr = generateNodeII(d);
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

});

