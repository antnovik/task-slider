//var jQueryPlagin;
//jQueryPlagin = jQuery;

(function($) {

    interface ViewInterface
    {
        model: any;
        update(): void;
        setModel(model:any): void;
    }
    
    class View implements ViewInterface
    {
        
        model: any;
        obSlider: any;
        constructor (obSlider: any){
            this.obSlider = obSlider;
        }
        setModel(model:any): void
        {
            this.model = model;
        }

        update ():void
        {

        }
    } 
   
   
    interface ControllerInterface
    {
        view: any;
        model: any;
        bindEvents(): void;
        subscribeVewToModel():void;
        setModelToView():void;
    }

    class Controller implements ControllerInterface
    {
        view: any;
        model: any;
        handlers: any;

        obSlider: any;
        thumbMovingHandler: any;
        
        constructor (view: any, model: any){
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

        subscribeVewToModel():void
        {
            this.model.subscribeView(this.view);
        }

        setModelToView():void
        {
            this.view.setModel(this.model);
        }
       
        bindEvents(): void
        {
            this.obSlider.thumb.on(
                'mousedown',
                this.thumbMovingHandler
            );
        }       
    }


    class Handlers
    {
        obSlider: any;
        sliderDOM: any;

        constructor (obSlider: any)
        {
            this.obSlider = obSlider;
            this.sliderDOM = {
                slider : obSlider.DOM.slider,
                thumb : obSlider.DOM.thumb
                //slider : Helper.makeClearJSElement(obSlider.slider),
                //thumb : Helper.makeClearJSElement(obSlider.thumb)
            }
        }

        moveHorizontal = (event: any) =>{
            event.preventDefault();
          
            let slider =  this.sliderDOM.slider;
            let thumb = this.sliderDOM.thumb;
            this.sliderDOM.shiftX = event.clientX - this.sliderDOM.thumb.getBoundingClientRect().left;

            document.addEventListener('mousemove', this.onMouseMoveHorisontal);
            document.addEventListener('mouseup', this.onMouseUpHorisontal);
        }

        onMouseMoveHorisontal = (event: any) => {
            let slider =  this.sliderDOM.slider,
                thumb = this.sliderDOM.thumb,
                shiftX = this.sliderDOM.shiftX;

            let newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;
        
            // курсор вышел из слайдера => оставить бегунок в его границах.
            if (newLeft < 0) {
              newLeft = 0;
            }
            let rightEdge = slider.offsetWidth - thumb.offsetWidth;
            if (newLeft > rightEdge) {
              newLeft = rightEdge;
            }
    
            thumb.style.left = newLeft + 'px';
        }

        onMouseUpHorisontal = () => {
            document.removeEventListener('mouseup', this.onMouseUpHorisontal);
            document.removeEventListener('mousemove', this.onMouseMoveHorisontal);
        }

        static testHandler = function(event)
        {
            console.log(event);
            console.log('testHandler');
        }
    }


    class Helper
    {
        static makeClearJSElement(el: any){
            if(el instanceof jQuery)
                return el.get(0);
        }
    }

    interface ModelInterface
    {   
        view: any;
        curValue: string;
        subscribeView(view: any):void;
        init(type: string):void;
    }

    class Model implements ModelInterface
    {
        view: any;
        obSlider: any;
        thumbStep: number;
        curValue: string;

        
        constructor(obSlider: any)
        {
            this.obSlider = obSlider;
        }

        init(type: string = 'default')
        {
            console.log(type);
        }

        subscribeView(view: any)
        {
            this.view = view;
        }

        calculateCurValue():void
        {

            this.view.update();
        }
    }

    interface SliderInterface
    {   
        slider: any;
        thumb: any;
        DOM: any;
    }


    class Slider implements SliderInterface{
        slider: any;
        thumb: any;
        DOM:any;
        constructor (sliderID: string){
            this.DOM = {};
            let jquerySlider = $('#' + sliderID);
            this.slider = jquerySlider;
            this.DOM.slider = Helper.makeClearJSElement(this.slider);
        }
    }


    interface SliderBilderInterface
    {   
        obSlider: any;
        createThumb(): void;
    }

    class SliderBilder implements SliderBilderInterface{
        obSlider: any;
        constructor(obSlider: any)
        {
            this.obSlider = obSlider;
        }

        createThumb(className:string = 'thumb')
        {
            let slider = this.obSlider.slider;
            let thumb = $('<div>', {'class': className});
            slider.append(thumb);
            this.obSlider.thumb = thumb;
            this.obSlider.DOM.thumb = Helper.makeClearJSElement(thumb);
            return this;
        }
    }

    class SliderMVC
    {
        View: any;
        Model: any;
        Controller: any;

        constructor(sliderID: string)
        {
            let obSlider = new Slider(sliderID);
            let bilder =  new SliderBilder(obSlider);
            bilder.createThumb();
            console.log(bilder);
            this.View = new View(obSlider);
            this.Model = new Model (this.View.obSlider);
            this.Controller = new Controller (this.View, this.Model);
            
        }

    }

    $.fn.makeSlider = function(options) {
		var settings = $.extend({
			view: 'horizontal',
			interval: '1',
			runBox: true,
			scaleStep: '0',
			useParentId: false,
			idCodeLen: 1000,
        }, options||{});

        let slider = new SliderMVC($(this).attr('id'));
        return $(this);
        //console.log(slider);
    }



})(jQuery);