import { useEffect, useState } from 'preact/hooks';
import PropTypes from 'prop-types';
import ResizeIcon from './icons/move.svg'
import MinimizeIcon from './icons/minimize.svg'
import styles from './style.module.css';

const Section = ({ name, grid_order, children, show_title, reorder_func }) => {
    const [order, setOrder] = useState(grid_order)
    const [span, setSpan] = useState(1)
    const [dragOver, setDragOver] = useState(false)

    useEffect(() => { setOrder(grid_order) }, [grid_order])

    const resize = () => {
        if (span == 1) {
            setSpan(span + 1);
        } else {
            setSpan(span - 1);
        }
    }

    const handleDragStart = (event) => {
        event.dataTransfer.setData("source-id", order)
    }

    const handleDragOver = (event) => {
        setDragOver(true)
        event.preventDefault();
    }

    const handleDragExit = () => {
        setDragOver(false)
    }

    const handleDrop = (event) => {
        const dropId = parseInt(event.dataTransfer.getData("source-id"))
        event.stopPropagation();
        event.preventDefault();
        setDragOver(false)
        reorder_func(dropId, order)
    }

    const brightness = dragOver ? "brightness(150%)" : ""

    return (
        <div draggable onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragExit} class={styles.box} style={{ filter: `${brightness}`, order: `${order}`, gridArea: `auto / auto / span ${span} / span ${span}` }} >
            {show_title && <div class={styles.box_header}>
                <div class={styles.box_header_title}>{name}</div>
                <img onClick={resize} class={styles.box_header_icons} src={span == 1 ? ResizeIcon : MinimizeIcon} />
            </div>
            }
            {children}
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