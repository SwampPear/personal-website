export interface Route {
    location: string,
    func: () => void
}

interface RouterProps {
    routes: Route[]
    defaultFunc: () => void
}

class Router {
    routes: Route[]
    defaultFunc: () => void

    constructor( props: RouterProps ) {
        this.routes = props.routes
        this.defaultFunc = props.defaultFunc

        this.run()
    }

    run = () => {
        const location = this.getLocation()
 
        let func = () => {}
        let match: boolean = false

        for (let i = 0; i < this.routes.length; i++ ) {
            if ( this.routes[i].location === location ) {
                func = this.routes[i].func
                match = true
                break
            }
        }

        if ( match ) {
            func()
        } else {
            this.defaultFunc()
        }
    }

    getLocation = () => {
        const url = new URL( window.location.href )
        return url.pathname.split( '/' )[1]
    }
}

export default Router