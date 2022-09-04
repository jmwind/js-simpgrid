import { useEffect, useState, useRef, useCallback } from 'preact/hooks';
import PropTypes from 'prop-types';
import ResizeIcon from './icons/move.svg'
import MinimizeIcon from './icons/minimize.svg'
import DragIcon from './icons/right.svg'
import TrashIcon from './icons/trash.svg'
import styles from './style.module.css';

const Section = ({ name, grid_order, children, show_title, reorder_func, delete_func, columns }) => {
    const [order, setOrder] = useState(grid_order)
    const [spanx, setSpanX] = useState(1)
    const [spany, setSpanY] = useState(1)
    const [dragOver, setDragOver] = useState(false)
    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)
    const [dragResize, setDragResize] = useState(false)
    const [dragWidth, setDragWidth] = useState(0)
    const [origWidth, setOrigWidth] = useState(0)
    const [dragHeight, setDragHeight] = useState(0)
    const [origHeight, setOrigHeight] = useState(0)
    const handleDelete = useCallback(() => {
        if (delete_func) {
            delete_func(order)
        }
    })
    const boxRef = useRef()
    const datatx = "source-id"

    useEffect(() => {
        setOrder(grid_order)
    }, [grid_order])

    const isMoveEvent = (event) => {
        return event.dataTransfer.types[0] == datatx
    }

    const resize = () => {
        if (spanx == 1) {
            setSpanX(spanx + 1);
            setSpanY(spany + 1);
        } else {
            setSpanX(1);
            setSpanY(1);
        }
    }

    const handleDragStart = (e) => {
        e.dataTransfer.setData(datatx, order)
    }

    const handleDragOver = (e) => {
        if (isMoveEvent(e)) {
            e.preventDefault();
            setDragOver(true)
        }
    }

    const handleDragExit = (e) => {
        if (isMoveEvent(e)) {
            setDragOver(false)
        }
    }

    const handleDrop = (e) => {
        const dropId = parseInt(e.dataTransfer.getData(datatx))
        if (isMoveEvent(e)) {
            e.stopPropagation();
            e.preventDefault();
            setDragOver(false)
            reorder_func(dropId, order)
        }
    }

    const snapToX = (newX, newSpan) => {
        setOrigWidth(newX)
        setSpanX(newSpan)
        setDragResize(false)
    }

    const snapToY = (newY, newSpan) => {
        setOrigHeight(newY)
        setSpanY(newSpan)
        setDragResize(false)
    }

    const handleResizeDrag = (event) => {
        let gap = 15
        // can happen on drop, a last drag is fired but should be ignored
        if (!dragResize || event.x == 0 || event.y == 0) {
            return
        }
        let dx = event.x - offsetX
        let dy = event.y - offsetY

        let cw = origWidth + (event.x - offsetX)
        if (dx > origWidth / 3 && spanx < columns) {
            cw = origWidth * 2 + gap
            snapToX(cw, spanx + 1)

        } else if (dx < -1 * (origWidth / 3) && spanx > 1) {
            cw = origWidth / 2 - gap
            snapToX(cw, spanx - 1)
        }
        // dont' allow resize smaller if already at minimum column
        let resizeX = true
        if (spanx == 1 && dx < 0) {
            resizeX = false
        }
        if (spanx == columns && dx > 0) {
            resizeX = false
        }

        if (resizeX) {
            setDragWidth(cw)
        }

        let ch = origHeight + (event.y - offsetY)
        if (dy > origHeight / 3) {
            ch = origHeight * 2 + gap
            snapToY(ch, spany + 1)

        } else if (dy < -1 * (origHeight / 3) && spany > 1) {
            ch = origHeight / 2 - gap
            snapToY(ch, spany - 1)
        }
        // dont' allow resize smaller if already at minimum column
        let resizeY = true
        if (spany == 1 && dy < 0) {
            resizeY = false
        }

        if (resizeY) {
            setDragHeight(ch)
        }
    }

    const handleResizeStart = (event) => {
        setOffsetX(event.x)
        setOffsetY(event.y)
        setOrigWidth(boxRef.current.clientWidth)
        setDragWidth(boxRef.current.clientWidth)
        setOrigHeight(boxRef.current.clientHeight)
        setDragHeight(boxRef.current.clientHeight)
        setDragResize(true)
    }

    const handleDragEnd = (event) => {
        setDragWidth(0)
        setDragHeight(0)
        setDragResize(false)
    }



    const brightness = dragOver || dragResize ? "brightness(150%)" : ""
    let boxStyle = {
        filter: `${brightness}`,
        order: `${order}`,
        gridArea: `auto / auto / span ${spany} / span ${spanx}`,
    }
    if (dragResize) {
        boxStyle['width'] = dragWidth,
            boxStyle['height'] = dragHeight,
            boxStyle['borderColor'] = 'grey',
            boxStyle['borderStyle'] = 'solid',
            boxStyle['borderWidth'] = 2
    } else {
        boxStyle['transition'] = "width height 0.7s"
        boxStyle['width'] = "100%"
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
                <img onClick={handleDelete} class={styles.box_header_icons} src={TrashIcon} />
                <img onClick={resize} class={styles.box_header_icons} src={spanx == 1 ? ResizeIcon : MinimizeIcon} />
            </div>}

            {children}

            <img class={styles.box_header_drag}
                onDragStart={handleResizeStart}
                onDragEnd={handleDragEnd}
                onDrag={handleResizeDrag}
                src={DragIcon} />
        </div>
    )
}

Section.defaultProps = {
    show_title: true,
    columns: 3
}

Section.propTypes = {
    children: PropTypes.object.isRequired
}

export default Section