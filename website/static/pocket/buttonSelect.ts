import ElementPrimitive from './elementPrimitive'

interface IButtonSelectOptions {
    id: string
    el: ElementPrimitive
}

class ButtonSelect {
    id: string
    el: ElementPrimitive

    constructor( id: string, options?: IButtonSelectOptions ) {
        this.id = id
        this.el = new ElementPrimitive( this.id )
    }
}

export default ButtonSelect