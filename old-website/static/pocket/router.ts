interface IRoute {
    path: string,
    func: () => void
}

interface IRouterProps {
    routes: IRoute[]
}

class Router {
    routes: IRoute[]

    constructor( props: IRouterProps ) {
        this.routes = props.routes

        this.initRoute()
    }

    initRoute = () => {
        const path = this.getPath()
        let func: () => void

        this.routes.forEach( route => {
            if ( route.path === path ) {
                func = route.func
                document.addEventListener( 'DOMContentLoaded', func)

                return
            }
        })
    }

    getPath = () => {
        return window.location.href
    }
}

export default Router