export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  const variants = [...block.classList];

  [...block.children].forEach((row, i) => {
    // setup numbered columns
    if (variants.includes('numbered')) {
      let num = i + 1;
      if (block.className.includes('start-')) {
        num = parseInt([...block.classList]
          .filter((c) => c.startsWith('start-'))[0]
          .replace('start-', ''), 10) + i;
      }
      const col = document.createElement('div');
      col.className = 'columns-col-number';
      const number = document.createElement('p');
      number.textContent = `${num}.`;
      col.prepend(number);
      row.prepend(col);
    }

    [...row.children].forEach((col) => {
      // setup image column
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1 && !variants.includes('icon')) {
        // picture is only content in column
        col.classList.add('columns-col-img');
      }

      // setup icon column
      const icon = col.querySelector('span.icon');
      if (col.children.length === 1 && (icon || variants.includes('icon'))) {
        // icon is only content in column
        block.classList.add('icon');
        col.classList.add('columns-col-icon');
      }
    });

    // prevent img-only rows
    const imgCols = row.querySelectorAll('.columns-col-img');
    if (row.children.length === imgCols.length) {
      imgCols.forEach((col) => col.classList.remove('columns-col-img'));
    }

    // set default column widths
    if (cols.length > 1 && ![...block.classList].some((c) => c.startsWith('cols-') || c === 'icon')) {
      block.classList.add(`cols-${cols.length}`);
    }
  });

  const imgs = block.parentElement.querySelectorAll('.clickable-image');
  if (variants.includes('clickable-image')) {
    if (imgs.length) {
      if (variants.includes('clickable-image-btn')) {
        const imgs = block.parentElement.querySelectorAll('.clickable-image');
        if (imgs.length) {
          imgs.forEach((img) => {
            const anchorTags = img.querySelectorAll('.button-container a');
            anchorTags.forEach((anchorTag, idx) => {
              if (idx > 0 && variants.includes('clickable-one-btn')) {
                return;
              }
              const pictureTag = anchorTag.parentElement.parentElement.querySelector('picture');
              if (pictureTag) {
                anchorTag.innerHTML = pictureTag.outerHTML;
                anchorTag.classList.remove('button');
                pictureTag.replaceWith(anchorTag);
              }
            });
          });
        }
      } else {
        const anchorTags = imgs[0].querySelectorAll('picture + a');
        anchorTags.forEach((anchorTag) => {
          anchorTag.classList.add('clickable-image-link');
          const pictureTag = anchorTag.parentElement.querySelector('picture');
          if (pictureTag) {
            anchorTag.innerHTML = pictureTag.outerHTML;
            anchorTag.classList.remove('button');
            pictureTag.replaceWith(anchorTag);
          }
        });
      }
    }
  }

  // clickable tipsheet image
  const tipsheetLink = block.parentElement.querySelector('.clickable-tipsheet a[href*="pdf"]');
  if (tipsheetLink) {
    const pictureTag = tipsheetLink.closest('.clickable-tipsheet').querySelector('.columns-col-img picture');
    if (pictureTag) {
      const newAnchor = tipsheetLink.cloneNode(true);
      newAnchor.innerHTML = pictureTag.outerHTML;
      newAnchor.classList.remove('button');
      pictureTag.replaceWith(newAnchor);
    }
  }
}
