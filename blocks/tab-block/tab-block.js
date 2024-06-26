export default function decorate(block) {
  const header = block.querySelector('.tab-block > div:first-child');
  const content = block.querySelector('.tab-block > div:nth-child(2)');

  header.classList.add('tabs');
  header.querySelector('div:first-child').classList.add('active');
  content.setAttribute('id', 'panels');
  content.querySelector('div:first-child').classList.add('active');

  const allHeads = header.querySelectorAll('div');
  const allPanels = content.querySelectorAll('div');


  

  allHeads.forEach((div, index) => {
    div.classList.add('tab');

    div.addEventListener('click', function (event) {
      header.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      content.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));

      div.classList.add('active');
      allPanels[index].classList.add('active');
    });
  });

  allPanels.forEach((div, index) => {
    div.classList.add('panel');
    div.classList.add(`panel-${index + 1}`);

    const panelChildren = div.children;

    for (let i = 0; i < panelChildren.length; i++) {
      panelChildren[i].classList.add(`child-${i + 1}`);
    }
  });

  const Container1 = document.createElement('div');
  const Container2 = document.createElement('div');
  const child3 = block.querySelector('.panel-1 .child-3');
  const child4 = block.querySelector('.panel-1 .child-4');
  const child5 = block.querySelector('.panel-1 .child-5');
  const child6 = block.querySelector('.panel-1 .child-6');

  Container2.appendChild(child4);
  Container2.appendChild(child5);
  Container2.appendChild(child6);

  Container1.appendChild(child3);
  Container1.appendChild(Container2);

  Container1.classList.add('co-pay');

  const child2Container = document.querySelector('.child-2');
  child2Container.parentNode.insertBefore(Container1, child2Container.nextSibling);
}

// Find all <a> tags within the tab-block div
var aTags = document.querySelectorAll('div.tab-block a');

// Iterate over each <a> tag
aTags.forEach(function(aTag) {
    // Get the URL from the href attribute of the <a> tag
    var imageUrl = aTag.getAttribute('href');

    // Create an image element
    var img = document.createElement('img');

    // Set the src attribute of the image to the URL
    img.src = imageUrl;

    // Replace the <a> tag with the image
    aTag.parentNode.replaceChild(img, aTag);
});
