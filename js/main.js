/* ==========================================================================
   Donlabs single-page app (hash router)

   Expects these to be defined elsewhere (not in this file):
     S      - list of groups: [key, title, description, [included items]]
     TEAM   - list of members: [name, role, description, photoUrl?]
     SHORT  - the short text typed out on the landing page
     timer  - global variable that holds the typewriter's setInterval id
   ========================================================================== */


/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

// Find a group in S by its key (the first item of each entry).
function get(k) {
  return S.filter(function (s) {
    return s[0] == k;
  })[0];
}


/* --------------------------------------------------------------------------
   Page templates (each returns an HTML string)
   -------------------------------------------------------------------------- */

// Home: landing, about, team and contacts, all on one scrolling page.
function home() {
  // Landing section
  var landing =
    
      '<div class="landing">' +
        '<h1>Donlabs</h1>' +
        '<p class="type" id="type"></p>' +
        '<p class="lead">Donlabs is a company with several groups: advertising, fashion, social media, software development, tennis coaching and video editing. Pick a group on the dashboard, or mix services in one project.</p>' +
        '<div><a class="btn" href="#/dashboard">Open dashboard</a></div>' +
      '</div>';
    

  //animation section
  var animation =
    '<section id="animation">' +
      '<div class="anim-container">' +
        '<video autoplay loop muted playsinline class="animation-video">' +
          '<source src="anim.mp4" type="video/mp4">' +
        '</video>' +
      '</div>' +
    '</section>';

  // About section
  var about =
    '<section id="about">' +
      '<h2>About</h2>' +
      '<p class="lead">Donlabs is based in Campo Grande, Brazil with worldwide reach. It started as a place to build software and grew into groups for advertising, fashion, social media, sports and video editing. A small team works across groups, so one client can get design, photos, video and code from the best people.</p>' +
    '</section>';

  // Team section: one card per member (m = [name, role, description, photoUrl?])
  var team =
    '<section id="team">' +
      '<h2>Team</h2>' +
      '<div class="team">' +
        TEAM.map(function (m) {
          return '<div class="member rv">' +
            '<div class="photo">' +
              (m[3]
                ? '<img src="' + m[3] + '" alt="' + m[0] + '">'
                : '<img class="ph" src="assets/images/placeholder-person.svg" alt="Photo of ' + m[0] + ' to be added">') +
            '</div>' +
            '<h3>' + m[0] + '</h3>' +
            '<p class="role">' + m[1] + '</p>' +
            '<p>' + m[2] + '</p>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</section>';

  // Contact section
  var contact =
    '<section id="contact">' +
      '<h2>Contacts</h2>' +
      '<p class="lead">Tell us what you need, which group fits and your timeline. We reply with a plan and a price.</p>' +
      '<p><a href="mailto:contact@donlabs.lat">contact@donlabs.lat</a></p>' +
    '</section>';

  return landing + animation + about + team + contact;
}

// Dashboard: a grid of tiles, one per group.
function dash() {
  return '<div class="page">' +
    '<h1>Dashboard</h1>' +
    '<p class="lead">Choose where to go.</p>' +
    '<div class="grid">' +
      S.map(function (s) {
        return '<a class="tile rv" href="#/' + s[0] + '">' +
          '<h3>' + s[1] + '</h3>' +
          '<p>' + s[2] + '</p>' +
        '</a>';
      }).join('') +
    '</div>' +
  '</div>';
}

// Group page: title, description and the list of what is included.
function sub(k) {
  var s = get(k);

  return '<div class="page">' +
    '<a class="back" href="#/dashboard">&larr; Dashboard</a>' +
    '<h1>' + s[1] + '</h1>' +
    '<p class="lead">' + s[2] + '</p>' +
    '<h2>What is included</h2>' +
    '<ul>' +
      s[3].map(function (i) {
        return '<li>' + i + '</li>';
      }).join('') +
    '</ul>' +
    '<a class="btn" href="#/contact">Ask about ' + s[1].toLowerCase() + '</a>' +
  '</div>';
}

// Services: booking form. The dropdown lists the first 6 groups only.
function svc() {
  var opts = S.slice(0, 6).map(function (s) {
    return '<option value="' + s[0] + '">' + s[1] + '</option>';
  }).join('');

  return '<div class="page">' +
    '<h1>Services</h1>' +
    '<p class="lead">Choose a service, leave your contact info and send a booking request.</p>' +
    '<form id="book">' +
      '<label>Service<select id="svc">' + opts + '</select></label>' +
      '<p class="desc" id="sd"></p>' +
      '<label>Your name<input id="nm" required autocomplete="name"></label>' +
      '<label>Email or phone<input id="ct" required autocomplete="email"></label>' +
      '<label>Details (optional)<textarea id="dt" rows="4"></textarea></label>' +
      '<div><button class="btn" type="submit">Send request</button></div>' +
      '<p class="note">This opens your email app with the request ready to send to contact@donlabs.lat.</p>' +
    '</form>' +
  '</div>';
}


/* --------------------------------------------------------------------------
   Behavior (runs after a page has been rendered)
   -------------------------------------------------------------------------- */

// Booking form: show the chosen service's description and email the request.
function bindSvc() {
  var f = document.getElementById('book');
  if (!f) return;                        // not on the Services page

  var sel = document.getElementById('svc');
  var sd = document.getElementById('sd');

  // Show the description of the selected service.
  function d() {
    sd.textContent = get(sel.value)[2];
  }
  sel.onchange = d;
  d();

  // On submit, open the user's email app with the request filled in.
  // (nm, ct and dt are the inputs with those ids, reached as globals.)
  f.onsubmit = function (e) {
    e.preventDefault();

    var s = get(sel.value)[1];
    var body = 'Service: ' + s +
      '\nName: ' + nm.value +
      '\nContact: ' + ct.value +
      '\nDetails: ' + dt.value;

    location.href = 'mailto:contact@donlabs.lat' +
      '?subject=' + encodeURIComponent('Booking request: ' + s) +
      '&body=' + encodeURIComponent(body);
  };
}

// Fade in elements marked .rv as they scroll into view.
function reveal() {
  var els = document.querySelectorAll('.rv');

  // Old browsers: just show everything.
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) {
      e.classList.add('in');
    });
    return;
  }

  var o = new IntersectionObserver(function (en) {
    en.forEach(function (x, i) {
      if (x.isIntersecting) {
        x.target.style.animationDelay = (i * 120) + 'ms';   // stagger
        x.target.classList.add('in');
        o.unobserve(x.target);                              // only once
      }
    });
  }, { threshold: .15 });

  els.forEach(function (e) {
    o.observe(e);
  });
}

