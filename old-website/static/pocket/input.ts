import ElementPrimitive from './elementPrimitive'

interface IInputOptions {
    sel: string
    validationCallback?: ( input: Input ) => Promise<void>
}

export class Input {
    sel: string
    el: ElementPrimitive
    input: ElementPrimitive
    check: ElementPrimitive
    toast: ElementPrimitive
    checkActive = false

    constructor( props: IInputOptions ) {
        this.sel = props.sel
        this.el = new ElementPrimitive( this.sel )

        this.input = new ElementPrimitive( `${this.el.sel} > .form__input` )
        this.check = new ElementPrimitive( `${this.el.sel} > .form__input__check` )
        this.toast = new ElementPrimitive( `${this.el.sel} > .form__toast` )

        this.input?.addEventListener( 'focusout', () => {
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
        return this.input?.value
    }

    setToast = ( toast: string ) => {
        if ( this.toast ) {
            this.toast.style.display = toast === '' ? 'none' : 'block'
            this.toast.textContent = toast
        }
    }

    activateCheck = () => {
        if ( !this.checkActive ) {
            if ( this.check ) this.check.style.display = 'block'
            this.checkActive = true
        }
    }

    deactivateCheck = () => {
        if ( this.checkActive ) {
            if ( this.check ) this.check.style.display = 'none'
            this.checkActive = false
        }
    }
}

export default Input