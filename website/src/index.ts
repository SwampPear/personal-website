import { Loader } from '../../../taffy/src/taffy/router'
import { setTitle } from '../../../taffy/src/taffy/meta'
import { Grid } from '../../../taffy/src/taffy/grid'
import { renderBackground } from './background'
import { renderRobot } from './robot'


const index = () => {
    console.log( 'Initializing index page.' )

    // DOM
    const nav = document.querySelector( '.nav' )
    const graphicContainer = document.querySelector( '.graphic__wrapper' ) as HTMLDivElement

    // visiblity for nav and graphic
    if ( nav && graphicContainer ) {
        renderRobot()
        nav.classList.remove( 'tf-hidden' )
        nav.classList.add( 'tf-fade-in-from-top' )

        setTimeout(() => {
            graphicContainer.classList.add( 'tf-fade-in-from-bottom' )
        }, 675)
    }

    // meta
    setTitle('Michael Vaden')

    // about image grid
    const grid = new Grid({ containerSel: '.about__picture__wrapper' })
}

const about = () => {
    console.log( 'Initializing about page.' )

    // DOM
    const nav = document.querySelector( '.nav' )

    // nav visibility
    if ( nav ) {
        nav.classList.remove( 'tf__hidden' )
        nav.classList.add( 'tf__visible' )
    }

    // meta
    setTitle( 'About' )
}

const shelf = () => {
    console.log( 'Initializing shelf page.' )

    // DOM
    const nav = document.querySelector( '.nav' )

    // nav visibility
    if ( nav ) {
        nav.classList.remove( 'tf__hidden' )
        nav.classList.add( 'tf__visible' )
    }

    // meta
    setTitle( 'Shelf' )
}

const main = () => {
    // loader routers
    const routes = [
        { state: '', func: index },
        { state: 'about', func: about },
        { state: 'shelf', func: shelf }
    ]

    new Loader({ routes, defaultFunc: () => {}})

    // page independent functionality
    renderBackground()
}

window.addEventListener('DOMContentLoaded', main)
