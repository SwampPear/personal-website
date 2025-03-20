import ElementPrimitive, { ElementPrimitiveProps } from './elementPrimitive'

interface InputProps {
    selector: string
    validationCallback?: ( input: Input ) => Promise<void>
}

class Input {
    private selector: string
    private input: ElementPrimitive
    private check: ElementPrimitive
    private toast: ElementPrimitive

    constructor( props: InputProps ) {
        this.selector = props.selector

        this.input = ElementPrimitive.from({ selector: `${this.selector} > .p-input` })
        this.check = ElementPrimitive.from({ selector: `${this.selector} > .p-input-check` })
        this.toast = ElementPrimitive.from({ selector: `${this.selector} > .p-input-toast` })

        this.input.addEventListener( 'focusout', () => {
            if ( this.getValue() === '' ) {
                this.deactivateCheck()
                this.setToast( '' )
            } else
            if ( props.validationCallback ) {
                props.validationCallback( this )
            }
        })

        this.setToast( '' )
    }

    getValue = () => {
        return this.input.value
    }

    setToast = ( toast: string ) => {
        this.toast.style.display = toast === '' ? 'none' : 'block'
        this.toast.textContent = toast
    }

    activateCheck = () => {
        this.check.style.display = 'block'
    }

    deactivateCheck = () => {
        this.check.style.display = 'none'
    }
}

export default Input