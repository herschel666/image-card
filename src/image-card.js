
/**
 * Transitionend-event name
 *
 * @const
 * @type {string}
 */
var TRANSITION_END = (function () {
  var trans = document.createElement('div').style.webkitTransition;
  return trans != undefined ? 'webkitTransitionEnd' : 'transitionend';
})();

/**
 * Drag-distance amount triggering a slidechange.
 *
 * @const
 * @type {number}
 */
var DRAG_TRIGGER_AMOUNT = 0.4;

/**
 * Default slidechange-duration
 * 
 * @type {number}
 */
var DEFAULT_DURATION = 0.15;

/**
 * `Array.each`-shortcut
 * 
 * @type {function}
 */
var each = Array.prototype.forEach.call.bind(Array.prototype.forEach);

/**
 * UID
 * 
 * @type {number}
 */
var uid = 0;

/**
 * Stores the body's pointerup-event-objects. Needed for
 * unbind the events.
 *
 * @type {object}
 */
var bodyPointerUp = null;

/**
 * Stores the image-card's pointermove-event-object. Needed
 * for unbinding the event.
 */
var dragEvent = null;

/**
 * Initial pointer offset when starting the dragging.
 *
 * @type {number}
 */
var initialOffsetX = null;

/**
 * Initial slider offset when starting the dragging.
 *
 * @type {number}
 */
var sliderX = null;

/**
 * Distance between the left edge of the page
 * and the ImageCard element.
 * 
 * @type {number}
 */
var clientLeft = null;

/**
 * Current width of the ImageCard element.
 * 
 * @type {number}
 */
var clientWidth = null;

/**
 * The ImageCard's "body".
 *
 * @private
 * @type {object}
 */
var imageCardObj = Object.create({
  lifecycle: Object.create(null),
  methods: Object.create(null),
  accessors: Object.create(null),
  events: Object.create(null)
});

/**
 * Generates an auto-incrementing UID.
 *
 * @private
 * @return {number}
 */
function getUid() {
  return ++uid;
}

/**
 * Takes a DOM element and determines the CSS
 * transform values (x, y).
 *
 * @private
 * @param  {HTMLElement} elem
 * @return {object}
 */
function getTransforms(elem) {

  var styles = getComputedStyle(elem),
      transformMatrix = styles.webkitTransform || styles.mozTransform || styles.transform,
      result = {x: 0, y: 0},
      arr;

  try {
    arr = /^matrix\(([^)]+)\)$/gi.exec(transformMatrix)[1].split(/\s?,\s?/);
  } catch (e) {
    return result;
  }

  result.x = parseInt(arr[4], 10);
  result.y = parseInt(arr[5], 10);

  return result;

}

/**
 * Setting the dimensions of the image-card
 * by referencing the natural width and height
 * of the current image.
 *
 * @private
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
 * @private
 * @return {string} The wrapper-HTML
 */
function wrapImages() {

  var frag = xtag.createFragment('<div>' +
    '<div class="wrapper">' +
      '<div class="wrapper-inner">' +
        '<div class="slider"></div>' +
      '</div>' +
    '</div>' +
  '</div>');
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
    imgs[0].parentNode.removeChild(imgs[0]);
    i += 1;
  }

  return frag.childNodes[0].innerHTML;

}

/**
 * Changes the current visible image by the given
 * index (starting with 1!)
 *
 * @private
 * @param  {string|number} cur  Index of the current image
 * @param  {string|number} prev Index of the previous image
 * @return undefined
 */
function cycle(cur, prev) {

  var prev = prev || 0,
      offset,
      duration;

  if ( !this.__slider ) {
    return;
  }

  offset = cur * this.offsetWidth;
  duration = Math.abs(cur - prev) * DEFAULT_DURATION;

  setSliderOffset.call(this, offset, duration);

}

/**
 * Sets the slider offset as CSS transforms, applies
 * the given duration-value as CSS-transition-duration.
 *
 * @private
 * @param {number} offset   The slider offset as px-value
 * @param {number} duration The slide-animation's duration in seconds
 * @return {undefined}
 */
function setSliderOffset(offset, duration) {
  xtag.requestFrame(function () {
    var duration = duration || DEFAULT_DURATION;
    this.__slider.style.webkitTransitionDuration = duration + 's';
    this.__slider.style.mozTransitionDuration = duration + 's';
    this.__slider.style.transitionDuration = duration + 's';
    this.__slider.style.webkitTransform = 'translateX(-' + offset + 'px) translateZ(0)';
    this.__slider.style.mozTransform = 'translateX(-' + offset + 'px) translateZ(0)';
    this.__slider.style.transform = 'translateX(-' + offset + 'px) translateZ(0)';
    this.__slider.addEventListener(TRANSITION_END, function () {
      this.__slider.style.webkitTransitionDuration = DEFAULT_DURATION + 's';
      this.__slider.style.mozTransitionDuration = DEFAULT_DURATION + 's';
      this.__slider.style.transitionDuration = DEFAULT_DURATION + 's';
    }.bind(this), false);
  }.bind(this));
}

