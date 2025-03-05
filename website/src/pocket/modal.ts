import ElementPrimitive, { ElementPrimitiveProps } from './elementPrimitive'

interface ModalProps {
    selector: string
    closeCallback?: () => void
}

class Modal {
    private selector: string
    private container: ElementPrimitive
    private modal: ElementPrimitive
    private closeButton: ElementPrimitive

    constructor( props: ModalProps ) {
        this.selector = props.selector

        this.container = ElementPrimitive.from({ selector: `#${this.selector}__modal-container` })
        this.modal = ElementPrimitive.from({ selector:  `#${this.selector}__modal-modal` })
        this.closeButton = ElementPrimitive.from({ selector: `#${this.selector}__modal-close-button` })

        this.closeButton.addEventListener( 'click', this.close )
    }

    open = () => {
        if ( this.container && this.modal ) {
            this.container.style.zIndex = '999'
            this.modal.style.zIndex = '999'

            this.container.classList.remove( 'p-modal-container-fade-out' )
            this.container.classList.add( 'p-modal-container-fade-in' )

            setTimeout(() => {
                this.modal.classList.remove( 'p-modal-modal-fade-out' )
                this.modal.classList.add( 'p-modal-modal-fade-in' )
            }, 250)
        }
    }

    close = () => {
        if ( this.container && this.modal ) {
            this.modal.classList.remove( 'p-modal-modal-fade-in' )
            this.modal.classList.add( 'p-modal-modal-fade-out' )

            setTimeout(() => {
                this.container.classList.remove( 'p-modal-container-fade-in' )
                this.container.classList.add( 'p-modal-container-fade-out' )
    
                setTimeout(() => {
                    if ( this.container && this.modal ) {
                        this.container.style.zIndex = '-1'
                        this.modal.style.zIndex = '-1'
                    }
                }, 250)
            }, 175)
        }
    }
}

export default Modal