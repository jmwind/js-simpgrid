import { useEffect, useState, useRef } from 'preact/hooks';
import PropTypes from 'prop-types';
import ResizeIcon from './icons/move.svg'
import MinimizeIcon from './icons/minimize.svg'
import DragIcon from './icons/drag-handle.svg'
import styles from './style.module.css';

const Section = ({ name, grid_order, children, show_title, reorder_func }) => {
    const [order, setOrder] = useState(grid_order)
    const [spanx, setSpanX] = useState(1)
    const [spany, setSpanY] = useState(1)
    const [dragOver, setDragOver] = useState(false)
    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)
    const [dragResize, setDragResize] = useState(false)
    const [dragWidth, setDragWidth] = useState(0)
    const [origWidth, setOrigWidth] = useState(0)
    const boxRef = useRef()

    useEffect(() => { setOrder(grid_order) }, [grid_order])

    const resize = () => {
        if (spanx == 1) {
            setSpanX(spanx + 1);
            setSpanY(spany + 1);
        } else {
            setSpanX(1);
            setSpanY(1);
        }
    }

    const handleDragStart = (event) => {
        event.dataTransfer.setData("source-id", order)
    }

    const handleDragOver = (event) => {
        if (!dragResize) {
            event.preventDefault();
            setDragOver(true)
        }
    }

    const handleDragExit = () => {
        setDragOver(false)
    }

    const handleDrop = (event) => {
        if (!dragResize) {
            const dropId = parseInt(event.dataTransfer.getData("source-id"))
            event.stopPropagation();
            event.preventDefault();
            setDragOver(false)
            reorder_func(dropId, order)
        }
    }

    const handleResizeDrag = (event) => {
        if (boxRef) {
            console.log("box")
        }
        let new_spanx = Math.round((event.x - offsetX) / 30)
        let new_spany = Math.round((event.y - offsetY) / 30)
        if (new_spanx > 2) {
            setSpanX(spanx + 1)
            setOffsetX(event.x)
        } else if (new_spanx < -2 && spanx > 1) {
            setSpanX(spanx - 1)
            setOffsetX(event.x)
        }
        if (new_spany > 2) {
            setSpanY(spany + 1)
            setOffsetY(event.y)
        } else if (new_spany < -2 && spany > 1) {
            setSpanY(spany - 1)
            setOffsetY(event.y)
        }
        let w = origWidth + event.x - offsetX
        if (spanx == 1 && w < origWidth) {
            w = origWidth
        }
        setDragWidth(w)
        console.log(`DRAG x: ${event.x} y: ${event.y}`)
        console.log(`DRAG w: ${w}`)
    }

    const handleResizeStart = (event) => {
        setOffsetX(event.x)
        setOffsetY(event.y)
        setOrigWidth(boxRef.current.clientWidth)
        setDragWidth(boxRef.current.clientWidth)
        setDragResize(true)
    }

    const handleDragEnd = (event) => {
        setDragWidth(0)
        setDragResize(false)
    }

    const brightness = dragOver ? "brightness(150%)" : ""
    let boxStyle = {
        filter: `${brightness}`,
        order: `${order}`,
        gridArea: `auto / auto / span ${spany} / span ${spanx}`,
    }
    if (dragResize) {
        //boxStyle['width'] = dragWidth,
        boxStyle['borderColor'] = 'red',
            boxStyle['borderStyle'] = 'solid',
            boxStyle['borderWidth'] = 2
    }

    return (
        <div
            ref={boxRef}
            draggable
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragExit}
            class={styles.box}
            style={boxStyle} >

            {show_title && <div class={styles.box_header}>
                <div class={styles.box_header_title}>{name}</div>
                <img onClick={resize} class={styles.box_header_icons} src={spanx == 1 ? ResizeIcon : MinimizeIcon} />
            </div>}

            {children}

            <img draggable onDragStart={handleResizeStart} onDragEnd={handleDragEnd} onDrag={handleResizeDrag} class={styles.box_header_drag} src={DragIcon} />
        </div>
    )
}

Section.defaultProps = {
    show_title: true,
}

Section.propTypes = {
    children: PropTypes.object.isRequired
}

export default Section