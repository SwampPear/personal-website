document.addEventListener( 'DOMContentLoaded', () => {
    const landingBackground = document
    async function init() {
        const { instance } = await WebAssembly.instantiateStreaming(
          fetch("/wasm/website_graphics.wasm")
        )
    
        const answer = instance.exports.the_answer();
        console.log(answer);
      }
    
      init()
})