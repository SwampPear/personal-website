document.addEventListener( 'DOMContentLoaded', () => {
    const graphic = document.querySelector( '.landing__graphic' )

    async function init() {
        const { instance } = await WebAssembly.instantiateStreaming(
          fetch("/wasm/website_graphics.wasm")
        );

        const width = 600;
        const height = 600;

        graphic.width = width;
        graphic.height = height;

        const buffer_address = instance.exports.BUFFER.value;
        const image = new ImageData(
            new Uint8ClampedArray(
                instance.exports.memory.buffer,
                buffer_address,
                4 * width * height,
            ),
            width,
        );

        const ctx = graphic.getContext("2d");

        // CHANGES BEGIN HERE
        const render = () => {
          instance.exports.go();
          ctx.putImageData(image, 0, 0);
          requestAnimationFrame(render);
        };

        render();
      }

      init();
})