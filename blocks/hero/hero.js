import {
    getMetadata,
    loadBlock,
    decorateBlock,
    loadScript,
  } from '../../scripts/lib-franklin.js';
  import { validateBrightcove, buildVideoBlock } from '../../scripts/scripts.js';
  
  function buildBannerOverlay(block) {
    const overlay = document.createElement('div');
    overlay.className = 'hero-banner-img-overlay';
    block.querySelector('.hero-banner-img').prepend(overlay);
  }
  
  function buildCrumb(text, link) {
    const li = document.createElement('li');
    if (link) li.innerHTML = `<a href="${link}">${text}</a>`;
    else li.textContent = text;
    return li;
  }
  
  async function buildBreadcrumb(block) {
    block.closest('.section').classList.add('hero-dark-container');
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'hero-breadcrumb';
    const ol = document.createElement('ol');
    breadcrumb.append(ol);
    const banner = block.querySelector('.hero-banner');
    banner.after(breadcrumb);
    // fetch header navigation
    const navMeta = getMetadata('nav');
    const navPath = navMeta ? new URL(navMeta).pathname : '/global/nav';
    const resp = await fetch(`${navPath}.plain.html`);
    if (resp.ok) {
      const temp = document.createElement('div');
      temp.innerHTML = await resp.text();
      const navLinks = [...temp.querySelectorAll(':scope > div ul a[href]')];
      const matches = [];
      let path = window.location.pathname;
      // find current page matches in navigation
      for (let i = 0; i < path.split('/').length; i += 1) {
        // eslint-disable-next-line no-loop-func
        const match = navLinks.find((link) => {
          const { pathname } = new URL(link);
          return pathname === path;
        });
        if (match) matches.unshift(match);
        path = path.split('/').slice(0, -1).join('/') || '/';
      }
      if (matches.length) {
        matches.forEach((match) => {
          // check if match is nested in header navigation
          if (match.closest('li > ul')) {
            const containingCrumb = buildCrumb(match.closest('li > ul').closest('li').firstChild.textContent.trim());
            ol.append(containingCrumb);
          }
          const crumb = buildCrumb(match.textContent, match.href);
          if (match.href === window.location.href) crumb.querySelector('a').setAttribute('aria-current', 'page');
          ol.append(crumb);
        });
      } else {
        // if current page is not in header navigation, build single current-page crumb
        const crumb = buildCrumb(getMetadata('short-title') || document.querySelector('h1').textContent, window.location);
        crumb.querySelector('a').setAttribute('aria-current', 'page');
        ol.append(crumb);
      }
    }
  }
  
  function decorateData(block) {
    const callout = block.querySelector('.hero-banner-callout');
    if (callout) {
      const icon = callout.querySelector('.icon, picture');
      if (icon && icon.parentElement) icon.parentElement.className = 'data-icon';
    }
  }
  
  function decorateTestimonial(block) {
    const callout = block.querySelector('.hero-banner-callout');
    if (callout) {
      const quotations = callout.querySelectorAll('h2');
      if (quotations) {
        const attr = [...callout.children].filter((c) => ![...quotations].includes(c));
        const figure = document.createElement('figure');
        const blockquote = document.createElement('blockquote');
        quotations.forEach((q) => {
          const p = document.createElement('p');
          p.innerHTML = q.innerHTML;
          q.remove();
          blockquote.append(p);
        });
        figure.append(blockquote);
        if (attr.length) {
          const caption = document.createElement('figcaption');
          caption.append(...attr);
          figure.append(caption);
        }
        callout.append(figure);
      }
    }
  }
  
  function decorateTextOverlay(block) {
    buildBannerOverlay(block);
    block.closest('.section').classList.add('hero-text-overlay-container');
  }
  
  function decorateSplit(block, variants) {
    block.closest('.section').classList.add('hero-split-container');
    if (!variants.includes('inset')) block.closest('.section').classList.add('hero-dark-container');
  }
  
  function loadVideoScript(block, account, type) {
    loadScript(`https://players.brightcove.net/${account}/${type}/index.min.js`).then(() => {
      // eslint-disable-next-line no-undef, func-names
      const desktop = block.querySelector('#hero-video-desktop');
      if (desktop) {
        // eslint-disable-next-line no-undef, func-names
        videojs.getPlayer('hero-video-desktop').ready(function () {
          const desktopVideo = this;
          desktopVideo.muted(true);
          desktopVideo.on('loadedmetadata', () => desktopVideo.play());
          desktopVideo.on('ended', () => desktopVideo.play());
        });
      }
      const mobile = block.querySelector('#hero-video-mobile');
      if (mobile) {
        // eslint-disable-next-line no-undef, func-names
        videojs.getPlayer('hero-video-mobile').ready(function () {
          const mobileVideo = this;
          mobileVideo.muted(true);
          mobileVideo.on('loadedmetadata', () => mobileVideo.play());
          mobileVideo.on('ended', () => mobileVideo.play());
        });
      }
    });
  }
  
  function decorateBackgroundVideo(block, links) {
    const views = ['desktop', 'mobile'];
    let videoAccount;
    let videoType;
    links.forEach((link, i) => {
      const { pathname, searchParams } = new URL(link.href);
      const id = searchParams.get('videoId');
      const [, account, type] = pathname.split('/');
      if (!videoAccount) videoAccount = account;
      if (!videoType) videoType = type;
      const [player, embed] = type.split('_');
      const video = document.createElement('video-js');
      video.id = `hero-video-${views[i]}`;
      video.className = links.length > 1 ? `hero-video-${views[i]}` : 'hero-video';
      video.dataset.account = account;
      video.dataset.embed = embed || 'default';
      video.dataset.player = player;
      video.autoplay = true;
      video.controls = true;
      video.loop = true;
      video.playsinline = true;
      video.setAttribute('data-video-id', id);
      video.setAttribute('width', 400);
      video.setAttribute('height', 200);
      if (link.parentElement && link.parentElement.nodeName === 'P') link.parentElement.replaceWith(video);
      else link.replaceWith(video);
    });
  
    const img = block.querySelector('img');
    if (img.complete) {
      loadVideoScript(block, videoAccount, videoType);
    } else {
      img.addEventListener('load', () => loadVideoScript(block, videoAccount, videoType));
    }
  }
  
  async function decorateInlineVideo(block, a) {
    buildVideoBlock(a, true);
    const video = block.querySelector('.video');
    if (video) {
      decorateBlock(block.querySelector('.video'));
      await loadBlock(block.querySelector('.video'));
    }
  }
  
  function decorateQuote(block) {
    const quote = block.querySelector('.hero-body p:last-of-type');
    quote.classList.add('quote-text');
  
    if (quote.innerText.startsWith('"') || quote.innerText.startsWith('“')) {
      quote.innerText = quote.innerText.substring(1);
    }
  }
  
  function decorateFrosted(block) {
    const container = document.createElement('div');
    container.classList.add('pane-container');
    container.innerHTML = '<div class="frosted-pane"></div>';
    block.append(container);
  }
  
  export default function decorate(block) {
    const variants = [...block.classList];
  
    const containedHeroes = ['inset'];
    const fullWidthHero = variants.every((v) => !containedHeroes.includes(v));
    if (fullWidthHero) {
      block.closest('.section').classList.add('hero-full-width-container');
    }
    block.querySelector('img').setAttribute('fetchpriority', 'high');
    // decorate rows
    const rows = [...block.children];
    const rowSections = ['banner', 'body'];
    rows.forEach((row, i) => {
      if (rowSections[i]) row.className = `hero-${rowSections[i]}`;
      if (rowSections[i] === 'banner') {
        // decorate banner
        const bannerSections = ['img', 'callout'];
        [...row.children].forEach((col, j) => {
          if (rowSections[j]) col.className = `hero-banner-${bannerSections[j]}`;
          if (bannerSections[j] === 'img' && col.children.length > 1) {
            // decorate brightcove video
            const as = col.querySelectorAll('a[href*=brightcove]');
            if (as.length && [...as].every((a) => validateBrightcove(a.href))) {
              decorateBackgroundVideo(block, as);
            } else {
              // decorate banner caption
              const caption = document.createElement('div');
              caption.className = 'hero-banner-caption';
              [...col.children].forEach((child) => {
                if (!child.querySelector('img')) caption.append(child);
              });
              if (fullWidthHero) buildBannerOverlay(block);
              row.append(caption);
            }
          }
        });
        // remove empty callout
        const callout = row.querySelector('.hero-banner-callout');
        if (callout && !callout.hasChildNodes()) callout.remove();
        else if (callout) block.closest('.section').classList.add('hero-callout-container');
      } else if (rowSections[i] === 'body') {
        // decorate brightcove video
        const a = row.querySelector('a[href*=brightcove]');
        if (a && validateBrightcove(a.href)) {
          decorateInlineVideo(block, a);
        }
      }
    });
  
    // if block has variants, decorate card with variant specifics
    if (variants.length > 2) {
      if (variants.includes('breadcrumb')) buildBreadcrumb(block);
      if (variants.includes('data')) decorateData(block);
      if (variants.includes('testimonial')) decorateTestimonial(block);
      if (variants.includes('text-overlay')) decorateTextOverlay(block);
      if (variants.includes('split')) decorateSplit(block, variants);
      if (variants.includes('quote')) decorateQuote(block);
      if (variants.includes('frosted-purple')) decorateFrosted(block);
    } else block.closest('.section').classList.add('hero-dark-container');
  
    // if heading has emphasized text, unbold the rest
    const headings = block.querySelectorAll('h1,h2,h3,h4,h5,h6');
    headings.forEach((heading) => {
      if (!heading.querySelector('strong em')) return;
  
      heading.classList.add('partial-emphasis');
    });
  }
  