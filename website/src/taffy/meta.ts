/**
 * Sets the title in head.
 */
const setTitle = ( newTitle: string ) => {
    const title = document.querySelector( 'title' ) as HTMLTitleElement
    
    if ( title ) {
        title.innerText = newTitle
    } else {
        console.error( 'No title element detected' )
    }
}

export { setTitle }