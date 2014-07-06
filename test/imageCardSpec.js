describe('image-card', function () {

  var elem;

  beforeEach(function () {
    var frag = xtag.createFragment('<image-card current="2">\
      <img src="images/kitten.jpg" alt="">\
      <img src="images/murray.jpg" alt="">\
      <img src="images/city.jpg" alt="">\
    </image-card>');
    elem = frag.childNodes[0];
    document.body.appendChild(elem);
  });

  afterEach(function () {
    elem.remove();
  });

  describe('basics', function () {

    it('should be defined', function () {
      expect(ImageCard).toBeDefined();
    });

    it('should be a valid element', function () {
      expect(toString.call(elem)).toBe('[object HTMLElement]');
    });

    it('should have a tabindex', function () {
      expect(elem.tabIndex).toBe(0);
    });

    it('should have the inner elements', function () {
      expect(elem.querySelectorAll('.wrapper').length).toBe(1);
      expect(elem.querySelectorAll('.wrapper-inner').length).toBe(1);
      expect(elem.querySelectorAll('.slider').length).toBe(1);
    });

    it('should have the role-attribute', function () {
      expect(elem.getAttribute('role')).toBe('listbox');
    });

  });

  describe('#images', function () {
    it('should store the contained images in the `images`-property', function () {
      expect(elem.images).toBeDefined();
      expect(elem.images.length).toBe(3);
      expect(elem.images[0].nodeName).toBe('IMG');
    });
    it('should be read-only', function () {
      elem.images = 'foo';
      expect(elem.images).not.toBe('foo');
    });
  });

  describe('#current', function () {
    it('should have a fallback-default-value', function () {
      expect(document.createElement('image-card').current).toBe('1');
    });
    it('should be 2', function () {
      expect(elem.current).toBe('2');
    });
    it('should set new value', function () {
      elem.current = 1;
      expect(elem.current).toBe('1');
    });
    it('should fire a change-event', function () {
      var cur;
      elem.addEventListener('change', function (evnt) {
        cur = evnt.detail.current;
      }, false);
      elem.current = 3;
      expect(cur).toBe('3');
    });
  });

  describe('#prev', function () {
    it('should be defined', function () {
      expect(typeof elem.prev).toBe('function');
    });
    it('should decrease current value until first is reached', function () {
      elem.prev();
      expect(elem.current).toBe('1');
      elem.prev();
      expect(elem.current).toBe('1');
    });
    it('should trigger cycling', function () {
      spyOn(window, 'cycle');
      elem.prev();
      expect(cycle).toHaveBeenCalledWith('1');
    });
    it('should have a fluent interface', function () {
      expect(elem.prev() instanceof ImageCard).toBe(true);
    });
  });

  describe('#next', function () {
    it('should be defined', function () {
      expect(typeof elem.next).toBe('function');
    });
    it('should increase the current value until last is reached', function () {
      elem.next();
      expect(elem.current).toBe('3');
      elem.next();
      expect(elem.current).toBe('3');
    });
    it('should trigger cycling', function () {
      spyOn(window, 'cycle');
      elem.next();
      expect(cycle).toHaveBeenCalledWith('3');
    });
    it('should have a fluent interface', function () {
      expect(elem.next() instanceof ImageCard).toBe(true);
    });
  });

});