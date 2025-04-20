import { Loader } from '../../../taffy/src/taffy/router'
import { setTitle } from '../../../taffy/src/taffy/meta'
import { Grid } from '../../../taffy/src/taffy/grid'
import { renderBackground } from './background'
import { renderRobot } from './robot'


const index = () => {
    console.log( 'Initializing index page.' )

    // DOM
    const nav = document.querySelector( '.nav' ) as HTMLDivElement
    if ( !nav ) return console.error( 'Can\'t locate \'.nav\'' )

    const graphicContainer = document.querySelector( '.graphic__wrapper' ) as HTMLDivElement
    if ( !graphicContainer ) return console.error( 'Can\'t locate \'.graphic__wrapper\'' )

    const about = document.querySelector( '.about' ) as HTMLDivElement
    if ( !about ) return console.error( 'Can\'t locate \'.about\'' )

    const aboutText = document.querySelector( '.about__description__container' ) as HTMLDivElement
    if ( !aboutText ) return console.error( 'Can\'t locate \'.about__description__container\'' )

    // meta
    setTitle( 'Michael Vaden' )

    // nav
    nav.classList.remove( 'tf-hidden' )
    nav.classList.add( 'tf-fade-in-from-top' )

    // robot
    renderRobot()

    setTimeout( () => {
        graphicContainer.classList.add( 'tf-fade-in-from-bottom' )
    }, 675 )

    /*
    taffy({
        targets: ['.about__description__container'],
        animate: [{
            property: 'position',

        }]
    })*/

    // about
    const aboutMinThreshold = window.innerHeight
    const aboutMaxThreshold = window.innerHeight * 2

    const aboutTextMinThreshold = aboutMinThreshold
    const aboutTextMaxThreshold = aboutMinThreshold + ( window.innerHeight / 4 )
    const aboutTextMaxOpacityThreshold = aboutMinThreshold + ( window.innerHeight / 8 )
    let aboutMaxTextBlur = 10
    let aboutMaxTextContrast = 1.2

    window.addEventListener( 'scroll', () => {
        if ( window.scrollY > aboutMinThreshold && window.scrollY < aboutMaxThreshold ) {
            about.style.position = 'fixed'
            about.style.top = '0'
        } else 
        if ( window.scrollY < aboutMinThreshold ) {
            about.style.position = 'absolute'
            about.style.top = '100vh'
        } else {
            about.style.position = 'absolute'
            about.style.top = '200vh'
        }

        if ( window.scrollY > aboutTextMinThreshold && window.scrollY < aboutTextMaxOpacityThreshold ) {
            const opacity =  ( window.scrollY - aboutTextMinThreshold ) / ( aboutTextMaxOpacityThreshold - aboutTextMinThreshold )

            aboutText.style.opacity = `${opacity}`
        }

        if ( window.scrollY > aboutTextMinThreshold && window.scrollY < aboutTextMaxThreshold ) {
            const blur =  aboutMaxTextBlur - ( window.scrollY - aboutTextMinThreshold ) / ( aboutTextMaxThreshold - aboutTextMinThreshold ) * aboutMaxTextBlur
            const contrast =  aboutMaxTextContrast - ( window.scrollY - aboutTextMinThreshold ) / ( aboutTextMaxThreshold - aboutTextMinThreshold ) * aboutMaxTextContrast

            aboutText.style.filter = `blur(${blur}px) contrast(${contrast})`
        }
    })
    
    // about image grid
    //const grid = new Grid({ containerSel: '.about__picture__wrapper' })
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
