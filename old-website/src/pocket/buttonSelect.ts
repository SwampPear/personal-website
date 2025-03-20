import ElementPrimitive from './elementPrimitive'

interface ButtonSelectProps {
    selector: string
    options: string[]
}

class ButtonSelect {
    private selector: string
    private container: ElementPrimitive
    private options: string[]
    private buttons: HTMLButtonElement[]

    selected: string
    
    constructor( props: ButtonSelectProps ) {
        this.selector = props.selector
	    this.options = props.options
	
        this.container = ElementPrimitive.from({ selector: this.selector })

        this.buttons = []
	
        this.selected = ''
       
        this.options.forEach( option => {
            this.createButton( option )
        })
    }

    createButton = ( text: string ) => {
        const button = document.createElement( 'button' )

        button.textContent = text
        button.classList.add( 'p-button-select' )
        button.setAttribute( 'data-option', text )
        button.setAttribute( 'type', 'button' )
        button.addEventListener('click', () => {
            this.selected = button.getAttribute( 'data-option' ) as string

            this.buttons.forEach( b => {
                b.classList.remove( 'p-button-select-selected' )
            })

            button.classList.add( 'p-button-select-selected' )
        })

        this.container.appendChild( button )
        this.buttons.push( button )
    }
}

export default ButtonSelect