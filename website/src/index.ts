import { Loader } from '../../../taffy/src/taffy/router'
import { setTitle } from '../../../taffy/src/taffy/meta'
import { renderBackground } from './background'
import { renderRobot } from './robot'

const easeInOutCubic = ( x: number ): number => {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

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

    const waterBackground = document.querySelector( '.background__water' ) as HTMLDivElement
    if ( !waterBackground ) return console.error( 'Can\'t locate \'.background__water\'' )

    const experienceCards = document.querySelectorAll( '.experience__card' )
    if ( !experienceCards ) return console.error( 'Can\'t locate \'.background__water\'' )

    const imageContainer = document.querySelector( '.about__images__container' ) as HTMLDivElement
    if ( !imageContainer ) return console.error( 'Can\'t locate \'.about__images__container\'' )

    const image = document.querySelector( '.about__image' ) as HTMLDivElement
    if ( !image ) return console.error( 'Can\'t locate \'.about__image\'' )

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
    const aboutMin = window.innerHeight
    const aboutMax = window.innerHeight * 3

    const aboutTextMin = aboutMin
    const aboutTextMax = aboutMin + ( window.innerHeight / 2 )
    let aboutBlurMax = 12

    // water background
    const waterBackgroundMin = window.innerHeight * 2
    const waterBackgroundMax = window.innerHeight * 3

    // image
    const imageExpand1Min = window.innerHeight
    const imageExpand1Max = imageExpand1Min + ( window.innerHeight / 2 )
    const imageExpand2Max = imageExpand1Min * 2

    window.addEventListener( 'scroll', () => {
        if ( window.scrollY < imageExpand1Min ) {
            image.style.height = '0px'
            image.style.width = '0px'
        } else
        if ( window.scrollY > imageExpand1Min && window.scrollY < imageExpand1Max ) {
            const imageSize = imageContainer.getBoundingClientRect().height

            const w = easeInOutCubic(( window.scrollY - imageExpand1Min ) / ( imageExpand1Max - imageExpand1Min )) * imageSize
            const h = easeInOutCubic(( window.scrollY - imageExpand1Min ) / ( imageExpand1Max - imageExpand1Min )) * 10

            image.style.height = `${h}px`
            image.style.width = `${w}px`
        } else
        if ( window.scrollY > imageExpand1Max && window.scrollY < imageExpand2Max ) {
            const imageSize = imageContainer.getBoundingClientRect().height

            const h = (easeInOutCubic(( window.scrollY - imageExpand1Max ) / ( imageExpand2Max - imageExpand1Max )) *  ( imageSize - 10 )) + 10

            image.style.height = `${h}px`
            image.style.width = `${imageSize}px`
        } else {
            const imageSize = imageContainer.getBoundingClientRect().height

            image.style.height = `${imageSize}px`
            image.style.width = `${imageSize}px`
        }

        if ( window.scrollY > aboutMin && window.scrollY < aboutMax ) {
            about.style.position = 'fixed'
            about.style.top = '0'
        }

        if ( window.scrollY > aboutMin && window.scrollY < aboutMax ) {
            about.style.position = 'fixed'
            about.style.top = '0'
        } else 
        if ( window.scrollY < aboutMin ) {
            about.style.position = 'absolute'
            about.style.top = '100vh'
        } else {
            about.style.position = 'absolute'
            about.style.top = '300vh'
        }

        if ( window.scrollY > aboutTextMin && window.scrollY < aboutTextMax ) {
            const blur =  easeInOutCubic( 1 - ( window.scrollY - aboutTextMin ) / ( aboutTextMax - aboutTextMin )) * aboutBlurMax
            const opacity =  easeInOutCubic(( window.scrollY - aboutTextMin ) / ( aboutTextMax - aboutTextMin ))

            console.log(blur)

            aboutText.style.filter = `blur(${blur}px)`
            aboutText.style.opacity = `${opacity}`
        } else
        if ( window.scrollY < aboutMin ) {
            aboutText.style.filter = `blur(12px)`
            aboutText.style.opacity = `0`
        } else {
            aboutText.style.filter = `blur(0px)`
            aboutText.style.opacity = `1`
        }

        if ( window.scrollY > aboutMin && window.scrollY < aboutMax ) {
            about.style.position = 'fixed'
            about.style.top = '0'
        } else 
        if ( window.scrollY < aboutMin ) {
            about.style.position = 'absolute'
            about.style.top = '100vh'
        } else {
            about.style.position = 'absolute'
            about.style.top = '300vh'
        }

        if ( window.scrollY > waterBackgroundMin && window.scrollY < waterBackgroundMax ) {
            const opacity =  easeInOutCubic(( window.scrollY - waterBackgroundMin ) / ( waterBackgroundMax - waterBackgroundMin ))

            waterBackground.style.opacity = `${opacity}`
        } else
        if ( window.scrollY < waterBackgroundMin ) {
            waterBackground.style.opacity = `0`
        } else {
            waterBackground.style.opacity = `1`
        }
    })

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate')
            // Optional: unobserve if you only want it to happen once
            observer.unobserve(entry.target)
          }
        })
    })
      
    experienceCards.forEach(el => observer.observe(el))
    
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

    // caustic ripple backgrounds
    renderBackground( '.background__fire > canvas', 'vec3(0.275, 0.105, 0.105)')
    renderBackground( '.background__water > canvas', 'vec3(0.105, 0.105, 0.275)' )
}

window.addEventListener('DOMContentLoaded', main)
