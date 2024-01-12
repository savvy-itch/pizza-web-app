const toggleBtn = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector('.close-btn');

toggleBtn.addEventListener('click', function() {
  sidebar.classList.toggle('show-sidebar');
});

closeBtn.addEventListener('click', function() {
  sidebar.classList.remove('show-sidebar');
})

document.addEventListener('click', (e) => {
  // collapse sidebar when clicked outside of it
  if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
    sidebar.classList.remove('show-sidebar');
  }
})