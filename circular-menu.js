//circular-menu
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.CMenu = factory());
}(this, function () { 'use strict';

    function rotateDeg (i){
        return this.startDeg + this.rotateUnit * i;
    }

    function rotateDeg$1 (i){
        return - (this.rotateDeg(i) + this.unskewDeg);
    }

    function startDeg(config) {
        var top = -(config.totalAngle - 180) / 2,
            positions = {
                top: top,
                left: top - 90,
                right: top + 90,
                bottom: top + 180
            };

        return config.start !== undefined ? config.start : positions[config.position];
    }

    function coverSize (config) {
        var radius = config.diameter / 2 + 4,
            square = radius * radius * 2;
        var l = Math.sqrt(square) * config.percent * 2;
        var m = -l / 2;

        l += "px";
        m += "px";
        
        return {
            width:  l,
            height: l,
            marginLeft: m,
            marginTop: m
        };
    }

    function menuSize (config) {
        var l = config.diameter;
        var m = - config.diameter / 2;

        l += "px";
        m += "px";

        return {
            width:  l,
            height: l,
            marginLeft: m,
            marginTop: m
        };
    }

    function clickZoneSize (config) {
        var l = config.diameter;
        var m = - config.diameter / 2;

        l += "px";
        m += "px";

        return {
            width:  l,
            height: l,
            marginRight: m,
            marginBottom: m
        };
    }

    function listSize (config) {
        var l = (config.diameter / 2) + 'px';

        return {
            width:  l,
            height: l
        };
    }

    function textTop (config) {
        var radius = config.diameter / 2 + 4,
            square = radius * radius * 2;
        var coverRadius = Math.sqrt(square) * config.percent;
        
        return (radius - coverRadius) * 0.38 + 'px';
    }

    function Calculation(config) {
        this._config = config;

        var c = this.config = config,
            itemsNum = c.menus.length,
            spaceNumber = c.totalAngle === 360 ? itemsNum : itemsNum - 1;
        // $background: #52be7f;
        // $percent: 0.32;
        // $items : 7;// item number;
        // $total-angle: 360deg; //sum angle of all items, < 360 semi-circle, = 360 complete-circle
        // $space: 0deg; // space between items
        // $diameter: 400px;//complete circle radius
        // $space-number: if($total-angle == 360deg, $items, $items - 1);
        // $central-angle: ($total-angle - ($space * $space-number )) / $items;// - ($space * ($items - 1) ) //central angle of each item, it must < 90 deg
        // $rotate: $central-angle + $space;
        // $skew: 90deg - $central-angle;
        //
        // $unskew: - (90deg - $central-angle / 2);
        // $top: - ( ($total-angle - 180deg) / 2); // - ( ($total-angle + ($items - 1) * $space - 180deg) / 2);
        // $left: $top - 90deg;
        // $right: $top + 90deg;
        // $bottom: $top + 180deg;
        // $start: $top;
        // $text-top: $diameter / 2 * $percent / 2 + 5px;
        // $time: 0.3s;


        this.listSize = listSize(config);
        this.clickZoneSize = clickZoneSize(config);
        this.menuSize = menuSize(config);
        this.coverSize = coverSize(config);
        this.startDeg = startDeg(config);
        this.centralDeg = (c.totalAngle - (c.spaceDeg * spaceNumber)) / itemsNum;
        this.rotateUnit = this.centralDeg + c.spaceDeg;
        this.skewDeg = 90 - this.centralDeg;
        this.unskewDeg = - (90 - this.centralDeg / 2);
        this.textTop = textTop(config);
    }

    Calculation.prototype = {
        constructor: Calculation,
        rotateDeg: rotateDeg,
        horizontalDeg: rotateDeg$1
    };

    function createLists (parent) {
        
        this._config.menus.forEach(function(v, k){

            this._createList(parent, v, k);
            
        }, this);

    }

    function defaultView(node) {
        return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
            || (node.document && node) // node is a Window
            || node.defaultView; // node is a Document
    }

    function styleRemove(name) {
        this.style.removeProperty(name);
    }

    function styleConstant(name, value, priority) {
        this.style.setProperty(name, value, priority);
    }

    function styleFunction(name, value, priority) {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
    }

    function style(ele, name, value, priority) {

        var node;
        return arguments.length > 1
            ? ((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant).call(ele, name, value, priority == null ? "" : priority))
            : defaultView(node = ele)
            .getComputedStyle(node, null)
            .getPropertyValue(name);
    }

    function createList(parent, data, index){

        var list = document.createElement('li');
        style(list, 'width', this._calc.listSize.width);
        style(list, 'height', this._calc.listSize.height);
        style(list, 'transform', 'rotate('+ this._calc.rotateDeg(index) +'deg) skew('+ this._calc.skewDeg +'deg)');

        parent.appendChild(list);

        this._createClickZone(list, data, index);

    }

    function classArray(string) {
        return string.trim().split(/^|\s+/);
    }

    function classList(node) {
        return node.classList || new ClassList(node);
    }

    function ClassList(node) {
        this._node = node;
        this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
        add: function(name) {
            var i = this._names.indexOf(name);
            if (i < 0) {
                this._names.push(name);
                this._node.setAttribute("class", this._names.join(" "));
            }
        },
        remove: function(name) {
            var i = this._names.indexOf(name);
            if (i >= 0) {
                this._names.splice(i, 1);
                this._node.setAttribute("class", this._names.join(" "));
            }
        },
        contains: function(name) {
            return this._names.indexOf(name) >= 0;
        }
    };

    function classedAdd(node, names) {
        var list = classList(node), i = -1, n = names.length;
        while (++i < n) list.add(names[i]);
    }

    function classedRemove(node, names) {
        var list = classList(node), i = -1, n = names.length;
        while (++i < n) list.remove(names[i]);
    }

    function classedTrue(names) {
        classedAdd(this, names);
    }

    function classedFalse(names) {
        classedRemove(this, names);
    }

    function classedFunction(names, value) {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    }

    function classed(ele, name, value) {
        var names = classArray(name + "");

        if (arguments.length < 2) {
            var list = classList(this), i = -1, n = names.length;
            while (++i < n) if (!list.contains(names[i])) return false;
            return true;
        }

        var callee = (typeof value === "function"
            ? classedFunction : value
            ? classedTrue
            : classedFalse).call(ele, names, value);
    }

    var UID = {
        _current: 0,
        getNew: function(){
            this._current++;
            return this._current;
        }
    };
    function pseudoStyle (element, pseudo, prop, value) {
        
        var _this = element;
        var _sheetId = "pseudoStyles";
        var _head = document.head || document.getElementsByTagName('head')[0];
        var _sheet = document.getElementById(_sheetId) || document.createElement('style');
        _sheet.id = _sheetId;
        var className = "pseudoStyle" + UID.getNew();
        
        _this.className += " " + className;
        
        _sheet.innerHTML += " ." + className + ":" + pseudo + "{" + prop + ":" + value + "}";
        _head.appendChild(_sheet);
        return this;
    };

    function createMenu(){
        var p = this._parent;

        classed(p, 'cn-wrapper opened-nav', true);
        style(p, 'width', this._calc.menuSize.width);
        style(p, 'height', this._calc.menuSize.height);
        style(p, 'margin-top', this._calc.menuSize.marginTop);
        style(p, 'margin-left', this._calc.menuSize.marginLeft);

        pseudoStyle(p, 'after', 'width', this._calc.coverSize.width);
        pseudoStyle(p, 'after', 'height', this._calc.coverSize.height);
        pseudoStyle(p, 'after', 'margin-left', this._calc.coverSize.marginLeft);
        pseudoStyle(p, 'after', 'margin-top', this._calc.coverSize.marginTop);

        var ul = p.appendChild(document.createElement('ul'));
        this._createLists(ul);
    }

    function createClickZone (parent, data, index) {
        var a = document.createElement('a');
        a.href = data.href;

        style(a, 'width', this._calc.clickZoneSize.width);
        style(a, 'height', this._calc.clickZoneSize.height);
        style(a, 'right', this._calc.clickZoneSize.marginRight);
        style(a, 'bottom', this._calc.clickZoneSize.marginBottom);
        style(a, 'transform', 'skew('+ -this._calc.skewDeg +'deg) rotate('+ this._calc.unskewDeg +'deg) scale(1)');

        parent.appendChild(a);

        this._createHorizontal(a, data, index);
    }

    function createText (parent, data, index) {

        var span = document.createElement('span');
        span.textContent = data.title;

        style(span, 'margin-top', this._calc.textTop);

        parent.appendChild(span);
    }

    function createHorizontal (parent, data, index) {

        var div = document.createElement('div');
        style(div, 'transform', 'rotate('+ this._calc.horizontalDeg(index) +'deg)');

        parent.appendChild(div);

        this._createText(div, data, index);
    }

    function Creator(parent, config){
        this._parent = parent;
        this._config = config;
        this._calc = new Calculation(config);
    }

    Creator.prototype = {
        constructor: Creator,
        createMenu: createMenu,
        _createLists: createLists,
        _createList: createList,
        _createClickZone: createClickZone,
        _createText: createText,
        _createHorizontal: createHorizontal
    };

    function config (config) {
        this._config = config;

        var _creator =  new Creator(this._element, config);
        _creator.createMenu();

        return this;
    }

    function CMenu(element){
        this._element = element;
    }

    CMenu.prototype = {
        constructor: CMenu,
        config: config

    };

    function index (selector) {
        return typeof selector === "string"
            ? new CMenu(document.querySelector(selector))
            : new CMenu(selector);
    }

    return index;

}));
//# sourceMappingURL=circular-menu.js.map