/**
 * Resets the `aria-hidden`-attribute by the
 * index of the current image.
 *
 * @private
 * @param  {number}    cur Index of the current image
 * @return {undefined}
 */
function resetAriaHidden(cur) {
  each(this.images, function (img, i) {
    img.setAttribute('aria-hidden', i === cur ? 'false' : 'true');
  });
}

/**
 * Handles the dragging of the slider.
 *
 * @private
 * @param  {object} evnt The event object
 * @return {undefined}
 */
function onDragging(evnt) {
  xtag.requestFrame(function () {

    var offsetX = evnt.pageX - clientLeft,
        deltaX = Math.round(sliderX - (offsetX - initialOffsetX) * -1.3),
        direction = deltaX <= sliderX ? 'next' : 'prev',
        triggerSlideChange = Math.abs(deltaX - sliderX) > (clientWidth * DRAG_TRIGGER_AMOUNT);

    if ( triggerSlideChange ) {
      this[direction]();
      unBindDragging.call(this, false);
      return;
    }

    this.__slider.style.webkitTransform = 'translateX(' + deltaX + 'px) translateZ(0)';
    this.__slider.style.mozTransform = 'translateX(' + deltaX + 'px) translateZ(0)';
    this.__slider.style.transform = 'translateX(' + deltaX + 'px) translateZ(0)';

  }.bind(this));
}

/**
 * Unbinding all dragging-related event-bindings. Slide
 * to the current image, if `slideToCurrent` flag is set.
 *
 * @private
 * @param  {object}  evnt           The event-object
 * @param  {boolean} slideToCurrent Slide to the current image (aka no slide-change happended)
 * @return {undefined}
 */
function unBindDragging(evnt, slideToCurrent) {

  var slideToCurrent = slideToCurrent === undefined || slideToCurrent;

  initialOffsetX = null;
  sliderX = null;
  clientLeft = null;
  clientWidth = null;

  // Already unbound everything
  if ( !bodyPointerUp ) {
    return;
  }

  xtag.removeEvent(document.body, bodyPointerUp);
  bodyPointerUp = null;
  xtag.removeEvent(this, dragEvent);
  dragEvent = null;

  if ( slideToCurrent ) {
    cycle.call(this, this.current - 1, ~~this.current);
  }

}

/**
 * `created`-callback
 * 
 * @return {undefined}
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
    cycle.call(this, cur - 1, prev - 1);
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
 * @return {undefined}
 */
imageCardObj.events['dragstart:delegate(img)'] = function (evnt) {
  evnt.preventDefault();
};

/**
 * Binds the relevant events for dragging functionality
 * on `mousedown`.
 *
 * @param  {object}    evnt The event-object
 * @return {undefined}
 */
imageCardObj.events.mousedown = function (evnt) {

  clientLeft = this.getBoundingClientRect().left;
  clientWidth = this.offsetWidth;
  initialOffsetX = evnt.pageX - clientLeft;
  sliderX = getTransforms(this.__slider).x;
  bodyPointerUp = xtag.addEvent(document.body, 'mouseup', unBindDragging.bind(this));
  dragEvent = xtag.addEvent(this, 'mousemove', onDragging.bind(this));

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
 * @private
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
 * @private
 * @param  {object}    evnt The event-object
 * @return {undefined}
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
 * @private
 * @param  {object}    evnt The event-object
 * @return {undefined}
 */
function onClick(evnt) {
  this.__parent.current = evnt.target.getAttribute('data-index');
};

/**
 * Checking if an <image-card>-parent exists. If it
 * exists, inserting the appropriate amount of buttons
 * and binding events.
 * 
 * @return {undefined}
 */
cardControlObj.lifecycle.created = function ccCreated() {

  var parent = getImageCard.call(this),
      btns;

  if ( !parent || !parent.__id ) {
    return;
  }

  this.__parent = parent;
  btns = '';

  xtag.addEvent(parent, 'change', onChange.bind(this));
  xtag.addEvent(this, 'click:delegate(button)', onClick.bind(this));

  each(parent.images, function (img, i) {
    var j = i + 1,
        currentBtn = j === ~~parent.current,
        currentClass = currentBtn ? ' current' : '',
        tabIndx = currentBtn ? '0' : '-1';
    btns += '<button type="button"' +
      ' class="btn' + currentClass + '"' +
      ' tabindex="' + tabIndx + '"' +
      ' role="tab"' +
      ' aria-controls="img-' + parent.__id + '-' + j + '"' +
      ' id="btn-' + parent.__id + '-' + j + '"' +
      ' data-index="' + j + '">' + j + '</button>';
  });
  
  this.innerHTML = btns;
  this.setAttribute('role', 'tablist');

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
