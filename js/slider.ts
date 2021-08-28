declare var jQuery: any;
(function($) {
    class SliderElements 
    {
        parent: any;
        thumb: any;
        scale: any;
        thumbOutput:any;
    }

    class SliderIntervalElements extends SliderElements
    {
        leftThumb:any;
        leftThumbOutput:any;
        rightThumb:any;
        rightThumbOutput:any;
    }



    interface MainViewInterface
    {
       el: any;
       type: string;
       elements:SliderElements;
       subLayers: any;
       create(): void;
    }

    class View implements  MainViewInterface
    {
        el: any;
        type: string;
        elements: SliderElements;
        subLayers: any;
        bilder: any;

        constructor (sliderWrap: any, sliderType: string = 'default')
        {
            this.type = sliderType;
            switch (sliderType){
                case 'interval':
                    this.elements =  new SliderIntervalElements();
                    break;
                case 'default':
                    this.elements =  new SliderElements();
                    break;
                default:
                    this.elements =  new SliderElements();
                    break;
            }

            this.subLayers = {};
            this.el = this.elements.parent = sliderWrap;

            this.bilder = new SliderBilder(this.elements);
        }

        create():void
        {
            this.elements.scale =  this.bilder.createScale();
            this.subLayers.scale = new SubView(this.elements.scale);

            switch (this.type){
                case 'interval':
                    this.createInterval();
                    break;
                default:
                    this.createSimpleSlider();
                    break;
            }
        }

        createSimpleSlider():void
        {
            this.elements.thumb =  this.bilder.createThumb();
            this.subLayers.thumb = new SubView(this.elements.thumb);

            this.elements.thumbOutput =  this.bilder.createThumbOutput();
            this.subLayers.thumbOutput = new SubView(this.elements.thumbOutput);
        }

        createInterval():void
        {
            if( this.elements instanceof SliderIntervalElements){
                this.elements.leftThumb =  this.bilder.createThumb('thumb thumb_left');
                this.subLayers.leftThumb = new SubView( this.elements.leftThumb);
    
                this.elements.rightThumb =  this.bilder.createThumb('thumb thumb_right');
                this.subLayers.rightThumb = new SubView( this.elements.rightThumb);
    
                this.elements.rightThumb.css('left', '100px');
            }
        }
        

        setOutputsPositionX = function (thumbPosition: number): void
        {
            this.elements.thumb.css('left', thumbPosition + 'px');
            if(this.elements.thumbOutput){
                let thumbWidth =  this.elements.thumb.outerWidth(),
                    thumbOutputWidth =  this.elements.thumbOutput.outerWidth();

                let difWidth = thumbOutputWidth - thumbWidth,
                    thumbOutputOffset = 0;

                if(difWidth > 0){
                    thumbOutputOffset = Math.floor(difWidth/2);
                }
                this.elements.thumbOutput.css('left', (thumbPosition -  thumbOutputOffset) + 'px');
            }
        }
        

        setOutputsValue(value: string): void
        {
            if(this.elements.thumbOutput)
                this.elements.thumbOutput.html(value);
        }

    }


    class SubView
    {
        el: any;
        constructor(el: any){
            this.el = el;
        }
    }

    interface SliderBilderInterface
    {   
        elements: SliderElements;
        createThumb(): any;
        createThumbOutput(): any;
    }

    class SliderBilder implements SliderBilderInterface{
        elements: SliderElements;
 
        constructor(elements: SliderElements)
        {
            this.elements = elements;
        }

        createScale(className:string = 'scale') : any{
            let scale = $('<div>', {'class': className}),
                slider = this.elements.parent;
            slider.append(scale);
            return scale;
        }

        createThumb(className:string = 'thumb') : any
        {
            let thumb = $('<div>', {'class': className}),
                scale = this.elements.scale;
            scale.append(thumb);
            return thumb;
        }

        createThumbOutput(className:string = 'thumb-output'): any
        {
            let thumbOut = $('<div>', {'class': className}),
                scale = this.elements.scale;

            scale.append(thumbOut);

            return thumbOut;
         }
    }


    interface ModelInterface
    {   
        curValue: string;
        init(type: string):void;
    }

    class Model implements ModelInterface
    {
        thumbStep: number;
        curValue: string;   

        
        constructor()
        {
            this.curValue = '';
        }

        init(type: string = 'default')
        {
            console.log(type);
        }

        calculateCurValue(thumbRatioValue : number):string
        {
            this.curValue = String(thumbRatioValue*7);
            return this.curValue;
        }
    }

    interface ControllerInterface
    {
        view: any;
        model: any;
        scaleWidth: number;
        thumbPosition: number;
      
        calcScaleWidth(sliderType: string): void;

        bindEvents(): void;
    }

    class Controller implements ControllerInterface
    {
        view: any;
        model: any;
        elements: SliderElements;
        handlers: any;
        margins: any;

        thumbMovingHandler: any;
        moveOutputs: any;

        scaleWidth: number;
        thumbPosition: number;

        
        constructor (view: any, model: any){
            this.view = view;
            this.model = model;
        }

        setMargins(margins:any) : void
        {
            this.margins = margins;
        }

        init(): void
        {
            let startPosition;
            
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
        }

        subcsribeHandler(): void
        {
            this.handlers.controllerUpdate = (thumbPosition:number) => {
                this.moveOutputs(thumbPosition);               
                this.showValue(thumbPosition);
            }
        }

        showValue(thumbPosition:number): void
        {
            let thumbRatioValue = Math.round(thumbPosition/this.scaleWidth*100);
            this.view.setOutputsValue(this.model.calculateCurValue(thumbRatioValue));
        }


        calcScaleWidth(slideType: string = 'x-axis'): void
        {
            if(this.elements.scale && this.elements.thumb){
                switch (slideType){
                    case 'x-axis':
                        this.scaleWidth = this.elements.scale.width() - this.elements.thumb.width();
                        break;
                }
            }
        }

   

      
        bindEvents(): void
        {
            this.elements.thumb.on(
                'mousedown',
                this.thumbMovingHandler
            );
        }       
    }


    class Handlers
    {
        elements: SliderElements;
        edges: any;
        shiftX: number;
        //options: any;
        controllerUpdate: any;

        constructor (elements: any, margins: any)
        {

            this.elements = elements;
           //this.options = {};
            this.edges = {
                right: elements.scale.outerWidth() - elements.thumb.outerWidth() - margins.right,
                left: margins.left
            };  
        }

        moveHorizontal = (event: any) =>{
            event.preventDefault();
            let elements = this.elements;
            let thumbLeft = elements.thumb.offset().left;
            this.shiftX = event.clientX - thumbLeft;


            document.addEventListener('mousemove', this.onMouseMoveHorisontal);
            document.addEventListener('mouseup', this.onMouseUpHorisontal);
        }

        onMouseMoveHorisontal = (event: any) => {
            let elements = this.elements;
            let sliderLeft = elements.scale.offset().left,
                shiftX = this.shiftX;

            let newLeft = event.clientX - shiftX - sliderLeft;


            if (newLeft < this.edges.left) {
              newLeft = this.edges.left;
            }
  
            if (newLeft > this.edges.right) {
              newLeft = this.edges.right;
            }

            this.controllerUpdate(newLeft);
        }

        onMouseUpHorisontal = () => {
            document.removeEventListener('mouseup', this.onMouseUpHorisontal);
            document.removeEventListener('mousemove', this.onMouseMoveHorisontal);
        }
    }


    class SliderMVC
    {
        View: any;
        Model: any;
        Controller: any;
        options: any;

        constructor(sliderID: string)
        {
            this.View = new View($('#'+ sliderID), 'interval');
            this.Model = new Model();
            this.Controller = new Controller(this.View, this.Model);
        }

        setOptions(options : any): SliderMVC
        {
            this.options = options;

            console.log(options);

            //Настройка контроллера
            let scaleMargins = {
                left: options.scaleMarginLeft,
                right: options.scaleMarginRight,
                top: options.scaleMarginTop,
                bottom: options.scaleMarginBottom,
            }
            this.Controller.setMargins(scaleMargins);

            return this;
        }

        make(): SliderMVC
        {
            this.Controller.init();
            return this;
        }
    }

    $.fn.makeSlider = function(options) {
		let settings = $.extend({
            view: 'horizontal',
            scaleMarginLeft: 0,
            scaleMarginRight: 0,
            scaleMarginTop: 0,
            scaleMarginBottom: 0,
        }, options||{});

        let slider = new SliderMVC($(this).attr('id'));
        return slider.setOptions(settings).make();
    }
})(jQuery);