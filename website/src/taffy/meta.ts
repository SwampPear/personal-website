/**
 * Sets the title in head.
 */
const setTitle = ( newTitle: string ) => {
    const title = document.querySelector( 'title' ) as HTMLTitleElement
    
    if ( title ) {
        title.innerText = newTitle
    } else {
        throw new Error( 'No title element detected' )
    }
}