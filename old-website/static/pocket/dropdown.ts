import ElementPrimitive from './elementPrimitive'

interface IDropdownOptions {
    id: string
    el: ElementPrimitive
}

class Dropdown {
    id: string
    el: ElementPrimitive

    constructor( id: string, options?: IDropdownOptions ) {
        this.id = id
        this.el = new ElementPrimitive( this.id )
    }
}

export default Dropdown