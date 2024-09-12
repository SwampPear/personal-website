document.addEventListener('DOMContentLoaded', () => {
    // DOM
    const nav = document.querySelector( '.nav' )
    const menuButton = document.querySelector( '.nav__menu__button' )
    const menuWrapper = document.querySelector( '.nav__menu__wrapper' )
    const navMenuFades = document.querySelectorAll( '.nav__menu__fade' )

    // state
    let navVisible = false
    let menuOpen = false

    const onScroll = () => {
        if ( window.scrollY >= ( window.innerHeight * 0.9 ) && !navVisible ) {
            nav.classList.add( 'nav__fade-in' )
            navVisible = true
        }
    }

    const onMenuOpen = () => {
        switch ( menuOpen ) {
            case true:
                menuWrapper.classList.remove( 'nav__menu__wrapper__open' )
                menuWrapper.classList.add( 'nav__menu__wrapper__close' )
                navMenuFades.forEach( ( element ) => {
                    element.classList.remove( 'nav__menu__fade-in' )
                    element.classList.add( 'nav__menu__fade-out' )
                })
                menuOpen = false

                break
            case false:
                menuWrapper.classList.remove( 'nav__menu__wrapper__close' )
                menuWrapper.classList.add( 'nav__menu__wrapper__open' )
                navMenuFades.forEach( ( element ) => {
                    element.classList.remove( 'nav__menu__fade-out' )
                    element.classList.add( 'nav__menu__fade-in' )
                })
                menuOpen = true

                break
        }
    }

    document.addEventListener( 'scroll', onScroll )
    menuButton.addEventListener( 'click', onMenuOpen )
})