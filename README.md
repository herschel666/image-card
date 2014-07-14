Image-Card
====

Image Card is a Custom Element for displaying a slideshow powered by [Mozilla X-Tag](http://x-tags.org/). It is controllable by keyboard (with left- and rights-arrows on focus), by dragging and with the additional `<card-control>`-element.

![image](http://i60.tinypic.com/140i1pc.jpg)

**Note:** Dragging sucks at the moment. I'll fix this soon. Stay tuned!

## Installation

Installation is simply done by using Bower:

```bash
$ bower install image-card --save
```

After that include the X-Tag-Core-library, the PointerEvents-polyfill, the element's Javascript and the element's CSS into your page. That's it!

```html
…
<head>
  <link rel="stylesheet" href="bower_components/image-card/dist/styles/image-card.css">
  <script src="bower_components/pointerevents-polyfill/pointerevents.min.js"></script>
  <script src="bower_components/x-tag-core/dist/x-tag-core.js"></script>
  <script src="bower_components/image-card/dist/scripts/image-card.js"></script>
</head>
<body>
  <!-- throw in some Image Cards! -->
  …
```

## Usage

Just wrap a bunch of images into the `<image-card>`-element:

```html
<image-card>
  <img src="path/to/img-1.jpg">
  <img src="path/to/img-2.jpg">
  <img src="path/to/img-3.jpg">
</image-card>
```

Set the second image as initially visible image:

```html
<image-card current="2">
  <img src="path/to/img-1.jpg">
  <img src="path/to/img-2.jpg">
  <img src="path/to/img-3.jpg">
</image-card>
```

(Hint: counting starts at 1)

Add bullet-controls beneath the Image Card:

```html
<image-card>
  <img src="path/to/img-1.jpg">
  <img src="path/to/img-2.jpg">
  <img src="path/to/img-3.jpg">
  <card-control></card-control>
</image-card>
```

## Methods

### `prev`

Toggles the previous image unless the first image is currently visible.

### `next`

Toggles the next image unless the last image is currently visible.

## Events

### `change`

When another image is shown.

```javascript
document.getElementsByTagName('image-card')[0].addEventListener('change', function () {
  // … do something
}, false);
```

## Properties

### `current`

Index of the current image starting at one!

```javascript
// get the current Index
var current = document.getElementsByTagName('image-card')[0].current;

// set the current Index; toggle the third image
document.getElementsByTagName('image-card')[0].current = 3;
```

### `images`

Returns a Node list containing all `<img>`-elements. Getter only, can't be overwritten.

```javascript
// get all images
var images = document.getElementsByTagName('image-card')[0].images;
```

## Attributes

### `current`

Sets the index of the initially visible image; starting at one.

```html
<!--
/**
 * Initially shows the second image
 */
-->
<image-card current="2">
  <img src="path/to/img-1.jpg">
  <img src="path/to/img-2.jpg">
</image-card>
```

## Author

**Emanuel Kluge**

![Emanuel Kluge](https://2.gravatar.com/avatar/4f965f0d32998cdf5b3576241aff3929?d=https%3A%2F%2Fidenticons.github.com%2Ff84c85567eb0521955aa7e52fa14d260.png&r=x&s=120)

[Website](http://www.emanuel-kluge.de/)

[twitter](https://twitter.com/Herschel_R)

[Google+](https://plus.google.com/+EmanuelKluge)

## License

Copyright 2014 Emanuel Kluge

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the Software), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
