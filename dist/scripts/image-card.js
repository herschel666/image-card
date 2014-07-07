/**
 * image-card - 0.2.0
 *
 * A Custom Element for an Image Card
 *
 * http://www.emanuel-kluge.de/
 *
 * Copyright (c) 2014 Emanuel Kluge;
 * Licensed MIT
 */


(function (window, xtag) {


var each = Array.prototype.forEach.call.bind(Array.prototype.forEach);
var uid = 0;

/**
 * Generates an auto-incrementing UID.
 * 
 * @return {number}
 */
function getUid() {
  return ++uid;
}

/**
 * The ImageCard's "body".
 * 
 * @type {object}
 */
var imageCardObj = Object.create({
  lifecycle: Object.create(null),
  methods: Object.create(null),
  accessors: Object.create(null),
  events: Object.create(null)
});

/**
 * Setting the dimensions of the image-card
 * by referencing the natural width and height
 * of the current image.
 */
function setDimensions() {

  var natWidth = this.images[this.current - 1].naturalWidth,
      natHeight = this.images[this.current - 1].naturalHeight;

  this.querySelector('.wrapper').style.paddingBottom = (natHeight/natWidth * 100) + '%';

  // setting the slider to the correct position
  if ( this.current > 1 ) {
    cycle.call(this, this.current - 1);
    xtag.fireEvent(this, 'change', {
      detail: {
        current: this.current
      }
    });
  }

}

/**
 * Creates a wrapper and transfers the images
 * into it. Sets `aria-hidden`-attributes.
 * 
 * @return {string} The wrapper-HTML
 */
function wrapImages() {

  var frag = xtag.createFragment('<div> \
    <div class="wrapper"> \
      <div class="wrapper-inner"> \
        <div class="slider"></div> \
      </div> \
    </div> \
  </div>');
  var slider = frag.querySelector('.slider'),
      imgs = this.images,
      i = 1,
      img;

  while ( imgs.length ) {
    img = imgs[0].cloneNode(true);
    img.setAttribute('aria-hidden', i === ~~this.current ? 'false' : 'true');
    img.setAttribute('role', 'tabpanel');
    img.tabIndex = -1;
    img.id = 'img-' + this.__id + '-' + i;
    if ( this.hasAttribute('data-card-control') ) {
      img.setAttribute('aria-labeledby', 'btn-' + this.__id + '-' + i);
    }
    slider.appendChild(img);
    imgs[0].remove();
    i += 1;
  }

  return frag.childNodes[0].innerHTML;

}

/**
 * Changes the current visible image by the given
 * index (starting with 1!)
 * 
 * @param  {string|number} cur Index of the image
 * @return undefined
 */
function cycle(cur) {

  var offset;

  if ( !this.__slider ) {
    return;
  }

  offset = cur * this.offsetWidth;

  this.__slider.style.webkitTransform = 'translateX(-' + offset + 'px) translateZ(0)';
  this.__slider.style.mozTransform = 'translateX(-' + offset + 'px) translateZ(0)';
  this.__slider.style.transform = 'translateX(-' + offset + 'px) translateZ(0)';

}

/**
 * Resets the `aria-hidden`-attribute by the
 * index of the current image.
 * 
 * @param  {number}    cur Index of the current image
 * @return {undefined}
 */
function resetAriaHidden(cur) {
  each(this.images, function (img, i) {
    img.setAttribute('aria-hidden', i === cur ? 'false' : 'true');
  });
}

/**
 * `created`-callback
 * 
 * @return undefined
 */
imageCardObj.lifecycle.created = function icCreated() {

  // set the ID (not as an attribute!)
  this.__id = 'ic-' + getUid();

  // set default current-value
  if ( !this.current ) {
    this.current = this.current || 1;
  }

  // set the role- and aria-attributes
  this.setAttribute('role', 'application');
  this.setAttribute('aria-multiselectable', 'false');

  // check if card-control is inserted
  if ( this.querySelector('card-control') ) {
    this.setAttribute('data-card-control', true);
  }

  // wrap images  
  xtag.innerHTML(this, wrapImages.call(this) + this.innerHTML);

  // setting reference to the slider
  this.__slider = this.querySelector('.slider');

  // compute dimensions referencing the current image
  if ( this.images[this.current - 1] ) {
    this.images[this.current - 1].onload = setDimensions.bind(this);
  }

  // keyboard-bindings if no card-control exists
  if ( !this.hasAttribute('data-card-control') ) {
    xtag.addEvents(this, {
      'keyup:keypass(37, 38)': this.prev.bind(this),
      'keyup:keypass(39, 40)': this.next.bind(this)
    });
  }

  // set tabindex to enable focussing if no card-control exists
  this.tabIndex = this.hasAttribute('data-card-control') ? -1 : 0;

};

/**
 * Changing image and firing `change`-event
 * when the `current`-attribute changes.
 * 
 * @param  {string} name Name of the relevant attribute
 * @param  {string} prev Previous value of the attribute
 * @param  {string} cur  Current value of the attribute
 * @return {undefined}
 */
imageCardObj.lifecycle.attributeChanged = function attributeChanged(name, prev, cur) {
  if ( name === 'current' ) {
    cycle.call(this, cur - 1);
    resetAriaHidden.call(this, cur - 1);
    xtag.fireEvent(this, 'change', {
      detail: {
        current: cur
      }
    });
  }
};

/**
 * Read-only accessors of the contained images.
 * 
 * @type {object}
 */
imageCardObj.accessors.images = {
  get: function getImages() {
    return this.getElementsByTagName('img');
  }
};

/**
 * Attribute accessor of the current image.
 * 
 * @type {object}
 */
imageCardObj.accessors.current = {
  attribute: {
    name: 'current'
  }
};

/**
 * Prevent dragging of images.
 *
 * @return undefined
 */
imageCardObj.events['dragstart:delegate(img)'] = function (evnt) {
  evnt.preventDefault();
};

/**
 * Showing the previous image.
 * 
 * @return {ImageCard} this
 */
imageCardObj.methods.prev = function prev() {
  if ( this.current > 1 ) {
    this.current = parseInt(this.current, 10) - 1;
  }
  return this;
};

/**
 * Showing the next image.
 * 
 * @return {ImageCard} this
 */
imageCardObj.methods.next = function next() {
  if ( this.current < this.images.length ) {
    this.current = parseInt(this.current, 10) + 1;
  }
  return this;
};

/**
 * Registering the <image-card>-element and exposing
 * the constructor to the global scope.
 *
 * @constructor
 */
window.ImageCard = xtag.register('image-card', imageCardObj);

/**
 * The CardControl's "body".
 * 
 * @type {object}
 */
var cardControlObj = Object.create({
  lifecycle: Object.create(null),
  accessors: Object.create(null),
  events: Object.create(null)
});

/**
 * Climb's up the DOM-tree searching for
 * an <image-card>-element.
 * 
 * @return {ImageCard|null}
 */
function getImageCard() {
  var self = this;
  while ( self.parentNode ) {
    if ( self.parentNode.nodeName === 'IMAGE-CARD' ) {
      return self.parentNode;
    }
    self = self.parentNode;
  }
  return null;
}

/**
 * Binding the parent's change-event
 *
 * @return undefined
 */
function onChange(evnt) {
  var cur = evnt.detail.current - 1;
  each(this.buttons, function (btn, i) {
    btn.classList.remove('current');
    btn.tabIndex = i === cur ? 0 : -1;
  });
  this.buttons[cur].classList.add('current');
}

/**
 * Binding click-events
 *
 * @return undefined
 */
function onClick(evnt) {
  this.__parent.current = evnt.target.getAttribute('data-index');
};

/**
 * Checking if an <image-card>-parent exists. If it
 * exists, inserting the appropriate amount of buttons
 * and binding events.
 * 
 * @return undefined
 */
cardControlObj.lifecycle.created = function ccCreated() {

  var parent = getImageCard.call(this),
      btns;

  if ( !parent ) {
    return;
  }

  this.__parent = parent;
  btns = '';
  each(parent.images, function (img, i) {
    var j = i + 1;
    btns += '<button type="button" class="btn" tabindex="' + (j === ~~parent.current ? '0' : '-1') + '"'
     + ' role="tab"'
     + ' aria-controls="img-' + parent.__id + '-' + j + '"'
     + ' id="btn-' + parent.__id + '-' + j + '"'
     + ' data-index="' + j + '">' + j + '</button>';
  });
  this.innerHTML = btns;
  this.setAttribute('role', 'tablist');
  xtag.addEvent(parent, 'change', onChange.bind(this));
  xtag.addEvent(this, 'click:delegate(button)', onClick.bind(this));

}

/**
 * Read-only accessors of the contained buttons.
 * 
 * @type {object}
 */
cardControlObj.accessors.buttons = {
  get: function getButtons() {
    return this.getElementsByTagName('button');
  }
};

/**
 * Binding event for left- and down-arrow (previous image).
 * 
 * @return {undefined}
 */
cardControlObj.events['keyup:keypass(37, 38)'] = function (evnt) {
  this.__parent.prev();
  this.buttons[this.__parent.current - 1].focus();
};

/**
 * Binding event for right- and up-arrow (next image).
 * 
 * @return {undefined}
 */
cardControlObj.events['keyup:keypass(39, 40)'] = function () {
  this.__parent.next();
  this.buttons[this.__parent.current - 1].focus();
};

/**
 * Registering the <card-control>-element and exposing
 * the constructor to the global scope.
 *
 * @constructor
 */
window.CardControl = xtag.register('card-control', cardControlObj);


})(window, xtag);