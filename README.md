Image-Card
====

Image Card is a Custom Element for displaying a slideshow powered by [Mozilla X-Tag](http://x-tags.org/). It is controllable by keyboard (with left- and rights-arrows on focus) and with the additional `<card-control>`-element.

![image](http://i60.tinypic.com/140i1pc.jpg)

## Usage

Just wrap a bunch of images into the `<image-card>`-element:

```html
<image-card>
  <img src="path/to/img-1.jpg">
  <img src="path/to/img-2.jpg">
  <img src="path/to/img-3.jpg">
</image-card>
```

Set the second image as initially displayed image:

```html
<image-card current="2">
  <img src="path/to/img-1.jpg">
  <img src="path/to/img-2.jpg">
  <img src="path/to/img-3.jpg">
</image-card>
```

(Hint: counting starts by 1)

Add bullet-controls beneath the Image Card:

```html
<image-card>
  <img src="path/to/img-1.jpg">
  <img src="path/to/img-2.jpg">
  <img src="path/to/img-3.jpg">
  <card-control></card-control>
</image-card>
```

## License

Copyright 2014 Emanuel Kluge

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the Software), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
