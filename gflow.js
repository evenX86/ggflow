// JavaScript Document
var margin = {top: 1, right: 1, bottom: 6, left: 1},
    width = 4300 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " 访问次数"; },
    format_for_node = function(d) { return formatNumber(d) + " 浏览流量"; },
    color = d3.scale.category20();  /*颜色是随机变化的*/

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

var oldClass = "link";  //原来的class,点击之后变为新的class
var newClass = "link2";



d3.json("data.json", function(energy) {

    sankey
        .nodes(energy.nodes)
        .links(energy.links)
        .layout(0);         //layout里的参数表示什么意思啊

    var link = svg.append("g").selectAll(".link")
            .data(energy.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("style","display:block")
            .attr("d", path)
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; })
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
        console.log(d);
        var b = [];
        //console.log(d.srcElement.__data__);
        for (var i = 0; i<link[0].length;i++) {
            //  console.log(link[0][i].__data__.source.name);
            //  console.log(d.srcElement.__data__.target.name);
            /*寻找源是目标,即找出下一条高亮路劲,不过现在只能找出一条*/
            if (link[0][i].__data__.source.name===d.srcElement.__data__.target.name)
                b.push(i);
        }
        /*把去路上的全部高亮了*/
        for (var j =0 ;j < b.length; j++ ) {
            for (var i =0 ;i<link[0].length;i++) {
                if (link[0][b[j]].__data__.target.name===link[0][i].__data__.source.name)    b.push(i);
            }
        }

        for (var i = 0; i<link[0].length;i++) {
            /*把当前的也加入*/
            if (link[0][i].__data__.target.name===d.srcElement.__data__.target.name && link[0][i].__data__.source.name===d.srcElement.__data__.source.name)
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
        for (var j=0; j< a.length; j++) {
            for (var i=0; i<link[0].length;i++) {
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
     */
    function generateNode(d) {
        console.log(d);
        var res = [];
        var b = [];
        for (var i = 0; i<link[0].length;i++) {
            /*寻找源是目标,即找出下一条高亮路劲,不过现在只能找出一条*/
            if (link[0][i].__data__.source.name===d.srcElement.__data__.target.name)
                b.push(i);
        }
        /*把去路上的全部高亮了*/
        for (var j =0 ;j < b.length; j++ ) {
            for (var i =0 ;i<link[0].length;i++) {
                if (link[0][b[j]].__data__.target.name===link[0][i].__data__.source.name)   {
                    res.push(link[0][i].__data__.source.name);
                    b.push(i);
                }
            }
        }

        for (var i = 0; i<link[0].length;i++) {
            /*把当前的也加入*/
            if (link[0][i].__data__.target.name===d.srcElement.__data__.target.name && link[0][i].__data__.source.name ===
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

            }
        }
        for (var j=0; j< a.length; j++) {
            for (var i=0; i<link[0].length;i++) {
                if (link[0][a[j]].__data__.source.name === link[0][i].__data__.target.name) {
                    a.push(i);
                    res.push(link[0][a[j]].__data__.source.name);
                }
            }
        }
        a = a.concat(b);
        return  res;


    }




    /*显示路径的说明*/
    link.append("title")
        .text(function(d) { return d.source.name + " 到 " + d.target.name + "\n" + format(d.value); });
    /*link加个div标签*/
    link.append("div")
        .style(function() {return "background:red"})
        .text("rrr");

    var node = svg.append("g").selectAll(".node")
        .data(energy.nodes)
        .enter().append("g")
        .attr("class", "node1")
        .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"; })
        .call(d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", function() { this.parentNode.appendChild(this); }));
    //.on("drag", dragmove)) 设置不能拖动.不然太乱了

    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())

        //          .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
        .append("title")
        .text(function(d) { return d.name + "\n" + format_for_node(d.value); })
    ;


    node.append("text")
        .attr("y", function(d) { return d.dy/12; })
        .attr("dy", ".5em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < width / 2; })
        .attr("x",  sankey.nodeWidth()/10)  //删掉了上面对x属性赋值的操作,没啥用~主要是为了改变附加的说明,这个到后面换成标签
        .attr("text-anchor", "start");




    function dragmove(d) {
        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        link.attr("d", path);
    }
    //   console.log(link[0][0].__data__.source.sourceLinks);
    var a = [];     //需要高亮的路径,存放数组
    var b = [];
    var point = 0;  //点击某个point之后动态生成a数组

    for (var i = 0; i < link[0].length; i++ ) {
        var k=0;
        link[0][i].addEventListener("click", function (d){   /*现在存在问题是点击之后返回当前点击的是哪个link*/
            a = generateArr(d);      /*点击之后动态生成*/
            b = generateNode(d);
            b = b.unique();
            console.log(b);
            if (link[0][a[0]].className.animVal===oldClass) {
                for (var ii=0; ii<link[0].length; ii++) {
                    link[0][ii].className.baseVal=oldClass;
                    link[0][ii].className.animVal=oldClass;
                }
                for (k = 0;k< a.length;k++) {
                    link[0][a[k]].className.baseVal=newClass;
                    link[0][a[k]].className.animVal=newClass;
                }
            }
            else {
                for (k = 0;k< a.length;k++) {
                    link[0][a[k]].className.baseVal=oldClass;
                    link[0][a[k]].className.animVal=oldClass;
                }
            }
        });
    }

    //  for (var i=0; i<node[0].length;i++) {
    var a = [];
    node[0][0].addEventListener("click",function (d) {
        console.log(d);
        a = generateNode(d);
        if (node[0][0].className.animVal==="node1") {
            node[0][0].className.animVal = "node2";
            node[0][0].className.baseVal = "node2";
        }
        else {
            node[0][0].className.animVal = "node1";
            node[0][0].className.baseVal = "node1";
        }
    });
    //     }

});

