import ElementPrimitive from './elementPrimitive'

interface CountdownProps {
    selector: string
    target?: Date
}

class Countdown {
    private selector: string
    private target: Date
    private container: ElementPrimitive
    
    constructor( props: CountdownProps ) {
        this.selector = props.selector
        this.target = props.target ? props.target : new Date()
        this.container = ElementPrimitive.from({ selector: this.selector })

        this.setTime()
        setInterval( this.setTime, 1000 )
    }

    setTarget = ( target: Date ) => {
        this.target = target
    }

    setTime = () => {
        const now = new Date().getTime()
        const difference = this.target.getTime() - now
  
        const days = Math.abs(Math.floor(difference / (1000 * 60 * 60 * 24)))
        const hours = Math.abs(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
        const minutes = Math.abs(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)))
        const seconds = Math.abs(Math.floor((difference % (1000 * 60)) / 1000))

        const timeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`

        this.container.textContent = timeStr
    }
}

export default Countdown