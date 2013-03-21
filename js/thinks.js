/*
* Object.keys compatibility in all browsers
* source : https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys#Compatibility
* compressed by YUI Compressor
**/
Object.keys=Object.keys||(function(){var b=Object.prototype.hasOwnProperty,d=!{toString:null}.propertyIsEnumerable("toString"),a=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],c=a.length;return function(h){if(typeof h!="object"&&typeof h!="function"||h===null){throw new TypeError("Object.keys called on a non-object")}var e=[];for(var f in h){if(b.call(h,f)){e.push(f)}}if(d){for(var g=0;g<c;g++){if(b.call(h,a[g])){e.push(a[g])}}}return e}})();
/**
 * project : jQuery Thinks (THinks is a New Kind of Slider)
 * author : Copyright (c) 2012 David ARCENT (http://elrow.lescigales.org), davidarcent@gmail.com
 * Version : 1.0.0 
 * date : 13/03/2013
 * description :create a slider and handle layers
 * jquery version: 1.9+
 */
 
(function($) {

	var Thinks = function ( params )
	{
	// variable de la classe Thinks
		// local accessor
		var _tks = this;

		// array of parameter
		this.params = params;

		// list of slides
		this.slide = [];

		// index of current slide
		this.current = this.params.first;

		// Object timer
		this.timer = {};

	/* Méthodes */
		// constructor
		this.init = function () {
			// hydrate slides
			_tks.params.element.find('ul li').each( function (i) {
				_tks.slide[ i ] = new Slide( $(this) );
			});
			//initialisation ddata
			_tks.createNavbar()
				.createScene()
				.createLoader()
				.setLoaderBackground( _tks.current )
				.loaderToCurrent()
				.setActive()
				.bindEvents()
				.startTimer( _tks.params.delay ).bindPauseHover();
			_tks.params.element.children('.scene')
				.children('.current').show()
				.append( _tks.slide[ _tks.current ].getLayers( _tks.params.layerSelector ) );		
		}

		//create the scene where slide are append
		this.createScene = function () {
			_tks.params.element.prepend('<div class="scene"></div>');
			return _tks;
		}

		//création d'un bloc de chargement de l'image suivante pour l'animation
		this.createLoader = function () {
			_tks.params.element.children('.scene').prepend('<div class="loader"></div>');
			return _tks;
		}

		// créé la liste de navigation
		this.createNavbar = function () {
			if( _tks.params.navSelector ) {
				var items ='<nav><ul>';
				_tks.params.element.find("li").each(function (i) {
					items += '<li>';
					// si la liste est numéroté, on génère les nombres
					if( _tks.params.numberNav ) items += eval(i+1);
					items += '</li>';
				});
				items += '</nav></ul>';
				_tks.params.element.find(_tks.params.navSelector).append(items);
			}
			return _tks;
		}

		// affiche le slide actif sur la navbar
		this.setActive = function () {
			_tks.params.element.find(_tks.params.navSelector).find('li').removeClass('active');
			if( _tks.params.navSelector ) {
				_tks.params.element.find( _tks.params.navSelector ).find('li').eq( _tks.current ).addClass('active').css({ zIndex : "1"});
			}
			return _tks;
		}

		//modifie div.loader en div.current
		this.loaderToCurrent = function () {
			_tks.params.element.children('.scene').children('.current').remove();
			_tks.params.element.children('.scene').children('.loader').removeClass('loader').addClass('current').css({ zIndex:'1' })
			return _tks;
		}

		// défini le background 
		this.setLoaderBackground = function( index ) {
			_tks.params.element.find('.scene .loader').css( _tks.slide[ index ].getCSS() );
			return _tks;
		}

		// ajoute les écouteurs
		this.bindEvents = function () {
			// evenements de la barre de navigation
			_tks.params.element.find(_tks.params.navSelector).find('li').bind('click', function () {
				_tks.displaySlide( $(this).index() );
			});

			// évenements sur les bouton précédent et suivant
			_tks.params.element.find(_tks.params.pervSelector).bind('click', function () {
				_tks.displaySlide( _tks.current-1 );
			});
			_tks.params.element.find(_tks.params.nextSelector).bind('click', function () {
				_tks.displaySlide( _tks.current+1 );
			});

			// pause du timer au survol
			if( _tks.params.pauseHover ){

			}
			return this;
		}

		//supprime les écouteurs
		this.unbindEvents = function () {
			// evenements de la barre de navigation
			_tks.params.element.find(_tks.params.navSelector).find('li').unbind('click');
			// évenements sur les bouton précédent et suivant
			_tks.params.element.find(_tks.params.pervSelector).unbind('click');
			_tks.params.element.find(_tks.params.nextSelector).unbind('click');

			return this;
		}

		// fonction princiapl d'animation
		this.displaySlide = function ( index ) {
			// on désctive les evenements et le timer le temps de l'animation 	
			_tks.unbindEvents().stopTimer().unbindPauseHover();;
			// ajustement de l'index
			index = ( index < 0 ) ? _tks.slide.length - 1 : ( index > _tks.slide.length - 1 ) ? 0 : index;
			if( index != _tks.current ) {
				//sortie des layers présents
				_tks.layersOut( function () {
					// assignation de l'image en background de .loader
					_tks.createLoader().setLoaderBackground( index ).slideAnim( index, function () {
						_tks.params.element.find('.scene .loader').append( _tks.slide[ index ].getLayers( _tks.params.layerSelector ) );
						_tks.loaderToCurrent();
						_tks.current = index;
						_tks.setActive().bindEvents();
						_tks.layersIn( function () {
							//lance le timer
							_tks.startTimer( _tks.params.delay ).bindPauseHover();
						});
					});
				});
			}
		}

		//animation d'entrée du calque suivant
		this.slideAnim = function ( index, callback ) {
			var slide = _tks.slide[ index ],
				// permet une animation personalisé d'un slide data-anim="effect" et data-speed="speed"
				anim = ( slide.element.attr('data-anim') ) ? slide.element.attr('data-anim') : _tks.params.effect;
				if( anim == 'random' ) anim = slide.getRandomEffect();
			//animation et callback
			_tks.params.element.find('.scene .loader')
				.css( slide.effect[ anim ].css )
				.animate( slide.effect[ anim ].animate, ( slide.element.attr('data-speed') ) ? eval( slide.element.attr('data-speed') ) : _tks.params.speed , callback );
		}

		// Entrée des calques présent
		this.layersIn = function ( callback ) {
			var maxspeed = 0;
			if( _tks.slide[_tks.current].layer.length ) {
				_tks.params.element.children('.scene').find('.layer').each( function ( i ) {
					var layer = _tks.slide[ _tks.current ].layer[ i ],
						anim  = layer.getAnimIn();
					if( anim == 'random' ) anim = layer.getRandomEffect();
					if( anim == null ){
						$(this).css({ 'display' : 'block' });
					}
					else{
						$(this)
							.css( layer.effect.In[ anim ].css )
							.delay( layer.getDelay() )
							.animate( layer.effect.In[ anim ].animate, layer.getSpeed() );
					}

					maxspeed = (maxspeed < ( layer.getSpeed() + layer.getDelay() ) ) ? layer.getSpeed() + layer.getDelay() : maxspeed;
				});
			}
			setTimeout( callback, maxspeed );
		}

		// Sortie des calques présent
		this.layersOut = function ( callback ) {			
			var maxspeed = 0;

			if( _tks.slide[_tks.current].layer.length ) {
				_tks.params.element.children('.scene').find('.layer').each( function ( i ) {
					var layer = _tks.slide[ _tks.current ].layer[ i ];
						anim  = layer.getAnimOut();
					if( anim == 'random' ) anim = layer.getRandomEffect();
					if( anim != null ) {
						$(this).stop().animate( layer.effect.Out[ anim ].animate, layer.getSpeed() );
						maxspeed = (maxspeed < layer.getSpeed() ) ? layer.getSpeed() : maxspeed;
					}
				});
			}
			setTimeout( callback, maxspeed);
		}


		// rotation automatique, initialisation de setTimeout
		this.startTimer = function ( cooldown ) {

			if(_tks.params.delay) 
			{
				_tks.timer.Time     = new Date().getTime();
				_tks.timer.cooldown = cooldown;
				if( !_tks.timer.stop )
				_tks.timer.Timeout  = setTimeout( function() { 
					_tks.displaySlide( _tks.current + 1 );
				}, cooldown );
			}
			return this;
		}

		this.bindPauseHover = function () {
			if( _tks.params.pauseHover ) {
				var clepsydre = 0;
				_tks.params.element.bind({
					mouseenter : function()
					{
						_tks.timer.stop = true;
						clepsydre = new Date().getTime() - _tks.timer.Time;
						_tks.stopTimer();

					},
					mouseleave : function() {
						_tks.timer.stop = false;	
						_tks.startTimer( _tks.timer.cooldown - clepsydre );

					}				
				});
			}
			return this;
		}
		this.unbindPauseHover = function () {
			//annule la pause du timer
			if( _tks.params.pauseHover ) _tks.params.element.unbind('mouseenter mouseleave');
			return this;
		}
		// Suppression du temps d'attente si il existe
		this.stopTimer = function () {
			if( _tks.params.delay ) 
				clearTimeout( _tks.timer.Timeout );
			return this;
		}

		this.init();
	}
	
	//class de slide
	var Slide = function ( element )
	{
		//accesseur local
		var _sld = this;
		
		// objet jQuery (<li><img/>[...]</li>)
		this.element = element;
		
		//image du slide
		this.img = element.children('img');

		//tableau des calques
		this.layer = [];

		this.effect = {
			slidingBot:
			{
				css     : { top: '-='+_sld.element.parent().parent().height()+'px','display' : 'block'},
				animate : { top: '0px' }
			},
			slidingTop:
			{
				css     : { top: '+='+_sld.element.parent().parent().height()+'px','display' : 'block'},
				animate : { top: '0px' }
			},
			slidingLeft:
			{
				css     : { left: '+='+_sld.element.parent().parent().width()+'px','display' : 'block' },
				animate : { left: '0px' }
			},
			slidingRight:
			{
				css     : { left: '-='+_sld.img.parent().parent().width()+'px','display' : 'block' },
				animate : { left: '0px' }
			},
			fade:
			{
				css     : { opacity: '0', 'display' : 'block',  Zindex: '1'},
				animate : { opacity: '1'}
			},
		}

		this.getRandomEffect = function() {
			return Object.keys( _sld.effect )[ Math.floor( Math.random() * Object.keys( _sld.effect ).length ) ];
		}

		//retourne le CSS du slide
		this.getCSS = function (){

			// capsule CSS
			var css = 
			{
				width				: '100%',
				height				: '100%',
				position			: 'absolute',
				display				: 'none',
				top					: '0px', 
				left				: '0px',
				backgroundImage 	: 'url('+_sld.img.attr('src')+')',
				backgroundRepeat	: 'no-repeat',
				zIndex				: '100',
			}

			//si l'image est centrée automatiquement
			if( _sld.element.children('img').attr('data-position')){
				css.backgroundPosition = _sld.element.children('img').attr('data-position');
			}

			// si l'image est redimentionnée automatiquement
			if( _sld.element.children('img').attr('data-autoScale') ) 
				css.backgroundSize = 'cover';

			return css;
		}

		this.getLayers = function ( selector ) {
			return _sld.element.find( selector ).each( function ( i ) {
				_sld.layer[ i ] = ( typeof(_sld.layer[ i ]) == 'undefined' ) ? new Layer ( $(this) ) : _sld.layer[ i ] ;

			}).clone();
		}
	}

	// class de calque
	var Layer = function( element )
	{
		// Accesseur local
		var _lyr      = this;

		// objet jQuery <div class="layer"></div>
		this.element  = element;

		// Effets d'animation
		// _lyr.element.parent().parent().parent() = #thinks
		this.effect = {
			In:
			{
				slidingBot:
				{
					css     : { top: '-='+_lyr.element.parent().parent().parent().height()+'px','display' : 'block'},
					animate : { top: _lyr.element.css('top') }
				},
				slidingTop:
				{
					css     : { top: '+='+_lyr.element.parent().parent().parent().height()+'px','display' : 'block'},
					animate : { top: _lyr.element.css('top') }
				},
				slidingLeft:
				{
					css     : { left: '+='+_lyr.element.parent().parent().parent().width()+'px','display' : 'block' },
					animate : { left: _lyr.element.css('left') }
				},
				slidingRight:
				{
					css     : { left: '-='+_lyr.element.parent().parent().parent().width()+'px','display' : 'block' },
					animate : { left: _lyr.element.css('left') }
				},
				fade:
				{
					css     : { opacity: '0', 'display' : 'block'},
					animate : { opacity: '1' }
				},
			},
			Out:
			{
				slidingBot   : { animate: { top: '-='+_lyr.element.parent().parent().parent().height()+'px' } },
				slidingTop   : { animate: { top: '+='+_lyr.element.parent().parent().parent().height()+'px' } },
				slidingLeft  : { animate: { left: '+='+_lyr.element.parent().parent().parent().width()+'px' } },
				slidingRight : { animate: { left: '-='+_lyr.element.parent().parent().parent().width()+'px' } },
				fade         : { animate: { opacity: '0' } },
			}
		}

		this.getRandomEffect = function() {
			return Object.keys( _lyr.effect.In )[ Math.floor( Math.random() * Object.keys( _lyr.effect.In ).length ) ];
		}

		this.getSpeed = function () {
			return ( _lyr.element.attr('data-speed') ) ? eval( _lyr.element.attr('data-speed') ) : 0 ;
		}

		this.getDelay = function () {
			return ( _lyr.element.attr('data-delay') ) ? eval( _lyr.element.attr('data-delay') ) : 0;
		}

		this.getAnimIn = function () {
			return ( _lyr.element.attr('data-anim-in') ) ? _lyr.element.attr('data-anim-in') : null;
		}

		this.getAnimOut = function () {
			return ( _lyr.element.attr('data-anim-out') ) ? _lyr.element.attr('data-anim-out') : null;
		}
	}

	$.fn.thinks = function ( params )
	{

		var _default = {
		/* Selecteurs */
			// conteneur
			element 			: this,
			// Calques
			layerSelector		: ".layer",
			// Pervious
			pervSelector		: "#prev",
			// Next
			nextSelector		: "#next",
			// navSelector : false ou selecteur
			navSelector			: "#controls",
			// first : premier slide à afficher
			first 				: 0,

		/* vitesse */
			// vitesse d'animation 
			speed				: 500,
			// false ou ms : attente entre les elements 
			delay				: 5000,

		/* Options */
			effect 				: "fade",
			//affiche les numéro dans la barre de navigation
			numberNav			: true,
			//slider en pause au survol de la souris
			pauseHover			: true,

		/*callback */
			//retour de fonction qui stoppe l'animation
			stop				: function() { return false },
		};

		params = $.extend( _default, params );

		var thinks = new Thinks( params );

		return $(this);
	}
})(jQuery);

/**
schémas :
<div id="thinks" style="width : XXpx; height:XXpx; background-repeat : no-repeat;">
	<div class="no-script">
		<noscript>
			<!-- image lorsque le javascript est désactivé -->
			<img src="url"/>
		</noscript>
	</div>
	<ul>
		<!-- peux contenir plusieurs scene (li) -->
		<li (data-anim="anim" data-speed="ms")>
		  	<img src="url" alt="alt" data-autoscale="true or false" data-position="background-position"/>
		  	<!-- peux contenir plusieurs calques div.layer -->
				<div class="layer" style="style" data-speed="ms" data-delay="ms" data-anim-in="effetIn" data-anim-out="effetIn">
				   <!-- contenu des calques -->
				</div>
		</li>
	</ul>
	<div id="controls"></div>
	<div id="prev"></div>
	<div id="next"></div>
</div>
*/
