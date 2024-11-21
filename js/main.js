$(document).ready(function(){
    $('.buttons').on('click', function(event) {
        if(this.hash !== "") {
            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                window.location.hash = hash;
            });
        }
    });
});
function toggleMenu() {
    const menu = document.getElementById('titleBarButtons');
    const hamMenu = document.querySelector('.hamMenuToggle');
    menu.classList.toggle('visible');
    hamMenu.classList.toggle('active');
}
