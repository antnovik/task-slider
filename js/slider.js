var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function ($) {
    var SliderElements = /** @class */ (function () {
        function SliderElements() {
        }
        return SliderElements;
    }());
    var SliderIntervalElements = /** @class */ (function (_super) {
        __extends(SliderIntervalElements, _super);
        function SliderIntervalElements() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SliderIntervalElements;
    }(SliderElements));
    var View = /** @class */ (function () {
        function View(sliderWrap, sliderType) {
            if (sliderType === void 0) { sliderType = 'default'; }
            this.setOutputsPositionX = function (thumbPosition) {
                this.elements.thumb.css('left', thumbPosition + 'px');
                if (this.elements.thumbOutput) {
                    var thumbWidth = this.elements.thumb.outerWidth(), thumbOutputWidth = this.elements.thumbOutput.outerWidth();
                    var difWidth = thumbOutputWidth - thumbWidth, thumbOutputOffset = 0;
                    if (difWidth > 0) {
                        thumbOutputOffset = Math.floor(difWidth / 2);
                    }
                    this.elements.thumbOutput.css('left', (thumbPosition - thumbOutputOffset) + 'px');
                }
            };
            this.type = sliderType;
            switch (sliderType) {
                case 'interval':
                    this.elements = new SliderIntervalElements();
                    break;
                case 'default':
                    this.elements = new SliderElements();
                    break;
                default:
                    this.elements = new SliderElements();
                    break;
            }
            this.subLayers = {};
            this.el = this.elements.parent = sliderWrap;
            this.bilder = new SliderBilder(this.elements);
        }
        View.prototype.create = function () {
            this.elements.scale = this.bilder.createScale();
            this.subLayers.scale = new SubView(this.elements.scale);
            switch (this.type) {
                case 'interval':
                    this.createInterval();
                    break;
                default:
                    this.createSimpleSlider();
                    break;
            }
        };
        View.prototype.createSimpleSlider = function () {
            this.elements.thumb = this.bilder.createThumb();
            this.subLayers.thumb = new SubView(this.elements.thumb);
            this.elements.thumbOutput = this.bilder.createThumbOutput();
            this.subLayers.thumbOutput = new SubView(this.elements.thumbOutput);
        };
        View.prototype.createInterval = function () {
            if (this.elements instanceof SliderIntervalElements) {
                this.elements.leftThumb = this.bilder.createThumb('thumb thumb_left');
                this.subLayers.leftThumb = new SubView(this.elements.leftThumb);
                this.elements.rightThumb = this.bilder.createThumb('thumb thumb_right');
                this.subLayers.rightThumb = new SubView(this.elements.rightThumb);
                this.elements.rightThumb.css('left', '100px');
            }
        };
        View.prototype.setOutputsValue = function (value) {
            if (this.elements.thumbOutput)
                this.elements.thumbOutput.html(value);
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
        Model.prototype.calculateCurValue = function (thumbRatioValue) {
            this.curValue = String(thumbRatioValue * 7);
            return this.curValue;
        };
        return Model;
    }());
    var Controller = /** @class */ (function () {
        function Controller(view, model) {
            this.view = view;
            this.model = model;
        }
        Controller.prototype.setMargins = function (margins) {
            this.margins = margins;
        };
        Controller.prototype.init = function () {
            var startPosition;
            this.view.create();
            this.elements = this.view.elements;
            this.handlers = new Handlers(this.elements, this.margins);
            this.subcsribeHandler();
            this.thumbMovingHandler = this.handlers.moveHorizontal;
            this.moveOutputs = this.view.setOutputsPositionX;
            startPosition = this.margins.left;
            this.calcScaleWidth();
            this.showValue(0);
            this.moveOutputs(startPosition);
            this.bindEvents();
        };
        Controller.prototype.subcsribeHandler = function () {
            var _this = this;
            this.handlers.controllerUpdate = function (thumbPosition) {
                _this.moveOutputs(thumbPosition);
                _this.showValue(thumbPosition);
            };
        };
        Controller.prototype.showValue = function (thumbPosition) {
            var thumbRatioValue = Math.round(thumbPosition / this.scaleWidth * 100);
            this.view.setOutputsValue(this.model.calculateCurValue(thumbRatioValue));
        };
        Controller.prototype.calcScaleWidth = function (slideType) {
            if (slideType === void 0) { slideType = 'x-axis'; }
            if (this.elements.scale && this.elements.thumb) {
                switch (slideType) {
                    case 'x-axis':
                        this.scaleWidth = this.elements.scale.width() - this.elements.thumb.width();
                        break;
                }
            }
        };
        Controller.prototype.bindEvents = function () {
            this.elements.thumb.on('mousedown', this.thumbMovingHandler);
        };
        return Controller;
    }());
    var Handlers = /** @class */ (function () {
        function Handlers(elements, margins) {
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
                _this.controllerUpdate(newLeft);
            };
            this.onMouseUpHorisontal = function () {
                document.removeEventListener('mouseup', _this.onMouseUpHorisontal);
                document.removeEventListener('mousemove', _this.onMouseMoveHorisontal);
            };
            this.elements = elements;
            //this.options = {};
            this.edges = {
                right: elements.scale.outerWidth() - elements.thumb.outerWidth() - margins.right,
                left: margins.left
            };
        }
        return Handlers;
    }());
    var SliderMVC = /** @class */ (function () {
        function SliderMVC(sliderID) {
            this.View = new View($('#' + sliderID), 'interval');
            this.Model = new Model();
            this.Controller = new Controller(this.View, this.Model);
        }
        SliderMVC.prototype.setOptions = function (options) {
            this.options = options;
            console.log(options);
            //Настройка контроллера
            var scaleMargins = {
                left: options.scaleMarginLeft,
                right: options.scaleMarginRight,
                top: options.scaleMarginTop,
                bottom: options.scaleMarginBottom
            };
            this.Controller.setMargins(scaleMargins);
            return this;
        };
        SliderMVC.prototype.make = function () {
            this.Controller.init();
            return this;
        };
        return SliderMVC;
    }());
    $.fn.makeSlider = function (options) {
        var settings = $.extend({
            view: 'horizontal',
            scaleMarginLeft: 0,
            scaleMarginRight: 0,
            scaleMarginTop: 0,
            scaleMarginBottom: 0
        }, options || {});
        var slider = new SliderMVC($(this).attr('id'));
        return slider.setOptions(settings).make();
    };
})(jQuery);


