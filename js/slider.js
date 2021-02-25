(function ($) {
    var View = /** @class */ (function () {
        function View(slider) {
            this.elements = {};
            this.subLayers = {};
            this.el = this.elements.parent = slider;
            this.bilder = new SliderBilder(this.elements);
        }
        View.prototype.create = function () {
            var bilder = this.bilder;
            this.elements.scale = bilder.createScale();
            this.subLayers.scale = new SubView(this.elements.scale);
            this.elements.thumb = bilder.createThumb();
            this.subLayers.thumb = new SubView(this.elements.thumb);
            this.elements.thumbOutput = bilder.createThumbOutput();
            this.subLayers.thumbOutput = new SubView(this.elements.thumbOutput);
        };
        return View;
    }());
    var SubView = /** @class */ (function () {
        function SubView(el) {
            this.el = el;
        }
        return SubView;
    }());
    var SliderBilder = /** @class */ (function () {
        function SliderBilder(elements) {
            this.elements = elements;
        }
        SliderBilder.prototype.createScale = function (className) {
            if (className === void 0) { className = 'scale'; }
            var scale = $('<div>', { 'class': className }), slider = this.elements.parent;
            slider.append(scale);
            return scale;
        };
        SliderBilder.prototype.createThumb = function (className) {
            if (className === void 0) { className = 'thumb'; }
            var thumb = $('<div>', { 'class': className }), scale = this.elements.scale;
            scale.append(thumb);
            return thumb;
        };
        SliderBilder.prototype.createThumbOutput = function (className) {
            if (className === void 0) { className = 'thumb-output'; }
            var thumbOut = $('<div>', { 'class': className }), scale = this.elements.scale;
            scale.append(thumbOut);
            return thumbOut;
        };
        return SliderBilder;
    }());
    var Model = /** @class */ (function () {
        function Model() {
            this.curValue = '';
        }
        Model.prototype.init = function (type) {
            if (type === void 0) { type = 'default'; }
            console.log(type);
        };
        Model.prototype.calculateCurValue = function (thumbPosition) {
            //this.view.update();
        };
        return Model;
    }());
    var Controller = /** @class */ (function () {
        function Controller(view, model) {
            this.view = view;
            this.model = model;
        }
        Controller.prototype.init = function () {
            this.view.create();
            this.elements = this.view.elements;
            this.handlers = new Handlers(this.elements);
            this.thumbMovingHandler = this.handlers.moveHorizontal;
            this.calcScaleWidth;
            this.bindEvents();
        };
        Controller.prototype.calcScaleWidth = function () {
            //return true;
        };
        Controller.prototype.bindEvents = function () {
            this.elements.thumb.on('mousedown', this.thumbMovingHandler);
        };
        return Controller;
    }());
    var Handlers = /** @class */ (function () {
        function Handlers(elements) {
            var _this = this;
            this.moveHorizontal = function (event) {
                event.preventDefault();
                var elements = _this.elements;
                var thumbLeft = elements.thumb.offset().left;
                _this.shiftX = event.clientX - thumbLeft;
                document.addEventListener('mousemove', _this.onMouseMoveHorisontal);
                document.addEventListener('mouseup', _this.onMouseUpHorisontal);
            };
            this.onMouseMoveHorisontal = function (event) {
                var elements = _this.elements;
                var sliderLeft = elements.scale.offset().left, shiftX = _this.shiftX;
                var newLeft = event.clientX - shiftX - sliderLeft;
                if (newLeft < _this.edges.left) {
                    newLeft = _this.edges.left;
                }
                if (newLeft > _this.edges.right) {
                    newLeft = _this.edges.right;
                }
                elements.thumb.css('left', newLeft + 'px');
                elements.thumbOutput.css('left', newLeft + 'px');
            };
            this.onMouseUpHorisontal = function () {
                document.removeEventListener('mouseup', _this.onMouseUpHorisontal);
                document.removeEventListener('mousemove', _this.onMouseMoveHorisontal);
            };
            this.elements = elements;
            this.edges = {
                right: elements.scale.outerWidth() - elements.thumb.outerWidth(),
                left: 0
            };
        }
        return Handlers;
    }());
    var SliderMVC = /** @class */ (function () {
        function SliderMVC(sliderID) {
            this.View = new View($('#' + sliderID));
            this.Model = new Model();
            this.Controller = new Controller(this.View, this.Model);
            this.Controller.init();
        }
        return SliderMVC;
    }());
    $.fn.makeSlider = function (options) {
        var settings = $.extend({
            view: 'horizontal',
            interval: '1',
            runBox: true,
            scaleStep: '0',
            useParentId: false,
            idCodeLen: 1000
        }, options || {});
        var slider = new SliderMVC($(this).attr('id'));
        console.log(slider);
        return slider;
    };
})(jQuery);
