export interface IRoute {
    state: string,
    func: () => void
}

interface IRouterProps {
    routes: IRoute[]
}

class Router {
    routes: IRoute[]

    constructor( props: IRouterProps ) {
        this.routes = props.routes
    }

    route = () => {

    }
}

export default Router