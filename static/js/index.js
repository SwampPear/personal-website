document.addEventListener('DOMContentLoaded', () => {
    // DOM
    const nav = document.querySelector( '.nav' )

    // state
    let navVisible = false;

    document.addEventListener("scroll", (event) => {
        if ( window.scrollY >= ( window.innerHeight * 0.9 ) && !navVisible ) {
            nav.classList.add( 'nav__fade-in' )
            navVisible = true
        }
    })
})