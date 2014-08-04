/**
 * Created with JetBrains PhpStorm.
 * User: xuyifei
 * Date: 13-11-1
 * Time: 下午4:13
 * To change this template use File | Settings | File Templates.
 */
/**
 * 主函数用来画出流图
 * @param _w
 * @param _h
 */
var gflow_func = function () {
    "use strict";
    var gflow_func = {level: 0};
    gflow_func.draw = function (_w, _h) {
        var oldLink = "link",
            newLink = "link2",
            oldNode = "node1",
            newNode = "node2",
            firstNode = "node0";    //第一个node单独标记
        var margin = {top: 1, right: 1, bottom: 50, left: 1};
        var minheight = 500,
            width = _w - margin.left - margin.right,
            height = (_h - margin.top - margin.bottom);
        height = height < minheight ? minheight : height;
        var formatNumber = d3.format(",.0f"),
            format = function (d) {
                return formatNumber(d);
            },
            format_for_node = function (d) {
                return formatNumber(d) + " 浏览流量";
            },
            color = d3.scale.category20();
        var svg = d3.select("#gflowchart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            ;
        var sankey = d3.sankey()
            .nodeWidth(187)
            .nodePadding(50) //nodePadding 是指同一列中node之间的距离
            .size([width, height]);
        var path = sankey.link();
        d3.json("/ggflow/data/data.json", function (energy) {
                if (energy.links.length <= 0) {
                    // 针对没有数据的情况
                    alert("sorry, no data");
                    return;
                }
                sankey
                    .nodes(energy.nodes)
                    .links(energy.links)
                    .layout(0);

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
                /*显示路径的说明*/
                link.append("tle")
                    .text(function (d) {
                        return d.source.name + " 到 " + d.target.name + "\n" + d.value;
                    })
                    .attr("style", "display:none");

                var node = svg.append("g").selectAll(".node")
                    .data(energy.nodes)
                    .enter().append("g")
                    .attr("class", function (d) {
                        if (d.targetLinks.length < 1) return "node0";
                        else return "node1";
                    })
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
                node.append("rect")
                    .attr("height", function (d) {
                        return d.dy;
                    })
                    .attr("width", sankey.nodeWidth())
                ;
                /**
                 * 增加节点的说明标签
                 * @type {NodeList}
                 */
                var oDiv = document.getElementsByClassName("VU"),
                    frameDiv  = document.getElementsByClassName("UKb");
                highLightFromLink(link, oDiv);

                var x,
                    y,
                    dx,
                    dy,
                    maxLevel = 0;
                /**
                 * 在每个node上面增加一层div
                 */
                node[0].forEach(function (value) {
                    "use strict";
                    var source = [],
                        target = [],
                        num = 0,
                        t = value.__data__.targetLinks;

                    while (1) {
                        if (t.length < 1) {
                            break;
                        }
                        t = t[0].source.targetLinks;
                        num++;
                    }
                    for (var i = 0, len = value.__data__.sourceLinks.length; i < len; i++) {
                        target.push(value.__data__.sourceLinks[i].target.name);
                    }
                    for (var i = 0, len = value.__data__.targetLinks.length; i < len; i++) {
                        source.push(value.__data__.targetLinks[i].source.name);
                    }

                    var sum = 0,
                        sumDy = 0,
                        flag = 1;

                    for (var i = 0, len = value.__data__.sourceLinks.length; i < len; i++) {
                        sum += value.__data__.sourceLinks[i].value;
                        sumDy += value.__data__.sourceLinks[i].dy;
                    }
                    if (value.__data__.targetLinks.length <= 0) {
                        flag = 0;
                    }

                    x = value.__data__.x;
                    y = value.__data__.y;
                    dy = value.__data__.dy;
                    dx = value.__data__.dx;

                    var frameDiv = document.createElement("div"),   //外面一层大的div层
                        newDiv = document.createElement("div"),     //里面展示的div层
                        frameOut = document.createElement("div"),    //流失部分外层框架div
                        out = document.createElement("div"),        //流失部分
                        out1 = document.createElement("div"),       //流失部分2
                        out2 = document.createElement("div"),       //流失部分箭头
                        iconDiv = document.createElement("div"),    //节点图标
                        readDiv = document.createElement("div"),    //节点文字说明
                        valueSpan = document.createElement("span"),
                        outDiv = document.getElementsByClassName("out");

                    newDiv.source = source;
                    out.source = source;
                    out.name = value.__data__.name;
                    out.style.opacity = 0.8;
                    newDiv.target = target;

                    frameDiv.className = "Ukb";
                    newDiv.className = "VU";
                    newDiv.style.opacity = 1;
                    readDiv.className = "QNb";
                    valueSpan.className = "WS";

                    out.className = "out";
                    out1.className = "out1";
                    out2.className = "out2";
                    if (flag == 0) {
                        iconDiv.className = "z6";
                        newDiv.className = "VUH";
                    } else {
                        iconDiv.className = "IU";
                    }

                    frameDiv.style.width = dx + 4 + "px";
                    newDiv.style.width = dx + 2 + "px";
                    frameDiv.style.height = dy + 4 + "px";
                    newDiv.style.height = dy + 2 + "px";
                    frameDiv.style.top = y + "px";
                    frameDiv.style.left = x + "px";

                    iconDiv.style.left = 2 + "px";
                    iconDiv.style.top = 2 + "px";

                    out2.innerHTML = "⇩";
                    outDiv.innerHTML = value.__data__.value - sum + "流失次数";

                    var name = value.__data__.name,
                        child = value.__data__.child,
                        nameArr = name.split("|"),
                        __name = "";

                    name = nameArr[0];
                    if (name.length > 50) {
                        __name = name.substr(0, 15) + "..." + name.substr(name.length - 15);
                    } else {
                        __name = name;
                    }
                    newDiv.__name__ = name;
                    newDiv.__child__ = child;
                    readDiv.innerHTML = __name;

                    newDiv.name = value.__data__.name;
                    newDiv.level = num;
                    newDiv.highlight = 0;
                    value.__data__.level = num;
                    out.level = num;
                    var totalin = 0, totalout = 0;
                    var arrLinksTemp = value.__data__.sourceLinks;
                    len = value.__data__.sourceLinks.length;
                    totalin = value.__data__.value;

                    for (var i = 0; i < len; i++) {
                        totalout += arrLinksTemp[i].value;
                    }
                    newDiv.totalin = totalin;
                    newDiv.totalout = totalin - totalout;

                    readDiv.innerHTML += "<br>";
                    readDiv.innerHTML += value.__data__.value;
                    readDiv.innerHTML += "<div style='display:none'>" + sum + "</div>";


                    if (sum == value.__data__.value && newDiv.level < 1) {
                        out.style.display = "none";
                        out1.style.display = "none";
                        out2.style.display = "none";
                    } else {
                        if (newDiv.totalout / newDiv.totalin < 0.001) {
                            out1.style.display = "none";
                            out2.style.display = "none";
                        }
                    }

                    out.style.top = y + sumDy + "px";
                    out.style.height = dy - sumDy + "px";
                    if (dy - sumDy < 0.0001) out.style.height = "0.01px";
                    out.style.left = x + dx + "px";

                    out1.style.top = y + dy + "px";
                    out1.style.left = x + dx + "px";

                    out2.style.top = sumDy + y + (dy - sumDy) / 2 + "px";
                    out2.style.left = x + dx + "px";

                    var pre = document.getElementById("sdflow");

                    pre.appendChild(frameDiv);    //在node 上覆盖一层div
                    frameDiv.appendChild(newDiv);
                    frameDiv.appendChild(iconDiv);
                    frameDiv.appendChild(readDiv);

                    pre.appendChild(out);       //流失标志主div
                    pre.appendChild(out1);      //流失标志渐变部分div
                    pre.appendChild(out2);      //流失标志箭头标志部分div
                    maxLevel = num;
                });

                /**
                 * 对各个div块绑定事件
                 * */
                (function () {
                    var hintDiv = document.getElementById("ID-hint"),
                        hintNameDiv = document.createElement("div"),
                        outDiv = document.getElementsByClassName("out"),
                        ohDiv = document.getElementsByClassName("VUH"),
                        outDiv1 = document.getElementsByClassName("out1"),
                        outDiv2 = document.getElementsByClassName("out2"),
                        flowNodeMenu = document.getElementById("flowNodeMenu"),
                        showNodeDetails = document.getElementById("showNodeDetails"),
                        highlightNode = document.getElementById("highlightNode"),
                        labelforflow = document.getElementById("labelforflow"),
                        labelforflowheadclose = document.getElementById("labelforflowheadclose"),
                        labelforflowbody4 = document.getElementById("labelforflowbody4"),
                        labelforflowbody1 = document.getElementById("labelforflowbody1"),
                        labelforflowheadtitle = document.getElementById("labelforflowheadtitle"),
                        labelforflowbody1 = document.getElementById("labelforflowbody1"),
                        IUDiv = document.getElementsByClassName("IU"),
                        QNbDiv = document.getElementsByClassName("QNb");


                    /*对于点击弹出的菜单的hover的操作*/
                    showNodeDetails.addEventListener("mousemove", function (d) {
                        showNodeDetails.style.background = "#A9CBEB";
                    });
                    showNodeDetails.addEventListener("mouseout", function (d) {
                        showNodeDetails.style.background = "#fff";
                        d.stopPropagation();
                    });
                    highlightNode.addEventListener("mousemove", function (d) {
                        highlightNode.style.background = "#A9CBEB";
                    });
                    highlightNode.addEventListener("mouseout", function (d) {
                        highlightNode.style.background = "#fff";
                        d.stopPropagation();
                    });
                    flowNodeMenu.addEventListener("mouseout", function (d) {
                        flowNodeMenu.style.display = "none";
                    });

                    var name = "",
                        highlight = 1;

                    highlightNode.addEventListener("click", function (d) {
                        if (highlightNode.innerHTML == "取消突出显示") {
                            highlightNode.innerHTML = "突出显示途经此处的流量";
                            highlight = 1;
                        } else {
                            highlightNode.innerHTML = "取消突出显示";
                            highlight = 0;
                        }
                        highlightFlow(name);
                        flowNodeMenu.style.display = "none";
                    });
                    showNodeDetails.addEventListener("click", function (d) {
                        labelforflowheadtitle.innerHTML = showNodeDetails.flowhead;
                        labelforflowbody1.innerHTML = "网址以\"" + showNodeDetails.flowheadstr + "\"开头";
                        labelforflow.style.display = "block";
                        flowNodeMenu.style.display = "none";
                        labelforflowbody4.innerHTML = "";
                        var oTable = document.createElement("table"),
                            oTbody = document.createElement("tbody"),
                            arr = showNodeDetails.__child__,
                            innerhtml = "";
                        for (var i = 0,len = arr.length; i < len; i++) {
                            var url = arr[i].url;
                            if (url.indexOf("http") >= 0) {
                                url = url.substring(6);
                            }
                            //隔行换色
                            if (i % 2) {
                                innerhtml += "<tr class='GAecflowodd'><td class='GAecflow _Gag' width='80%'>" +
                                    "" + url + "<a class = 'galaxyflow' href = \"" + arr[i].url + "\" target = 'blank'>" +
                                    "<img src = 'img/cleardot.gif' title='查看此链接'class ='_flowimg'></a></td>" +
                                    "<td class='GAecflow' width='80%'>" + arr[i].value + "</td></tr>";
                            } else {
                                innerhtml += "<tr class='GAecfloweven'><td class='GAecflow _Gag' width='80%'>" + url + "" +
                                    "<a class = 'galaxyflow' href = \"" + arr[i].url + "\" target = 'blank'>" +
                                    "<img src = 'img/cleardot.gif' title='查看此链接'class ='_flowimg'></a></td>" +
                                    "<td class='GAecflow' width='80%'>" + arr[i].value + "</td></tr>";
                            }
                        }
                        var innerhtmlhead = "<tr class='GAecflowodd'><td class=\"GAecflow\" width=\"80%\">网页 </td><td class=\"GAecflow\" width=\"20%\"> 访问次数 </td></tr>";
                        oTbody.innerHTML = innerhtmlhead;
                        oTbody.innerHTML += innerhtml;
                        labelforflowbody4.appendChild(oTable);
                        oTable.appendChild(oTbody);
                    });
                    labelforflowheadclose.addEventListener("click", function (d) {
                        labelforflow.style.display = "none";
                    });

                    var totalFlow = 0;
                    for (var i = 0; i < ohDiv.length; i++) {
                        totalFlow += ohDiv[i].totalin;
                    }


                    for (var i = 0; i < oDiv.length; i++) {
                        oDiv[i].addEventListener("mousemove", function (d) {
                            "use strict";
                            hintDiv.style.display = "block";
                            hintDiv.style.width = "240px";
                            hintDiv.style.left = d.x - 270 + "px";
                            hintDiv.style.top = d.y - 50 + "px";
                            var innerhtml = "";
                            if (d.srcElement.__name__ === "...") {
                                innerhtml = "其他情况...";
                            } else {
                                innerhtml = d.srcElement.__name__;
                            }
                            var str = innerhtml;
                            if (str.indexOf("http://") >= 0)
                                str = str.substring(6);
                            showNodeDetails.flowheadstr = str;
                            innerhtml += "<br>";
                            str += "(" + d.srcElement.__child__.length + " 网页)";
                            innerhtml += "<center>(" + d.srcElement.__child__.length + " 网页)</center>";
                            showNodeDetails.flowhead = str;

                            var text = d.srcElement.offsetParent.innerText;
                            //这个寻找sum的真心蛋疼啊,好像ff的还不行。
                            var sum = d.srcElement.offsetParent.childNodes[2].childNodes[3].innerText;
                            var textArr = text.split("\n");
                            var total = parseInt(textArr[1]);
                            var out = parseInt(textArr[1]) - sum;
                            innerhtml += "<hr>";
                            innerhtml += sum + "    浏览流量(" + (100 * sum / total).toFixed(2) + "%)";
                            innerhtml += "<br>";
                            innerhtml += out + "    流失率(" + ((100 * out) / total).toFixed(2) + "%)";
                            hintDiv.innerHTML = innerhtml;
                        });
                        oDiv[i].onmouseout = function (d) {
                            hintDiv.style.display = "none";
                        }
                        /*绑定onclick事件,弹出菜单*/
                        oDiv[i].addEventListener("click", function (d) {
                            showNodeDetails.__child__ = d.srcElement.__child__;
                            flowNodeMenu.__obj = d;
                            name = d.srcElement.name;
                            highlight = d.srcElement.highlight;
                            setTimeout(flowNodeMenu.style.display = "block",1000);
                            flowNodeMenu.style.left = d.x - 190 + "px";
                            flowNodeMenu.style.top = d.y - 70 + document.body.scrollTop + "px";
                        });
                        QNbDiv[i].addEventListener("click",function(d){
                            var elem = d.srcElement.parentElement.childNodes[0];
                            showNodeDetails.__child__ = elem.__child__;
                            flowNodeMenu.__obj = elem;
                            name = elem.name;
                            highlight = elem.highlight;
                            flowNodeMenu.style.display = "block";
                            flowNodeMenu.style.left = d.x - 190 + "px";
                            flowNodeMenu.style.top = d.y - 70 + document.body.scrollTop + "px";

                        });
                    }
                    for (var i = 0, j = 0; i < outDiv.length && j < oDiv.length; i++) {
                        if (outDiv[i].style.display !== "none") {
                            var value = oDiv[j++].totalout;
                            outDiv[i].value = value;
                            outDiv1[i].value = value;
                            outDiv2[i].value = value;
                            var temp = value / totalFlow;
                            if (temp < 0.05) {
                                outDiv1[i].style.width = (temp * 200 + 2) + "px";
                                outDiv[i].style.width = (temp * 200 + 2) + "px";
                                outDiv2[i].style.display = "none";
                            }
                        } else {
                            outDiv[i].value = 0;
                            outDiv1[i].value = 0;
                            outDiv2[i].value = 0;
                        }
                    }

                    for (var i = 0; i < outDiv.length; i++) {
                        outDiv[i].addEventListener("mousemove", function (d) {
                            hintDiv.style.width = "120px";
                            hintDiv.style.display = "block";
                            hintDiv.style.left = d.x - 150 + "px";
                            hintDiv.style.top = d.y - 50 + "px";
                            hintDiv.innerHTML = d.srcElement.value + "流失次数";
                            hintDiv.innerHTML += "<hr>";
                            var tmp = d.srcElement.value / totalFlow;
                            if (tmp < 0.001) {
                                hintDiv.innerHTML += "小于0.1% 的总流量";
                            } else {
                                hintDiv.innerHTML += (100 * d.srcElement.value / totalFlow).toFixed(2) + "% 的总流量";
                            }
                        });
                        outDiv[i].addEventListener("mouseout", function (d) {
                            hintDiv.style.display = "none";
                            hintDiv.innerHTML = "";
                        });

                        outDiv1[i].addEventListener("mousemove", function (d) {
                            hintDiv.style.width = "120px";
                            hintDiv.style.display = "block";
                            hintDiv.style.left = d.x - 150 + "px";
                            hintDiv.style.top = d.y - 50 + "px";
                            hintDiv.innerHTML = d.srcElement.value + "流失次数";
                            hintDiv.innerHTML += "<hr>";
                            var tmp = d.srcElement.value / totalFlow;
                            if (tmp < 0.001) {
                                hintDiv.innerHTML += "小于0.1% 的总流量";
                            } else {
                                hintDiv.innerHTML += (100 * d.srcElement.value / totalFlow).toFixed(2) + "% 的总流量";
                            }
                        });
                        outDiv1[i].addEventListener("mouseout", function (d) {
                            hintDiv.style.display = "none";
                            hintDiv.innerHTML = "";
                        });
                        outDiv2[i].addEventListener("mousemove", function (d) {
                            hintDiv.style.width = "120px";
                            hintDiv.style.display = "block";
                            hintDiv.style.left = d.x - 150 + "px";
                            hintDiv.style.top = d.y - 50 + "px";
                            hintDiv.innerHTML = d.srcElement.value + "流失次数";
                            hintDiv.innerHTML += "<hr>";
                            var tmp = d.srcElement.value / totalFlow;
                            if (tmp < 0.001) {
                                hintDiv.innerHTML += "小于0.1% 的总流量";
                            } else {
                                hintDiv.innerHTML += (100 * d.srcElement.value / totalFlow).toFixed(2) + "% 的总流量";
                            }
                        });
                        outDiv2[i].addEventListener("mouseout", function (d) {
                            hintDiv.style.display = "none";
                            hintDiv.innerHTML = "";
                        });
                    }
                    showTitle();

                    var arr = [],
                        linkArr = [];

                    /**
                     * 单击高亮流经部分,包括流失部分
                     */
                    function highlightFlow(name) {
                        "use strict";
                        arr.push(name);
                        arr = produceArr(oDiv, name);
                        linkArr = produceLinkArr(link, oDiv, name);
                        if (highlight == 1) {
                            for (var j = 0; j < oDiv.length; j++) {
                                oDiv[j].style.opacity = 1;
                            }
                            for (var ii = 0; ii < link[0].length; ii++) {
                                link[0][ii].className.baseVal = oldLink;
                                link[0][ii].className.animVal = oldLink;
                            }
                            highlight = 0;
                        } else {
                            highlight = 1;
                            for (var j = 0; j < oDiv.length; j++) {
                                oDiv[j].style.opacity = 1;
                            }
                            for (var j = 0; j < arr.length; j++) {
                                oDiv[arr[j]].style.opacity = 0.225;
                            }
                            for (var ii = 0; ii < link[0].length; ii++) {
                                link[0][ii].className.baseVal = oldLink;
                                link[0][ii].className.animVal = oldLink;
                            }
                            for (var k = 0; k < linkArr.length; k++) {
                                link[0][linkArr[k]].className.baseVal = newLink;
                                link[0][linkArr[k]].className.animVal = newLink;
                            }
                        }
                    }

                    /**
                     * 点击删除按钮能把当前层次及以后的访问删去
                     */

                    var oSpan = document.getElementsByClassName("delSpan");
                    var oFrame = document.getElementById("ID-scrollContainer");
                    var checkLevel = document.getElementsByClassName("addlevel");
                    if (checkLevel.length <= 0) {
                        var oLevel = document.createElement("div");
                        oLevel.className = "addlevel";
                    } else {
                        var oLevel = checkLevel[0];
                    }
                    maxLevel = gflow_func.level - 1;
                    oLevel.style.left = 400 + maxLevel * 324 + "px";
                    oLevel.style.top = "-450px";
                    oLevel.addEventListener("selectstart", function (d) {
                        return false;
                    });  //禁止被选中
                    oFrame.appendChild(oLevel);
                    for (var i = 0; i < oSpan.length; i++) {
                        oSpan[i].addEventListener("click", function (d) {
                                var len = 0;
                                for (var j = 0; j < oDiv.length; j++) {

                                    if (oDiv[j].level >= d.srcElement.level) {
                                        oDiv[j].parentNode.style.display = "none";
                                    }
                                }
                                for (var k = 0; k < link[0].length; k++) {
                                    if (link[0][k].__data__.target.level >= d.srcElement.level) {
                                        link[0][k].style.display = "none";
                                    }
                                }
                                for (var k = 0; k < node[0].length; k++) {
                                    if (node[0][k].__data__.level >= d.srcElement.level) {
                                        node[0][k].style.display = "none";
                                    }
                                }

                                for (var k = 0; k < oSpan.length; k++) {
                                    if (oSpan[k].level >= d.srcElement.level) {
                                        if (oSpan[k].parentNode.parentNode.style.display !== "none") {
                                            len++;
                                        }
                                        oSpan[k].parentNode.parentNode.style.display = "none";
                                    }
                                }

                                for (var k = 0; k < outDiv.length; k++) {
                                    if (outDiv[k].level >= d.srcElement.level) {
                                        outDiv[k].style.display = "none";
                                        outDiv1[k].style.display = "none";
                                        outDiv2[k].style.display = "none";
                                    }
                                }
                                oLevel.style.left = parseInt(oLevel.style.left) - 340 * len + "px";
                                oLevel.level = d.srcElement.level;
                                d.srcElement.style.display = "none";
                            }
                        )
                        ;
                    }
                    /**
                     * 点击增加显示层
                     */
                    oLevel.addEventListener("click", function (d) {
                        if (gflow_func.level > oLevel.level) {
                            /*增加节点*/
                            for (var i = 0; i < oDiv.length; i++) {
                                if (oDiv[i].level === d.srcElement.level) {
                                    oDiv[i].parentNode.style.display = "block";
                                }
                            }
                            /*移动箭头*/
                            oLevel.style.left = parseInt(oLevel.style.left) + 320 + "px";
                            /*增加link*/
                            for (var k = 0; k < link[0].length; k++) {
                                if (link[0][k].__data__.target.level === d.srcElement.level) {
                                    link[0][k].style.display = "block";
                                }
                            }
                            /*显示流失标志*/
                            for (var k = 0; k < outDiv.length; k++) {
                                if (outDiv[k].level === d.srcElement.level) {
                                    outDiv[k].style.display = "block";
                                    outDiv1[k].style.display = "block";
                                    /*再判断下需不需要显示流失箭头*/
                                    var temp = outDiv[k].value / totalFlow;
                                    if (temp >= 0.05) {
                                        outDiv2[k].style.display = "block";
                                    }
                                }
                            }
                            /*显示标题*/
                            for (var k = 0; k < oSpan.length; k++) {
                                if (oSpan[k].level === d.srcElement.level) {
                                    oSpan[k].parentNode.parentNode.style.display = "";
                                    oSpan[k].style.display = "";
                                }
                            }
                            var s = document.getElementById("ID-scrollContainer");
                            s.scrollLeft += 300;
                            oLevel.level++;
                        }
                    });
                    /**
                     * 流失部分高亮
                     */
                    for (var i = 0; i < outDiv.length; i++) {
                        outDiv2[i].addEventListener("click",function(d){
                            var elem = d.srcElement.previousSibling.previousSibling;
                            var source = [];
                            var nodeArr = [];
                            var linkArr = [];

                            source = elem.source;
                            for (var j = 0,len = oDiv.length; j < len; j++) {
                                for (var k = 0; k < source.length; k++) {
                                    if (oDiv[j].name === source[k]) {
                                        nodeArr.push(j);
                                        break;
                                    }
                                }
                            }
                            /**
                             * 接下来找出相关的link和node
                             */
                            linkArr = produceLinkArrForOut(link, node, elem);
                            nodeArr = produceArrForOut(oDiv, elem);
                            if (elem.style.opacity == 1) {
                                for (j = 0,len = oDiv.length; j < len; j++) {
                                    oDiv[j].style.opacity = 1;
                                }
                                for (j = 0,len = link[0].length; j < len; j++) {
                                    link[0][j].className.baseVal = oldLink;
                                    link[0][j].className.animVal = oldLink;
                                }
                                elem.style.opacity = 0.8;
                            }
                            else {
                                for (j = 0,len = outDiv.length; j < len; j++) {
                                    outDiv[j].style.opacity = 0.8;
                                }
                                for (j = 0,len = oDiv.length; j < len; j++) {
                                    oDiv[j].style.opacity = 1;
                                }
                                for (j = 0,len = link[0].length; j < len; j++) {
                                    link[0][j].className.baseVal = oldLink;
                                    link[0][j].className.animVal = oldLink;
                                }
                                for (j = 0, len = nodeArr.length; j < len; j++) {
                                    oDiv[nodeArr[j]].style.opacity = 0.225;
                                }
                                for (j = 0 , len = linkArr.length; j < len; j++) {
                                    link[0][linkArr[j]].className.baseVal = newLink;
                                    link[0][linkArr[j]].className.animVal = newLink;
                                }
                                elem.style.opacity = 1;
                            }
                        });
                        outDiv1[i].addEventListener("click",function(d){
                            var elem = d.srcElement.previousSibling;
                            var source = [];
                            var nodeArr = [];
                            var linkArr = [];
                            source = elem.source;
                            for (var j = 0,len = oDiv.length; j < len; j++) {
                                for (var k = 0; k < source.length; k++) {
                                    if (oDiv[j].name === source[k]) {
                                        nodeArr.push(j);
                                        break;
                                    }
                                }
                            }
                            /**
                             * 接下来找出相关的link和node
                             */
                            linkArr = produceLinkArrForOut(link, node, elem);
                            nodeArr = produceArrForOut(oDiv, elem);

                            if (elem.style.opacity == 1) {
                                for (j = 0,len = oDiv.length; j < len; j++) {
                                    oDiv[j].style.opacity = 1;
                                }
                                for (j = 0,len = link[0].length; j < len; j++) {
                                    link[0][j].className.baseVal = oldLink;
                                    link[0][j].className.animVal = oldLink;
                                }
                                elem.style.opacity = 0.8;
                            }
                            else {
                                for (j = 0,len = outDiv.length; j < len; j++) {
                                    outDiv[j].style.opacity = 0.8;
                                }
                                for (j = 0,len = oDiv.length; j < len; j++) {
                                    oDiv[j].style.opacity = 1;
                                }
                                for (j = 0,len = link[0].length; j < len; j++) {
                                    link[0][j].className.baseVal = oldLink;
                                    link[0][j].className.animVal = oldLink;
                                }
                                for (j = 0, len = nodeArr.length; j < len; j++) {
                                    oDiv[nodeArr[j]].style.opacity = 0.225;
                                }
                                for (j = 0 , len = linkArr.length; j < len; j++) {
                                    link[0][linkArr[j]].className.baseVal = newLink;
                                    link[0][linkArr[j]].className.animVal = newLink;
                                }
                                elem.style.opacity = 1;
                            }
                        });
                        //流失标志
                        outDiv[i].addEventListener("click", function (d) {
                                var source = [];
                                var nodeArr = [];
                                var linkArr = [];
                                var elem = d.srcElement;

                                source = d.srcElement.source;
                                for (var j = 0; j < oDiv.length; j++) {
                                    for (var k = 0; k < source.length; k++) {
                                        if (oDiv[j].name === source[k]) {
                                            nodeArr.push(j);
                                            break;
                                        }
                                    }
                                }
                                /**
                                 * 接下来找出相关的link和node
                                 */
                                linkArr = produceLinkArrForOut(link, node, elem);
                                nodeArr = produceArrForOut(oDiv, elem);

                                if (elem.style.opacity == 1) {
                                    for (var j = 0; j < oDiv.length; j++) {
                                        oDiv[j].style.opacity = 1;
                                    }
                                    for (var j = 0; j < link[0].length; j++) {
                                        link[0][j].className.baseVal = oldLink;
                                        link[0][j].className.animVal = oldLink;
                                    }
                                    elem.style.opacity = 0.8;
                                }
                                else {
                                    for (var j = 0; j < outDiv.length; j++) {
                                        outDiv[j].style.opacity = 0.8;
                                    }
                                    for (var j = 0; j < oDiv.length; j++) {
                                        oDiv[j].style.opacity = 1;
                                    }
                                    for (var j = 0; j < link[0].length; j++) {
                                        link[0][j].className.baseVal = oldLink;
                                        link[0][j].className.animVal = oldLink;
                                    }
                                    for (var j = 0; j < nodeArr.length; j++) {
                                        oDiv[nodeArr[j]].style.opacity = 0.225;
                                    }
                                    for (var j = 0; j < linkArr.length; j++) {
                                        link[0][linkArr[j]].className.baseVal = newLink;
                                        link[0][linkArr[j]].className.animVal = newLink;
                                    }
                                    elem.style.opacity = 1;
                                }
                            }
                        )
                        ;
                    }
                    showLinkLabel(hintDiv);
                }());
            }
        )
        ;
    }

    /**
     * link的标签显示
     */
    function showLinkLabel(hintDiv) {
        var oLink = document.getElementsByTagName("path"),
            textContent,
            textArr = [];

        for (var i = 0; i < oLink.length; i++) {
            oLink[i].addEventListener("mousemove", function (d) {
                hintDiv.style.width = "auto";
                hintDiv.style.display = "block";
                hintDiv.style.left = d.x + 10 + "px";
                hintDiv.style.top = d.y + 10 + "px";
                textContent = d.srcElement.textContent;
                textArr = textContent.split("\n");
                textContent = textArr[0];
                textContent = textContent.replace(/\|\d+/g, "");
                hintDiv.innerHTML = textContent;
                hintDiv.innerHTML += "<hr>";
                hintDiv.innerHTML += "<center>" + textArr[1] + " 访问次数" + "</center>";

            });
            oLink[i].addEventListener("mouseout", function (d) {
                hintDiv.innerHTML = "";
                hintDiv.style.display = "none";
            });
        }

    }

    /*显示标题*/
    function showTitle() {
        var oldLink = "link",
            newLink = "link2",
            oDiv = document.getElementsByClassName("VU"),
            arr1 = [],
            arr2 = [],
            len = oDiv.length;

        for (var i = 0; i < len; i++) {
            arr1[oDiv[i].level] = arr1[oDiv[i].level] ? arr1[oDiv[i].level] : 0;
            arr1[oDiv[i].level] += oDiv[i].totalin;
            arr2[oDiv[i].level] = arr2[oDiv[i].level] ? arr2[oDiv[i].level] : 0;
            arr2[oDiv[i].level] += oDiv[i].totalout;
        }
        len = arr1.length;
        gflow_func.level = len;
        for (var i = 0; i < len - 1; i++) {
            var oTh = document.createElement("th");
            var oThdiv = document.createElement("div");
            var oThdiv2 = document.createElement("div");
            var oSpan = document.createElement("span");
            oSpan.className = "delSpan";
            oSpan.level = i + 1;
            oTh.className = "gflow-th";
            oThdiv.className = "nB";
            oThdiv2.className = "ttb";
            if (i == 0) {
                oThdiv.innerHTML = "起始网页";
            }
            else if (i == 1) {
                oThdiv.innerHTML = "首次互动";
            }
            else {
                oThdiv.innerHTML = "第 " + i + " 次互动";
            }
            oThdiv2.innerHTML = "在 " + arr1[i + 1] + " 次访问中有 " + arr2[i + 1] + " 次访问者中途离开";
            var oTr = document.getElementById("gflow-tr");
            if (i != 0)
                oThdiv.appendChild(oSpan);
            oTh.appendChild(oThdiv);
            oTh.appendChild(oThdiv2);
            oTr.appendChild(oTh);
        }
    }


    /**
     *
     * @param d 当前的鼠标点击的地方
     * @returns {Array} 返回流经该处的流量经过的路径
     */

    function generateArr(d, link, node) {
        "use strict";
        var b = [];
        for (var i = 0; i < link[0].length; i++) {
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
    function generateNode(d, link, node) {
        "use strict";
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
        res = res.unique();
        var arr = [], temp = [];
        var flag = 0;
        for (var i = 0; i < node.length; i++) {
            for (var j = 0; j < res.length; j++) {
                if (res[j] === node[i].name) {
                    temp.push(res[j]);
                }
            }
        }
        for (var i = 0; i < node.length; i++) {
            for (var j = 0; j < temp.length; j++) {
                if (temp[j] === node[i].name) {
                    flag = 1;
                }
            }
            if (flag === 0)
                arr.push(i);
            flag = 0;
        }

        return  arr;
    }

    /**
     * 点击link高亮函数
     */
    function highLightFromLink(link, node) {
        "use strict";
        var a = [];     //需要高亮的路径,存放数组
        var b = [];
        var point = 0;  //点击某个point之后动态生成a数组
        var oldLink = "link";
        var newLink = "link2";

        for (var i = 0; i < link[0].length; i++) {
            var k = 0;
            link[0][i].addEventListener("click", function (d) {   /*现在存在问题是点击之后返回当前点击的是哪个link*/
                a = generateArr(d, link, node);
                /*点击之后动态生成*/
                b = generateNode(d, link, node);

                if (d.srcElement.className.animVal !== oldLink) { /*如果等于原来的类型*/
                    for (var ii = 0; ii < link[0].length; ii++) {
                        link[0][ii].className.baseVal = oldLink;
                        link[0][ii].className.animVal = oldLink;
                    }
                    for (var ii = 0; ii < node.length; ii++) {
                        node[ii].style.opacity = 1;
                    }


                } else {

                    for (var ii = 0; ii < link[0].length; ii++) {
                        link[0][ii].className.baseVal = oldLink;
                        link[0][ii].className.animVal = oldLink;
                    }
                    for (var ii = 0; ii < node.length; ii++) {
                        node[ii].style.opacity = 1;
                    }

                    for (k = 0; k < a.length; k++) {
                        link[0][a[k]].className.baseVal = newLink;
                        link[0][a[k]].className.animVal = newLink;
                    }
                    for (var r = 0; r < b.length; r++) {
                        node[b[r]].style.opacity = 0.225
                    }
                }
            });
        }
    }


    /**
     *
     * @param oDiv
     * @param d
     * @returns {Array} 返回需要改变属性的节点.
     */
    function produceArr(oDiv, __name) {
        "use strict";
        var arr = [];
        var name = [];
        var temp = [];
        var b = [];

        for (var i = 0; i < oDiv.length; i++) {
            if (__name === oDiv[i].name) {
                name.push(oDiv[i].name);
                temp.push(oDiv[i].name);
                arr.push(i);
                b.push(i);
            }
        }
        /*找到source即流向的节点*/
        for (var k = 0; k < name.length; k++) {
            for (var i = 0; i < oDiv.length; i++) {
                for (var j = 0; j < oDiv[i].source.length; j++) {
                    if (name[k] === oDiv[i].source[j]) {
                        arr.push(i);
                        name.push(oDiv[i].name);
                        name = name.unique();
                        arr = arr.unique();
                    }
                }
            }
        }

        /*找到source即流向的节点*/
        for (var count = 0; count < 10; count++) {
            for (var k = 0; k < temp.length; k++) {
                for (var i = 0; i < oDiv.length; i++) {
                    for (var j = 0; j < oDiv[i].target.length; j++) {
                        if (temp[k] === oDiv[i].target[j]) {
                            b.push(i);
                            temp.push(oDiv[i].name);
                            temp = temp.unique();
                            b = b.unique();
                        }
                    }
                }
            }
        }

        arr = arr.concat(b);

        var res = [];
        var flag = 0;
        for (var i = 0; i < oDiv.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j] === i) {
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                res.push(i);
            }
            flag = 0;
        }
        return res;
    }

    /**
     *
     * @param oDiv
     * @param d
     * @returns {Array} 返回需要改变属性的节点.
     */
    function produceArrForOut(oDiv, d) {
        "use strict";
        var arr = [];
        var name = [];
        var temp = [];
        var b = [];

        for (var i = 0; i < oDiv.length; i++) {
            if (d.name === oDiv[i].name) {
                name.push(oDiv[i].name);
                temp.push(oDiv[i].name);
                arr.push(i);
                b.push(i);
            }
        }
        for (var k = 0; k < temp.length; k++) {
            for (var i = 0; i < oDiv.length; i++) {
                for (var j = 0; j < oDiv[i].target.length; j++) {
                    if (temp[k] === oDiv[i].target[j]) {
                        b.push(i);
                        temp.push(oDiv[i].name);
                        temp = temp.unique();
                        b = b.unique();
                    }
                }
            }
        }

        arr = arr.concat(b);

        var res = [];
        var flag = 0;
        for (var i = 0; i < oDiv.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j] === i) {
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                res.push(i);
            }
            flag = 0;
        }
        return res;
    }

    /**
     *
     * @param d
     * @returns {Array}
     * 根据点击的节点m返回需要高亮的link，和generateArr基本相同,后面可以合成一个函数.
     *
     */
    function produceLinkArr(link, node, __name) {
        "use strict";
        var b = [];
        /*先找去路的*/
        for (var i = 0; i < link[0].length; i++) {
            if (link[0][i].__data__.source.name === __name) b.push(i);
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
            if (link[0][i].__data__.target.name === __name) {
                a.push(i);
            }
        }
        for (var j = 0; j < a.length; j++) {
            for (var i = 0; i < link[0].length; i++) {
                if (link[0][a[j]].__data__.source.name === link[0][i].__data__.target.name) a.push(i);
            }
        }
        a = a.concat(b);
        a = a.unique();
        return a;
    }

    /**
     *
     * @param d
     * @returns {Array}
     * 根据点击的节点m返回需要高亮的link，和generateArr基本相同,后面可以合成一个函数.
     *
     */
    function produceLinkArrForOut(link, node, d) {
        "use strict";
        var a = [];
        for (var i = 0; i < link[0].length; i++) {
            if (link[0][i].__data__.target.name === d.name) {
                a.push(i);
            }
        }
        for (var j = 0; j < a.length; j++) {
            for (var i = 0; i < link[0].length; i++) {
                if (link[0][a[j]].__data__.source.name === link[0][i].__data__.target.name) a.push(i);
            }
        }
        a = a.unique();
        return a;
    }

    Array.prototype.unique = function () {
        var results = this.sort();
        for (var i = 1; i < results.length; i++) {
            if (results[i] === results[i - 1]) {
                results.splice(i--, 1);
            }
        }
        return results;
    }
    return gflow_func;
}();