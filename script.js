// script.js - nav, mobile menu, popup certificates, contact actions
document.addEventListener('DOMContentLoaded', () => {
  /* NAV: smooth scroll (hover-only visual), mobile toggle */
  const navEl = document.querySelector('nav');
  const navLinks = Array.from(document.querySelectorAll('nav .nav-links a[data-section]'));
  const navLinksContainer = document.getElementById('nav-links');
  const menuBtn = document.getElementById('menu-btn');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = link.dataset.section;
      const target = document.getElementById(sec);
      if (!target) return;
      const navHeight = navEl ? navEl.offsetHeight : 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
      window.scrollTo({ top, behavior: 'smooth' });
      navLinksContainer.classList.remove('active'); // close mobile menu
    });
  });

  if (menuBtn && navLinksContainer) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinksContainer.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !menuBtn.contains(e.target)) {
        navLinksContainer.classList.remove('active');
      }
    });
  }

  /* POPUP for certificates */
  const popup = document.getElementById('image-popup');
  const popupImg = document.getElementById('popup-img');
  const closePopup = document.querySelector('.close-popup');

  document.querySelectorAll('.certificate-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img && popup && popupImg) {
        popupImg.src = img.src;
        popup.style.display = 'block';
        popup.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (closePopup) closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
  });

  if (popup) popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.style.display = 'none';
      popup.setAttribute('aria-hidden', 'true');
    }
  });

  /* CONTACT: copy phone, vCard, mailto form */
  const copyBtn = document.getElementById('copy-phone');
  const phoneLink = document.getElementById('phone-link');
  const vcardBtn = document.getElementById('download-vcard');
  const sendMailBtn = document.getElementById('send-mailto');

  if (copyBtn && phoneLink) {
    copyBtn.addEventListener('click', async () => {
      const phone = phoneLink.textContent.trim();
      try {
        await navigator.clipboard.writeText(phone);
        copyBtn.textContent = 'Copied';
        setTimeout(() => copyBtn.textContent = 'Copy', 1400);
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = phone;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); copyBtn.textContent = 'Copied'; }
        catch(e) { alert('Copy failed — please copy manually: ' + phone); }
        ta.remove();
        setTimeout(() => copyBtn.textContent = 'Copy', 1400);
      }
    });
  }

  if (vcardBtn) {
    vcardBtn.addEventListener('click', () => {
      const fullname = 'Sakura Nadira';
      const org = '—';
      const title = 'Informatics Student';
      const phone = phoneLink ? phoneLink.textContent.trim() : '+6281234567890';
      const email = 'sakuranadira5@gmail.com';
      const adr = 'Bandung;Indonesia';

      const vcardLines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${fullname}`,
        `ORG:${org}`,
        `TITLE:${title}`,
        `TEL;TYPE=CELL:${phone}`,
        `EMAIL;TYPE=INTERNET:${email}`,
        `ADR;TYPE=HOME:;;${adr}`,
        'END:VCARD'
      ];
      const vcardBlob = new Blob([vcardLines.join('\r\n')], { type: 'text/vcard' });
      const url = URL.createObjectURL(vcardBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fullname.replace(/\s+/g,'_')}.vcf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  if (sendMailBtn) {
    sendMailBtn.addEventListener('click', () => {
      const name = document.getElementById('c-name').value.trim();
      const message = document.getElementById('c-message').value.trim();
      if (!name || !message) { alert('Please fill both name and message.'); return; }
      const to = 'sakuranadira5@gmail.com';
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(message + '\n\n— sent from portfolio contact form');
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }

  /* EMAIL LINKS - Ensure they work properly */
  document.querySelectorAll('a[href^="mailto"]').forEach(emailLink => {
    emailLink.addEventListener('click', (e) => {
      // Let the default mailto: behavior work
      // This ensures email links open properly
    });
  });
});

/* TYPEWRITER */
const roles = [
  "Front End Developer",
  "UI/UX Designer",
  "Game Developer",
  "Mobile Developer"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const speed = 120;
const eraseSpeed = 60;
const delayBetween = 1500;

function typeEffect() {
  const el = document.querySelector(".typewriter-text");
  if (!el) return;

  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    // menambah huruf
    el.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeEffect, delayBetween);
      return;
    }
  } else {
    // menghapus huruf
    el.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? eraseSpeed : speed);
}

typeEffect();