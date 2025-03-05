class ElementPrimitive extends Element {
    sel: string
    el: Element | null
    style: any
    value: any
    
    constructor( sel: string ) {
        super()

        this.sel = sel
        this.el = document.querySelector( this.sel )
    }
}

export default ElementPrimitive