const navToggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.links');
const liLinks = links.querySelectorAll('li');
const showLinks = document.querySelector('.show-links');

window.addEventListener('resize', handleLinksDisplay);

navToggle.addEventListener('click', function() {
  links.classList.toggle('show-links');
  handleLinksDisplay();
});

function handleLinksDisplay() {
  
  if (window.innerWidth <= 800) {
    if (links.classList.contains('show-links')) {
      let linksHeight = 0;
      liLinks.forEach(l => linksHeight += l.getBoundingClientRect().height);
      links.style.height = linksHeight + 'px';
    } else {
      links.style.height = '0';
    }
  } else {
    links.style.height = 'auto';
  }
}