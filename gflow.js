// JavaScript Document
var margin = {top: 1, right: 1, bottom: 6, left: 1},
    width = 4300 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
    format = function (d) {
        return formatNumber(d) ;
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
var firstNode = "node0";
/*第一个node单独标记*/


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
    /*显示路径的说明*/
    link.append("title")
        .text(function (d) {
            return d.source.name + " 到 " + d.target.name + "\n" + format(d.value);
        });

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
    /*
    node.append("line")
        .attr("x1", "188")
        .attr("x2", "188")
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
            return dy + 6;
        })
        .attr("y2", function (d) {
            return d.dy - 6;
        })
        .attr("stroke", "red")
        .attr("stroke-width", "15")
        .attr("stroke-linecap", "round")
        .attr("style", "line")
        .attr("display", function (d) {
            var dy = 0;
            for (var i = 0; i < d.sourceLinks.length; i++) {
                dy += d.sourceLinks[i].dy;
            }
            if (d.dy - dy < 0.001) return "none";
        })

        .append("title")
        .text(function (d) {
            var source = d.value;
            var target = 0;
            for (var i = 0; i < d.sourceLinks.length; i++) {
                target += d.sourceLinks[i].value;
            }

            return source-target + "次流失次数";
        })
    ;
*/
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
        .style("stroke","red")
        .append("foreignobject")
        .append("xhtml:h1")
        .text(function (d) {
            return d.name + "\n" + format_for_node(d.value);
        })
    ;
    /*
    node.append("text")
        .attr("y", function (d) {
            return d.dy / 12;
        })
        .attr("dy", ".5em")
        .attr("text-anchor", "end")
        .text(function (d) {
            return d.name;
        })
        .filter(function (d) {
            return d.x < width / 2;
        })
        .attr("x", sankey.nodeWidth() / 10)  //删掉了上面对x属性赋值的操作,没啥用~主要是为了改变附加的说明,这个到后面换成标签
        .attr("text-anchor", "start");

*/
    /**
     * 增加节点的说明标签
     * @type {Array}
     */
    highLightFromLink(link, node);
    highLightFromNode(link, node);

    var x, y,dx,dy;
    function mousePos(ev){
            // 定义鼠标在视窗中的位置
            var point = {
                x:0,
                y:0
            };

            // 如果浏览器支持 pageYOffset, 通过 pageXOffset 和 pageYOffset 获取页面和视窗之间的距离
            if(typeof window.pageYOffset != 'undefined') {
                point.x = window.pageXOffset;
                point.y = window.pageYOffset;
            }
            // 如果浏览器支持 compatMode, 并且指定了 DOCTYPE, 通过 documentElement 获取滚动距离作为页面和视窗间的距离
            // IE 中, 当页面指定 DOCTYPE, compatMode 的值是 CSS1Compat, 否则 compatMode 的值是 BackCompat
            else if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
                point.x = document.documentElement.scrollLeft;
                point.y = document.documentElement.scrollTop;
            }
            // 如果浏览器支持 document.body, 可以通过 document.body 来获取滚动高度
            else if(typeof document.body != 'undefined') {
                point.x = document.body.scrollLeft;
                point.y = document.body.scrollTop;
            }

            // 加上鼠标在视窗中的位置
            point.x += ev.clientX;
            point.y += ev.clientY;

            // 返回鼠标在视窗中的位置
            return point;

    }

    /**
     * 在每个node上面增加一层div
     */
    node[0].forEach(function (value) {
        var sum = 0,sumDy=0;
        var flag =1;
        for (var i = 0;i<value.__data__.sourceLinks.length;i++) {
            sum += value.__data__.sourceLinks[i].value;
            sumDy += value.__data__.sourceLinks[i].dy;
        }
        if (value.__data__.targetLinks.length<=0) flag=0;

        x = value.__data__.x;
        y = value.__data__.y;
        dy = value.__data__.dy;
        dx = value.__data__.dx;

        var frameDiv = document.createElement("div");   //外面一层大的div层
        var newDiv = document.createElement("div");     //里面展示的div层
        var frameOut = document.createElement("div");    //流失部分外层框架div
        var out = document.createElement("div");        //流失部分
        var out1 = document.createElement("div");       //流失部分2
        var out2 = document.createElement("div");       //流失部分箭头
        var iconDiv = document.createElement("div");    //节点图标
        var readDiv = document.createElement("div");    //节点文字说明
        var valueSpan = document.createElement("span");


        frameDiv.className = "Ukb";
        newDiv.className = "VU";
        readDiv.className = "QNb";
        valueSpan.className = "WS";

        out.className = "out";
        out1.className = "out1";
        out2.className = "out2";
        if (flag==0) {
            iconDiv.className = "z6";
            newDiv.className = "VUH";
        } else {
            iconDiv.className = "IU";
        }

        frameDiv.style.width = dx+4+"px";
        newDiv.style.width = dx+2+"px";
        frameDiv.style.height = dy+4+"px";
        newDiv.style.height = dy+2+"px";
        frameDiv.style.top = y+"px";
        frameDiv.style.left = x+"px";

        iconDiv.style.left = 2+"px";
        iconDiv.style.top = 2+"px";

        out2.innerHTML ="⇩";
        readDiv.innerHTML = value.__data__.name;
        readDiv.innerHTML += "<br>";
        readDiv.innerHTML +=  value.__data__.value;
        readDiv.innerHTML +=  "<div style='display:none'>"+sum+"</div>";

        if (sum == value.__data__.value) {
            out.style.display = "none";
            out1.style.display = "none";
            out2.style.display = "none";
        }

        out.style.top = y+sumDy+"px";
        out.style.height = dy-sumDy+"px";
        out.style.left = x+dx+"px";

        out1.style.top = y+dy+"px";
        out1.style.left = x+dx+"px";

        out2.style.top = sumDy+y+(dy-sumDy)/2+"px";
        out2.style.left = x+dx+"px";

        var pre = document.getElementById("sdflow");

        pre.appendChild(frameDiv);    //在node 上覆盖一层div
        frameDiv.appendChild(newDiv);
        frameDiv.appendChild(iconDiv);
        frameDiv.appendChild(readDiv);

        pre.appendChild(out);       //流失标志主div
        pre.appendChild(out1);      //流失标志渐变部分div
        pre.appendChild(out2);      //流失标志箭头标志部分div

    });
    var oDiv = document.getElementsByClassName("VU");
    var hintDiv = document.getElementById("ID-hint");
    var hintNameDiv = document.createElement("div");

    for (var i=0;i<oDiv.length;i++){
       // hintNameDiv.innerHTML =
        oDiv[i].onmousemove = function (d) {
            hintDiv.style.display = "block";
            hintDiv.style.left = d.x-270+"px";
            hintDiv.style.top = d.y-80+"px";
            hintDiv.innerHTML = d.srcElement.offsetParent.innerText;
            var text = d.srcElement.offsetParent.innerText;
            var sum = d.srcElement.offsetParent.childNodes[2].childNodes[3].innerText;

            var textArr = text.split("\n");
            hintDiv.innerHTML = textArr[0];
            var total =  parseInt(textArr[1]);
            var out = parseInt(textArr[1]) - sum;
            hintDiv.innerHTML +="<hr>" ;
            hintDiv.innerHTML += sum + "    浏览流量("+(100*sum/total).toFixed(2)+"%)";
            hintDiv.innerHTML += "<br>";
            hintDiv.innerHTML += out + "    流失率("+((100*out)/total).toFixed(2)+"%)";
        }
        oDiv[i].onmouseout = function (d) {
            hintDiv.style.display = "none";
        }
    }
});

