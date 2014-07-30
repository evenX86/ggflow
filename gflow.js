/**
 * 全局变量区域
 * @type {Function}
 */
var gflow = function () {
    "use strict";
    var gflow = {
        version: "0.0.1",
        len: 0
    };
    var s = document.getElementById("ID-scrollContainer");
    var str = "<div id=\"ID-flowHeader\"><div class=\"Dvb\"><table class=\"ID-flowHeaderElement qo\"style=\"margin-left:100px;width:auto\"><tbody><tr id=\"gflow-tr\"><th width=\"300\"><div class=\"ID-dimension ACTION-showDimensionPicker TARGET- yd tg Br\">所有数据</div><div class=\"ID-dimension-details ACTION-showDimensionDetails TARGET- uB\"><div class=\"XO\"></div></div></th></tr></tbody></table></div></div><div id=\"sdflow\" class=\"ID-svcGraph D0\" onselectstart='return false'><p id=\"gflowchart\"></div>";
    $("#ID-scrollContainer").html(str);
    var width = 12500,
        height = 500;
    /**
     * init初始的的流图
     */
    gflow_func.draw(width, height);
    /***
     * 这里是移动的div操作
     * @type {HTMLElement}
     *
     */


    var flag = false,
        left = s.scrollLeft,
        pageX;
    s.addEventListener("mousedown", function (d) {
        flag = true;
        pageX = d.pageX;
    });
    s.addEventListener("mouseup", function (d) {
        flag = false;
    });
    s.addEventListener("mousemove", function (d) {
        if (!flag) return;
        var x = d.pageX - pageX;
        s.scrollLeft -= x / 10;
    });


    /**
     * 这里是导航仪重画操作
     * @type {*}
     */
    var up = document.getElementsByClassName("TARGET-up")[0],
        left = document.getElementsByClassName("TARGET-left")[0],
        right = document.getElementsByClassName("TARGET-right")[0],
        down = document.getElementsByClassName("TARGET-down")[0],
        home = document.getElementsByClassName("TARGET")[0],
        os = document.getElementById("sdflow"),
        oDvb = document.getElementsByClassName("ID-flowHeaderElement")[0],
        cursor = document.getElementsByClassName("slider-thumb")[0];

    right.addEventListener("click", function (d) {
        s.scrollLeft += 50;
    });
    left.addEventListener("click", function (d) {
        s.scrollLeft -= 50;
    });
    home.addEventListener("click", function (d) {
        console.log(gflow_func);
        s.scrollLeft = 0;
    });

    /**
     * 放大图表
     */
    up.addEventListener("click", function (d) {
        var top = parseInt(cursor.style.top);
        if (top > 0 && top <= 110) {
            oDvb.innerHTML = "<tbody> <tr id=\"gflow-tr\"> <th width=\"300\"> <div class=\"ID-dimension ACTION-showDimensionPicker TARGET- yd tg Br\">" +
                "所有数据</div><div class=\"ID-dimension-details ACTION-showDimensionDetails TARGET- uB\"> <div class=\"XO\"></div></div></th></tr></tbody>";
            os.innerHTML = "";
            var op = document.createElement("p");
            os.appendChild(op);
            op.id = "gflowchart";

            height = height + 100;
            gflow_func.draw(width, height);
            var top = parseInt(cursor.style.top);
            cursor.style.top = parseInt(cursor.style.top) - 10 + "px";
        }
    });

    down.addEventListener("click", function (d) {
        var top = parseInt(cursor.style.top);
        if (top >= 0 && top < 110) {
            oDvb.innerHTML = "<tbody> <tr id=\"gflow-tr\"> <th width=\"300\"> <div class=\"ID-dimension ACTION-showDimensionPicker TARGET- yd tg Br\">" +
                "所有数据</div><div class=\"ID-dimension-details ACTION-showDimensionDetails TARGET- uB\"> <div class=\"XO\"></div></div></th></tr></tbody>";
            os.innerHTML = "";
            var op = document.createElement("p");
            os.appendChild(op);
            op.id = "gflowchart";
            height = height - 100;
            gflow_func.draw(width, height);
            var top = parseInt(cursor.style.top);
            cursor.style.top = parseInt(cursor.style.top) + 10 + "px";
        }
    });
};
