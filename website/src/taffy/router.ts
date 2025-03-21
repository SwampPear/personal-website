/**
 * Function corresponding to URL state
 * @param state - Current URL state
 * @param func - Script to execute
 * @param preLoad - Script to execute before route is switched
 */
export interface IRoute {
    state: string
    func: () => void
    preLoad?: () => void
}

/**
 * Options for Router
 */
interface IRouterProps {
    routes: IRoute[]
    defaultFunc: () => void
}

/**
 * Manages script execution based on URL state
 */
class Router {
    routes: IRoute[]
    defaultFunc: () => void

    /**
     * Initializes Router and executes the matching script
     * @param props - Router configuration
     */
    constructor ( props: IRouterProps ) {
        this.routes = props.routes
        this.defaultFunc = props.defaultFunc
        this.run()
    }

    /**
     * Executes the script corresponding to the current URL state
     * Logs errors if execution fails
     */
    run = () => {
        try {
            this.routes.find( route => route.state === this.getLocation() )?.func() || this.defaultFunc()
        } catch ( error ) {
            console.error( 'Router execution error:', error )
        }
    }

    /**
     * Retrieves the current URL state
     * @returns The first path segment of the URL
     */
    getLocation = (): string => {
        return new URL( window.location.href ).pathname.split( '/' )[1] || ''
    }
}

/**
 * Options for Loader
 */
interface ILoaderProps {
    routes: IRoute[]
    defaultFunc: () => void
}

/**
 * Asynchronously manages script execution based on URL state with dynamic reload
 */
class Loader {
    router: Router

    /**
     * Initializes Loader and executes the matching script
     * @param props - Loader configuration
     */
    constructor ( props: ILoaderProps ) {
        this.router = new Router({
            routes: props.routes,
            defaultFunc: props.defaultFunc
        })

        this.initLinks()

        window.onpopstate = () => this.run()
    }

    /**
     * Updates the URL state and executes the corresponding script without reloading
     * @param state - New state to set in the URL
     */
    navigate = ( state: string ) => {
        history.pushState( {}, '', `/${state}` )
        this.run()
    }

    /**
     * Executes the script corresponding to the current URL state
     */
    run = () => {
        this.router.run()
    }

    /**
     * Refreshes asynchronous links
     */
    initLinks = () => {
        const links  = document.querySelectorAll( 'a' ) as NodeListOf<HTMLAnchorElement>

        links.forEach( link => {
            if ( link.hasAttribute( 'data-href' )) {
                link.addEventListener( 'click', ( event: MouseEvent ) => {
                    event.preventDefault()

                    const href = link.getAttribute( 'data-href' ) as string

                    this.navigate( href )
                })
            }
        })
    }
}

export { Router, Loader }