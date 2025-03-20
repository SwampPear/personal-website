import ElementPrimitive from './elementPrimitive'

class Pocket {
    constructor() {
        window.customElements.define( 'element-primitive', ElementPrimitive, { extends: 'div' })
    }
}

export default Pocket