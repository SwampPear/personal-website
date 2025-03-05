export interface ElementPrimitiveProps {
    selector: string
}

class ElementPrimitive extends HTMLElement {
    selector: string
    style: any
    value: any
    selectionStart: any
    selectionEnd: any

    static from( props: ElementPrimitiveProps ): ElementPrimitive {
        const el = document.querySelector( props.selector ) as ElementPrimitive
        if ( el ) el.selector = props.selector

        return el
    }
    
    constructor( props: ElementPrimitiveProps ) {
        super()

        this.selector = props.selector
    }
}


export default ElementPrimitive