describe('card-control', function () {

  var elem, ctrl;

  function fireEvnt(elem, keyCode) {
    var evnt = document.createEvent('Events');
    evnt.initEvent('keyup', true, true);
    evnt.keyCode = keyCode;
    elem.dispatchEvent(evnt);
  }

  beforeEach(function () {
    var frag = xtag.createFragment('<image-card current="2">\
      <img src="images/kitten.jpg" alt="">\
      <img src="images/murray.jpg" alt="">\
      <img src="images/city.jpg" alt="">\
      <card-control></card-control>\
    </image-card>');
    elem = frag.childNodes[0];
    ctrl = elem.getElementsByTagName('card-control')[0];
    document.body.appendChild(elem);
  });

  afterEach(function () {
    elem.remove();
  });

  describe('basics', function () {
    it('should be defined', function () {
      expect(CardControl).toBeDefined();
    });
    it('should have three bullets', function () {
      expect(ctrl.getElementsByTagName('button').length).toBe(3);
    });
    it('should have image-card-parent', function () {
      expect(ctrl.__parent.nodeName).toBe(elem.nodeName);
    });
    it('should have the correct role- and aria-attributes and ID', function () {
      expect(ctrl.getAttribute('role')).toBe('tablist');
      expect(ctrl.buttons[0].getAttribute('role')).toBe('tab');
      expect(ctrl.buttons[1].getAttribute('role')).toBe('tab');
      expect(ctrl.buttons[2].getAttribute('role')).toBe('tab');
      expect(ctrl.buttons[0].getAttribute('aria-controls')).toBe('img-' + elem.__id + '-1');
      expect(ctrl.buttons[1].getAttribute('aria-controls')).toBe('img-' + elem.__id + '-2');
      expect(ctrl.buttons[2].getAttribute('aria-controls')).toBe('img-' + elem.__id + '-3');
      expect(ctrl.buttons[0].id).toBe('btn-' + elem.__id + '-1');
      expect(ctrl.buttons[1].id).toBe('btn-' + elem.__id + '-2');
      expect(ctrl.buttons[2].id).toBe('btn-' + elem.__id + '-3');
    });
  });

  describe('#buttons', function () {
    it('should have buttons-attribute', function () {
      expect(ctrl.buttons).toBeDefined();
      expect(ctrl.buttons.length).toBe(3);
      expect(ctrl.buttons[1].getAttribute('data-index')).toBe('2');
    });
    it('should have the correct tabindex', function () {
      expect(ctrl.buttons[0].tabIndex).toBe(-1);
      expect(ctrl.buttons[1].tabIndex).toBe(0);
      expect(ctrl.buttons[2].tabIndex).toBe(-1);
      elem.next();
      expect(ctrl.buttons[0].tabIndex).toBe(-1);
      expect(ctrl.buttons[1].tabIndex).toBe(-1);
      expect(ctrl.buttons[2].tabIndex).toBe(0);
    });
    it('should have current-class', function () {
      xtag.fireEvent(elem, 'change', {
        detail: {
          current: 2
        }
      });
      expect(ctrl.buttons[1].className).toContain('current');
    });
  });

  describe('events', function () {
    it('should set correct highlight', function () {
      xtag.fireEvent(ctrl.buttons[0], 'click');
      expect(ctrl.buttons[0].className).toContain('current');
      xtag.fireEvent(ctrl.buttons[1], 'click');
      expect(ctrl.buttons[0].className).not.toContain('current');
      expect(ctrl.buttons[1].className).toContain('current');
    });
    it('should control the image-card by keyboard', function () {
      fireEvnt(ctrl, 37); // left
      expect(elem.current).toBe('1');
      expect(ctrl.buttons[elem.current - 1] === document.activeElement).toBe(true);
      fireEvnt(ctrl, 39); // right
      expect(elem.current).toBe('2');
      expect(ctrl.buttons[elem.current - 1] === document.activeElement).toBe(true);
      fireEvnt(ctrl, 40); // up
      expect(elem.current).toBe('3');
      expect(ctrl.buttons[elem.current - 1] === document.activeElement).toBe(true);
      fireEvnt(ctrl, 38); // down
      expect(elem.current).toBe('2');
      expect(ctrl.buttons[elem.current - 1] === document.activeElement).toBe(true);
    });
  });

});