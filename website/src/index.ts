import { Loader } from './taffy/router'

/**
 * Index page.
 */
const index = () => {
    console.log( 'Initializing index page.' )
}

/**
 * About page.
 */
const about = () => {
    console.log( 'Initializing about page.' )
}

/**
 * Main.
 */
const main = () => {
    const loader = new Loader({
        routes: [
            {
                state: '',
                func: index
            },
            {
                state: 'about',
                func: about
            }
        ],
        defaultFunc: () => {}
    })
}

window.addEventListener( 'DOMContentLoaded', main )