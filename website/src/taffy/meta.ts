class Meta {
    title: HTMLTitleElement

    constructor() {
        this.title = document.querySelector( 'title' ) as HTMLTitleElement
    }

    setTitle( text: string ) {
        if ( this.title ) {
            this.title.textContent = text
        }
    }
}