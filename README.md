# Thinks #
<<<<<<< HEAD
------
THinks Is a New Kind of Slider

### Work in progress ###

This project is a jQuery plugin that can create and handle a slider implementing a system of layer.

## Link :##
[Demo](http://elrow.lescigales.org/experiences-thinks.html) 

=======

THinks Is a New Kind of Slider

## How to use it ? ##
### HTML : ###

Thinks project is a jQuery plugin that can create and handle a slider implementing a system of layer. The declaration is very simple.

#### Container : ####

In a first time, create a container ( `div` recommend), with an unique `id` attribute. Define the `height` and `width` in the style attribute or in your CSS file. And the first step is done.

#### Slides : ####

Now, put an `ul` element inside your container, and for each slide you want a `li` element. Inside declare you `img` that you want display for the slide.

You have two options for render of images. You can add the `data-autoscale` (true|false) to add the CSS "background-size : cover" value , and `data-position` corresponds to the CSS background-position value.

Don't forgett, the `li` correspond to your slide, not the `img`.

#### Layers : ####

Layers are instantiated in the `li` of the slider, generaly in a `div` element with a common class. Inside you can put directely HTML code, like text nodes, images or links. There will display cloned. You can have many layers has you want in a slide. Just respect the following synthaxe.

Animation are detailed [here](http:// "Animation"). Also, you can define the position of the layer in the style attribute. the speed, delay and animation effect, respectively in the `data-speed`, `data-delay`, `data-anim-in` and `data-anim-out` attribut.
>>>>>>> Doc update