// Typewriter effect for the landing page text.
function typeIt() {
  var el = document.getElementById('type');
  if (!el) return;                       // not on the home page

  clearInterval(timer);                  // stop any earlier typing

  // Respect "reduce motion": show the full text at once.
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) {
    el.textContent = SHORT;
    return;
  }

  var i = 0;
  timer = setInterval(function () {
    i++;
    el.textContent = SHORT.slice(0, i);
    if (i >= SHORT.length) clearInterval(timer);
  }, 45);
}


/* --------------------------------------------------------------------------
   Router
   -------------------------------------------------------------------------- */

// Read the URL hash, draw the matching page, then wire up its behavior.
function route() {
  var r = location.hash.replace(/^#\/?/, '');   // "#/dashboard" -> "dashboard"
  var app = document.getElementById('app');

  // Home, About and Contact all live on the home page.
  var isHome = r === '' || r === 'contact' || r === 'about';

  // Pick the page.
  app.innerHTML =
    isHome            ? home() :
    r === 'dashboard' ? dash() :
    r === 'services'  ? svc()  :
    get(r)            ? sub(r) :
                        home();   // unknown route falls back to home

  // Mark the current nav link.
  document.querySelectorAll('nav a').forEach(function (a) {
    a.toggleAttribute('aria-current', a.getAttribute('data-r') === (isHome ? '' : r));
  });

  // Scroll to the section for #/contact and #/about, otherwise to the top.
  var t = (r === 'contact' || r === 'about') && document.getElementById(r);
  if (t) t.scrollIntoView();
  else window.scrollTo(0, 0);

  typeIt();
  bindSvc();
  reveal();
}

addEventListener('hashchange', route);
route();