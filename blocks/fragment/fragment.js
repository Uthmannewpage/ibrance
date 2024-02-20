/*
 * Fragment Block
 * Include content from one Helix page in another.
 * https://www.hlx.live/developer/block-collection/fragment
 */

import { decorateMain } from '../../scripts/scripts.js';
import { loadBlocks } from '../../scripts/lib-franklin.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
async function loadFragment(path) {
  if (path.startsWith('http')) {
    const { origin, pathname } = new URL(path);
    // eslint-disable-next-line no-param-reassign
    if (origin === window.location.origin) path = pathname;
  }
  if (path && path.startsWith('/')) {
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();
      await decorateMain(main, true);
      await loadBlocks(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(':scope .section');
    if (fragmentSection) {
      const blockSection = block.closest('.section');
      if (blockSection) {
        blockSection.classList.add(...fragmentSection.classList);
      }
      const fragmentWrapper = block.closest('.fragment-wrapper');
      if (fragmentWrapper) {
        block.closest('.fragment-wrapper').replaceWith(...fragmentSection.childNodes);
      } else {
        block.replaceWith(...fragmentSection.childNodes);
      }
    }
  }
}
