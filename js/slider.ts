(function($) {
   interface MainViewInterface
   {
       el: any;
       elements:any;
       subLayers: any;
       create(): void;
   }

    class View implements  MainViewInterface
    {
        el: any;
        elements: any;
        subLayers: any;
        bilder: any;

        constructor (slider: any){
            this.elements =  {};
            this.subLayers = {};
            this.el = this.elements.parent = slider;

            this.bilder = new SliderBilder(this.elements);
        }

        create(){
            let bilder = this.bilder;
            this.elements.scale = bilder.createScale();
            this.subLayers.scale = new SubView(this.elements.scale);

            this.elements.thumb = bilder.createThumb();
            this.subLayers.thumb = new SubView(this.elements.thumb);

            this.elements.thumbOutput = bilder.createThumbOutput();
            this.subLayers.thumbOutput = new SubView(this.elements.thumbOutput);
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
        elements: any;
        createThumb(): any;
        createThumbOutput(): any;
    }

    class SliderBilder implements SliderBilderInterface{
        elements: any;
 
        constructor(elements: any)
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

        calculateCurValue(thumbPosition : number):void
        {
            //this.view.update();
        }
    }

    interface ControllerInterface
    {
        view: any;
        model: any;
        scaleWidth: number;
        thumbPosition: number;
      
        calcScaleWidth(): void;

        bindEvents(): void;
    }

    class Controller implements ControllerInterface
    {
        view: any;
        model: any;
        elements: any;
        handlers: any;

        thumbMovingHandler: any;

        scaleWidth: number;
        thumbPosition: number;

        
        constructor (view: any, model: any){
            this.view = view;
            this.model = model;
        }

        init(): void
        {
            this.view.create();
            this.elements = this.view.elements;
            this.handlers = new Handlers(this.elements);
            this.thumbMovingHandler = this.handlers.moveHorizontal;
            this.calcScaleWidth;
            this.bindEvents();
        }

        calcScaleWidth(): void
        {
            //return true;
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
        elements: any;
        edges: any;
        shiftX: number;

        constructor (elements: any)
        {

            this.elements = elements;
            this.edges = {
                right: elements.scale.outerWidth() - elements.thumb.outerWidth(),
                left: 0
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

            elements.thumb.css('left', newLeft + 'px')
            elements.thumbOutput.css('left', newLeft + 'px')
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

        constructor(sliderID: string)
        {
           
            this.View = new View($('#'+ sliderID));
            this.Model = new Model();
            this.Controller = new Controller(this.View, this.Model);
            this.Controller.init();
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
        console.log(slider);
        return slider;

    }
})(jQuery);