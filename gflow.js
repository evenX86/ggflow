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
            return dy + 6;
        })
        .attr("y2", function (d) {
            return d.dy - 6;
        })
        .attr("stroke", "red")
        .attr("stroke-width", "15")
        .attr("stroke-linecap", "square")
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
        });
    /**
     * 增加节点的说明标签
     * @type {Array}
     */
    highLightFromLink(link, node);
    highLightFromNode(link, node);
});

