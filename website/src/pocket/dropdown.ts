import ElementPrimitive from './elementPrimitive'

interface DropdownProps {
    selector: string
    alignment?: string
}

class Dropdown {
    private button: ElementPrimitive
    private menu: ElementPrimitive
    private alignment: string

    private opened: boolean

    constructor( props: DropdownProps ) {
        this.button = ElementPrimitive.from({ selector: `${props.selector}-dropdown-button`})
        this.menu = ElementPrimitive.from({ selector: `${props.selector}-dropdown-menu`})

        this.alignment = props.alignment ? props.alignment : 'TR'

        this.opened = false

        this.button.addEventListener( 'click', this.open )
        document.addEventListener( 'click' , this.closeEvent )
    }

    closeEvent = ( event: MouseEvent ) => {
        const shouldClose = this.menu && !this.menu.contains(event.target as Node) && event.target !== this.menu
        && this.button && !this.button.contains(event.target as Node) && event.target !== this.button

        if ( shouldClose ) {
            this.close()
        }
    }

    open = () => {
        if ( !this.opened ) {
            let menuCoords = this.menu.getBoundingClientRect()
            let coords = this.button.getBoundingClientRect()

            if ( this.alignment === 'TR' ) {
                this.menu.style.left = `${ coords.left - (menuCoords.width - coords.width)}px`
            }

            this.menu.style.top = `${coords.y + coords.height + 16}px`
            this.menu.style.zIndex = 999

            this.menu.classList.remove( 'p-dropdown-menu-fade-out' )
            this.menu.classList.add( 'p-dropdown-menu-fade-in' )

            this.opened = true
        }
    }

    close = () => {
        if ( this.opened ) {
            this.menu.classList.remove( 'p-dropdown-menu-fade-in' )
            this.menu.classList.add( 'p-dropdown-menu-fade-out' )

            setTimeout(() => {
                this.menu.style.zIndex = -1
            }, 125)

            this.opened = false
        }
    }
}

export default Dropdown