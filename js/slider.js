//var jQueryPlagin;
//jQueryPlagin = jQuery;
(function ($) {
    var View = /** @class */ (function () {
        function View(obSlider) {
            this.obSlider = obSlider;
        }
        View.prototype.setModel = function (model) {
            this.model = model;
        };
        View.prototype.update = function () {
        };
        return View;
    }());
    var Controller = /** @class */ (function () {
        function Controller(view, model) {
            //super();
            //let obSlider
            this.view = view;
            this.model = model;
            this.subscribeVewToModel();
            this.setModelToView();
            this.obSlider = view.obSlider;
            this.handlers = new Handlers(this.obSlider);
            //console.log(this.handlers);
            //this.thumbMovingHandler = Handlers.moveHorizontal;
            this.thumbMovingHandler = this.handlers.moveHorizontal;
            this.bindEvents();
        }
        Controller.prototype.subscribeVewToModel = function () {
            this.model.subscribeView(this.view);
        };
        Controller.prototype.setModelToView = function () {
            this.view.setModel(this.model);
        };
        Controller.prototype.bindEvents = function () {
            this.obSlider.thumb.on('mousedown', this.thumbMovingHandler);
        };
        return Controller;
    }());
    var Handlers = /** @class */ (function () {
        function Handlers(obSlider) {
            var _this = this;
            this.moveHorizontal = function (event) {
                event.preventDefault();
                var slider = _this.sliderDOM.slider;
                var thumb = _this.sliderDOM.thumb;
                _this.sliderDOM.shiftX = event.clientX - _this.sliderDOM.thumb.getBoundingClientRect().left;
                document.addEventListener('mousemove', _this.onMouseMoveHorisontal);
                document.addEventListener('mouseup', _this.onMouseUpHorisontal);
            };
            this.onMouseMoveHorisontal = function (event) {
                var slider = _this.sliderDOM.slider, thumb = _this.sliderDOM.thumb, shiftX = _this.sliderDOM.shiftX;
                var newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;
                // курсор вышел из слайдера => оставить бегунок в его границах.
                if (newLeft < 0) {
                    newLeft = 0;
                }
                var rightEdge = slider.offsetWidth - thumb.offsetWidth;
                if (newLeft > rightEdge) {
                    newLeft = rightEdge;
                }
                thumb.style.left = newLeft + 'px';
            };
            this.onMouseUpHorisontal = function () {
                document.removeEventListener('mouseup', _this.onMouseUpHorisontal);
                document.removeEventListener('mousemove', _this.onMouseMoveHorisontal);
            };
            this.obSlider = obSlider;
            this.sliderDOM = {
                slider: obSlider.DOM.slider,
                thumb: obSlider.DOM.thumb
                //slider : Helper.makeClearJSElement(obSlider.slider),
                //thumb : Helper.makeClearJSElement(obSlider.thumb)
            };
        }
        Handlers.testHandler = function (event) {
            console.log(event);
            console.log('testHandler');
        };
        return Handlers;
    }());
    var Helper = /** @class */ (function () {
        function Helper() {
        }
        Helper.makeClearJSElement = function (el) {
            if (el instanceof jQuery)
                return el.get(0);
        };
        return Helper;
    }());
    var Model = /** @class */ (function () {
        function Model(obSlider) {
            this.obSlider = obSlider;
        }
        Model.prototype.init = function (type) {
            if (type === void 0) { type = 'default'; }
            console.log(type);
        };
        Model.prototype.subscribeView = function (view) {
            this.view = view;
        };
        Model.prototype.calculateCurValue = function () {
            this.view.update();
        };
        return Model;
    }());
    var Slider = /** @class */ (function () {
        function Slider(sliderID) {
            this.DOM = {};
            var jquerySlider = $('#' + sliderID);
            this.slider = jquerySlider;
            this.DOM.slider = Helper.makeClearJSElement(this.slider);
        }
        return Slider;
    }());
    var SliderBilder = /** @class */ (function () {
        function SliderBilder(obSlider) {
            this.obSlider = obSlider;
        }
        SliderBilder.prototype.createThumb = function (className) {
            if (className === void 0) { className = 'thumb'; }
            var slider = this.obSlider.slider;
            var thumb = $('<div>', { 'class': className });
            slider.append(thumb);
            this.obSlider.thumb = thumb;
            this.obSlider.DOM.thumb = Helper.makeClearJSElement(thumb);
            return this;
        };
        return SliderBilder;
    }());
    var SliderMVC = /** @class */ (function () {
        function SliderMVC(sliderID) {
            var obSlider = new Slider(sliderID);
            var bilder = new SliderBilder(obSlider);
            bilder.createThumb();
            console.log(bilder);
            this.View = new View(obSlider);
            this.Model = new Model(this.View.obSlider);
            this.Controller = new Controller(this.View, this.Model);
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
        return $(this);
        //console.log(slider);
    };
})(jQuery);
