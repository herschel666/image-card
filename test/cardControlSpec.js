describe('card-control', function () {

  var elem, ctrl;

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
  });

  describe('#buttons', function () {
    it('should have buttons-attribute', function () {
      expect(ctrl.buttons).toBeDefined();
      expect(ctrl.buttons.length).toBe(3);
      expect(ctrl.buttons[1].getAttribute('data-index')).toBe('2');
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
  });

});