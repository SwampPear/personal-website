export default interface ElementPrimitive extends Element {
    style: any,
    value: any,
    id: string,
    selector: string,
    el: Element | null,
}