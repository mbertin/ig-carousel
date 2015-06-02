# ig-carousel
Angular carousel directive

ig-carousel is an 3D carousel angular module.

## How to install ? 

Install the module using bower : `bower install ig-carousel`

Add it in your angular app. 

in the js : 
`angular.module("demo", ["ig-carousel"])`

## How to use ?

It's very simple to use.

Just define on a `ul` element `ig-carousel` attribute.
IMPORTANT: The ul element had to be relative and have a fixed width and height, it's use for positionning the elements.

```css
  width: 572px; //fixed width
	height: 223px; // fixed height
	position: relative;
```

### Example

This code is available in the demo folder.
```html
 <ul data-ig-carousel animation-duration="800" auto-slide="true" rtl="true" slide-duration="5" item-displayed="5">
			<li><img src="img/1.png"/></li>
			<li><img src="img/2.png"/></li>
			<li><img src="img/5.png"/></li>
			<li><img src="img/2.png"/></li>
			<li><img src="img/3.png"/></li>
			<li><img src="img/2.png"/></li>
			<li><img src="img/4.png"/></li>
			<li><img src="img/2.png"/></li>
			<li><img src="img/1.png"/></li>
			<li><img src="img/2.png"/></li>
			<li><img src="img/5.png"/></li>
			<li><img src="img/2.png"/></li>
			<li><img src="img/3.png"/></li>
		</ul>
```

### Options
`item-displayed`(**Default: 5**) The number of items to be shown, min value is 3 and don't have a max value. This value have to be odd (3,5,7,9, ...).

`auto-slide` (**Default: true**) The carousel is automatically changing item

`slide-duration` (**Default: 3**) The number of second that the item is displayed before changing (auto-slide have to be true)

`animation-duration` (**Default: 1000**) The animation duration between two items (in ms)

`rtl` (**Default: true**) Rtl stand for '_Right-To-Left_' indicate the direction of the rotation (from right to the left if false otherwise from left to right)





