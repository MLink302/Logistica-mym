/* Logística M&M — interacciones del sitio.
   El sitio se puede leer completo sin este archivo; aquí solo se agrega:
   1. Fondo del menú al bajar   2. Menú móvil
   3. Selector de servicios     4. Carrusel de clientes */

(function () {
  'use strict';

  var nav = document.getElementById('nav');

  /* 1. Menú compacto al bajar  ------------------------------------------- */
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* 2. Menú móvil --------------------------------------------------------- */
  var toggle = nav && nav.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');

  if (toggle && menu) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    // Al elegir una opción, el menú se cierra
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Si la ventana se agranda a escritorio, se cierra
    window.matchMedia('(min-width: 1140px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* 3. Selector de servicios ---------------------------------------------- */
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));

    var select = function (tab, moveFocus) {
      tabs.forEach(function (item) {
        var active = item === tab;
        var panel = document.getElementById(item.getAttribute('aria-controls'));
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        if (panel) panel.classList.toggle('is-active', active);
      });
      if (moveFocus) tab.focus();
    };

    tabs.forEach(function (tab, index) {
      tab.tabIndex = tab.classList.contains('is-active') ? 0 : -1;

      tab.addEventListener('click', function () { select(tab, false); });

      // Flechas del teclado para moverse entre servicios
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (event.key === 'Home') next = tabs[0];
        if (event.key === 'End') next = tabs[tabs.length - 1];
        if (next) {
          event.preventDefault();
          select(next, true);
        }
      });
    });
  });

  /* 4. Carrusel de clientes ----------------------------------------------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-marquee]').forEach(function (marquee) {
    var track = marquee.querySelector('.marquee__track');
    if (!track || reduceMotion) return;

    // La lista se repite tres veces para que el movimiento no tenga corte
    var originals = Array.prototype.slice.call(track.children);
    for (var copy = 0; copy < 2; copy++) {
      originals.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }
    marquee.classList.add('is-animated');
  });
})();
