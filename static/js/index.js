document.addEventListener('DOMContentLoaded', () => {
    // DOM
    const nav = document.querySelector( '.nav' )
    const menuButton = document.querySelector( '.nav__menu__button' )
    const menuWrapper = document.querySelector( '.nav__menu__wrapper' )
    const navMenuFades = document.querySelectorAll( '.nav__menu__fade' )
    const menuButtonLine1 = document.querySelector( '.nav__menu__button__l1' )
    const menuButtonLine2 = document.querySelector( '.nav__menu__button__l2' )
    const menuButtonLine3 = document.querySelector( '.nav__menu__button__l3' )

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
                menuButtonLine1.classList.remove( 'nav__menu__button-1__open' )
                menuButtonLine1.classList.add( 'nav__menu__button-1__close' )
                menuButtonLine3.classList.remove( 'nav__menu__button-3__open' )
                menuButtonLine3.classList.add( 'nav__menu__button-3__close' )
                menuButtonLine2.classList.remove( 'nav__menu__button-2__open' )
                menuButtonLine2.classList.add( 'nav__menu__button-2__close' )
                menuOpen = false

                break
            case false:
                menuWrapper.classList.remove( 'nav__menu__wrapper__close' )
                menuWrapper.classList.add( 'nav__menu__wrapper__open' )
                navMenuFades.forEach( ( element ) => {
                    element.classList.remove( 'nav__menu__fade-out' )
                    element.classList.add( 'nav__menu__fade-in' )
                })
                menuButtonLine1.classList.remove( 'nav__menu__button-1__close' )
                menuButtonLine1.classList.add( 'nav__menu__button-1__open' )
                menuButtonLine3.classList.remove( 'nav__menu__button-3__close' )
                menuButtonLine3.classList.add( 'nav__menu__button-3__open' )
                menuButtonLine2.classList.remove( 'nav__menu__button-2__close' )
                menuButtonLine2.classList.add( 'nav__menu__button-2__open' )
                menuOpen = true

                break
        }
    }

    document.addEventListener( 'scroll', onScroll )
    menuButton.addEventListener( 'click', onMenuOpen )
})