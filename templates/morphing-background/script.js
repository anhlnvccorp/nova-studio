// File#: _1_morphing-background
// Usage: codyhouse.co/license
(function() {
  var MorphBg = function(element) {
    this.element = element;
    this.wrapper = this.element.closest('.js-morph-bg-wrapper');
    this.elementId = this.element.getAttribute('id');
    this.targets = document.querySelectorAll('[data-morph-bg="'+this.elementId+'"]');
    this.bgTargets = [];
    this.action = this.element.getAttribute('data-morph-bg-event');
    this.targetIndex = false;
    this.defaultIndex = false;
    if(!this.action) this.action = 'click';
    initMorphBg(this);
  };

  function initMorphBg(element) {
    getBgTargets(element);
    setInitialState(element);
    if(element.action == 'click') {
      initClickEvent(element);
    } else {
      initHoverEvent(element);
    }
    window.addEventListener('update-morphbg', function(){
      morphBgResize(element);
    });
    window.addEventListener('hide-morphbg', function(){
      morphBgHide(element);
    });
  }

  function getBgTargets(element) {
    for(var i = 0; i < element.targets.length; i++) {
      var bgTarget = element.targets[i].querySelector('[data-morph-bg-target]') || element.targets[i];
      element.bgTargets.push(bgTarget);
    }
  }

  function setInitialState(element) {
    for(var i = 0; i < element.targets.length; i++) {
      if(element.targets[i].hasAttribute('data-morph-bg-active')) {
        setPosition(element, i);
        element.defaultIndex = i;
        break;
      }
    }
  }

  function initClickEvent(element) {
    for(var i = 0; i < element.targets.length; i++) {
      (function(i){
        element.targets[i].addEventListener('click', function(event){
          setPosition(element, i);
        });
      })(i);
    }
  }

  function initHoverEvent(element) {
    for(var i = 0; i < element.targets.length; i++) {
      (function(i){
        element.targets[i].addEventListener('mouseenter', function(event){
          setPosition(element, i);
        });
        element.targets[i].addEventListener('mouseleave', function(event){
          resetBgPosition(element, event);
        });
      })(i);
    }
    var preserveWrapper = element.targets[0] ? element.targets[0].closest('[data-morph-bg-preserve]') : null;
    if(preserveWrapper) {
      preserveWrapper.addEventListener('mouseleave', function(event){
        resetBgPosition(element, event);
      });
    }
  }

  function setPosition(element, index) {
    var targetInfo = element.bgTargets[index].getBoundingClientRect(),
      targetRadius = getComputedStyle(element.bgTargets[index]).borderRadius;
    var wrapperInfo = element.wrapper.getBoundingClientRect();
    element.element.style.transform = 'translateX('+(targetInfo.left - wrapperInfo.left)+'px) translateY('+(targetInfo.top - wrapperInfo.top)+'px) translateZ(-0.1px)';
    element.element.style.height = targetInfo.height+'px';
    element.element.style.width = targetInfo.width+'px';
    element.element.style.borderRadius = targetRadius;
    element.element.classList.add('morph-bg--visible');
    setTimeout(function(){
      if(!element.element.classList.contains('morph-bg--has-transition')) element.element.classList.add('morph-bg--has-transition');
    }, 10);
    element.targetIndex = index;
  }

  function resetBgPosition(element, event) {
    if(event.relatedTarget && (event.relatedTarget.closest('[data-morph-bg="'+element.elementId+'"]') || event.relatedTarget.closest('[data-morph-bg-preserve]'))) {
      return;
    }
    if(element.defaultIndex !== false) {
      element.targetIndex = element.defaultIndex;
      setPosition(element, element.targetIndex);
      return;
    }
    element.element.classList.remove('morph-bg--visible', 'morph-bg--has-transition');
    element.targetIndex = false;
  }

  function morphBgResize(element) {
    if(element.targetIndex === false) return;
    setPosition(element, element.targetIndex);
    element.element.style.display = '';
  }

  function morphBgHide(element) {
    element.element.style.display = 'none';
  }

  window.MorphBg = MorphBg;

  var morphBg = document.getElementsByClassName('js-morph-bg');
  if( morphBg.length > 0 ) {
    for( var i = 0; i < morphBg.length; i++) {
      (function(i){new MorphBg(morphBg[i]);})(i);
    }
  }

  var resizingId = false,
    customEventMorph = new CustomEvent('update-morphbg'),
    customEventHide = new CustomEvent('hide-morphbg');

  window.addEventListener('resize', function() {
    if(!resizingId) doneResizing(customEventHide);
    clearTimeout(resizingId);
    resizingId = setTimeout(function(){
      doneResizing(customEventMorph);
      resizingId = false;
    }, 100);
  });

  if(document.fonts) {
    document.fonts.onloadingdone = function (fontFaceSetEvent) {
      doneResizing(customEventMorph);
    };
    document.fonts.ready.then(function() {
      setTimeout(function(){
        doneResizing(customEventMorph);
      }, 300);
    });
  }

  function doneResizing(customEvent) {
    window.dispatchEvent(customEvent);
  }
}());
