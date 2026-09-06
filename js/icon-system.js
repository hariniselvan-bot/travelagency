(function () {
  'use strict';

  var svgNS = 'http://www.w3.org/2000/svg';
  var symbols = {
    'i-plane': '<path d="M2 12h20M13 2l9 10-9 10M13 2v20"/>',
    'i-hotel': '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 21v-5h8v5M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01"/>',
    'i-package': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    'i-compass': '<circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6 6-2z"/>',
    'i-car': '<path d="M5 17h14l1-5-2-5H6l-2 5 1 5zM4 12h16M7 17v2m10-2v2"/><circle cx="7" cy="17" r="1"/><circle cx="17" cy="17" r="1"/>',
    'i-pin': '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    'i-calendar': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    'i-users': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    'i-swap': '<path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/>',
    'i-arrow': '<path d="M5 12h14m-7-7 7 7-7 7"/>',
    'i-tag': '<path d="m20.6 13.4-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1"/>',
    'i-check': '<path d="m20 6-11 11-5-5"/>',
    'i-headset': '<path d="M3 18v-6a9 9 0 0 1 18 0v6M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5zm18 0a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z"/>',
    'i-balloon': '<path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2C20 17.5 12 22 12 22z"/><circle cx="12" cy="10" r="3"/>',
    'i-star': '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2 1.2-6.8-5-4.9 6.9-1L12 2z"/>',
    'i-shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'i-globe': '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
    'i-dash': '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    'i-menu': '<path d="M3 6h18M3 12h18M3 18h18"/>',
    'i-close': '<path d="m6 6 12 12M18 6 6 18"/>',
    'i-plus': '<path d="M12 5v14M5 12h14"/>',
    'i-quote': '<path d="M6 18H3v-6a6 6 0 0 1 6-6v2a4 4 0 0 0-4 4h4v6h-3zm11 0h-3v-6a6 6 0 0 1 6-6v2a4 4 0 0 0-4 4h4v6h-3z"/>',
    'i-clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    'i-send': '<path d="m22 2-7 20-4-9-9-4 20-7zM22 2 11 13"/>',
    'i-facebook': '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    'i-twitter': '<path d="M23 3a10.9 10.9 0 0 1-3.1 1.5A4.5 4.5 0 0 0 12 7.6v1A10.7 10.7 0 0 1 3 4s-4 9 5 13a11.6 11.6 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.1-.8A7.7 7.7 0 0 0 23 3z"/>',
    'i-instagram': '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5"/>',
    'i-linkedin': '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    'i-phone': '<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8.1 10.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.7 2z"/>',
    'i-mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
    'i-heart': '<path d="M20.8 8.6c0 5.4-8.8 11-8.8 11S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 5.7a4.6 4.6 0 0 1 8.8 2.9z"/>',
    'i-search': '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    'i-wallet': '<path d="M20 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6"/><path d="M16 14h.01"/>',
    'i-ticket': '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4V8zM13 6v2m0 4v2m0 4v2"/>',
    'i-trash': '<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
    'i-edit': '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',
    'i-eye': '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    'i-chart': '<path d="M4 19V5m0 14h16M7 16v-4m5 4V8m5 8v-7"/>',
    'i-gear': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a2 2 0 0 0 .3 1.9l.1.1-1.4 1.4-.1-.1a2 2 0 0 0-1.9-.3 2 2 0 0 0-1.1 1.6v.4h-2v-.4a2 2 0 0 0-1.1-1.6 2 2 0 0 0-1.9.3l-.1.1-1.4-1.4.1-.1a2 2 0 0 0 .3-1.9 2 2 0 0 0-1.6-1.1H5v-2h.4a2 2 0 0 0 1.6-1.1 2 2 0 0 0-.3-1.9l-.1-.1L8 7.6l.1.1a2 2 0 0 0 1.9.3A2 2 0 0 0 11 6.4V6h2v.4a2 2 0 0 0 1.1 1.6 2 2 0 0 0 1.9-.3l.1-.1 1.4 1.4-.1.1a2 2 0 0 0-.3 1.9 2 2 0 0 0 1.6 1.1h.4v2h-.4a2 2 0 0 0-1.6 1.1z"/>',
    'i-logout': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
  };

  var defsSvg = document.createElementNS(svgNS, 'svg');
  var defs = document.createElementNS(svgNS, 'defs');
  defsSvg.className.baseVal = 'svg-defs';
  defsSvg.setAttribute('aria-hidden', 'true');
  Object.keys(symbols).forEach(function (id) {
    var symbol = document.createElementNS(svgNS, 'symbol');
    symbol.id = id;
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.setAttribute('fill', 'none');
    symbol.setAttribute('stroke', 'currentColor');
    symbol.setAttribute('stroke-width', '2');
    symbol.setAttribute('stroke-linecap', 'round');
    symbol.setAttribute('stroke-linejoin', 'round');
    symbol.innerHTML = symbols[id];
    defs.appendChild(symbol);
  });
  defsSvg.appendChild(defs);
  document.body.prepend(defsSvg);
  document.querySelectorAll('svg use[href*="sprite.svg#"]').forEach(function (use) {
    var localHref = '#' + use.getAttribute('href').split('#')[1];
    use.setAttribute('href', localHref);
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', localHref);
  });
}());
