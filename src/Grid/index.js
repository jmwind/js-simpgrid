import { useEffect, useState, useRef } from 'preact/hooks'
import { cloneElement } from 'preact'
import PropTypes from 'prop-types'
import styles from './style.module.css'

const Grid = ({ cols, children }) => {
    const [columns, setColumns] = useState(cols)
    const [orders, setOrders] = useState(0)
    const gridRef = useRef()

    useEffect(() => {
        setColumns(cols)
    }, [cols])

    const findChild = (index) => {
        if (children) {
            for (let i = 0; i < children.length; i++) {
                if (children[i].props.grid_order == index) {
                    return children[i]
                }
            }
        }
        return null
    }

    const reorder = (index, new_index) => {
        let first = findChild(index)
        let next = findChild(new_index)
        if (first && next) {
            first.props.grid_order = new_index
            next.props.grid_order = index
            setOrders(orders + 1)
        }
    }

    const childrenWithProps = children.map(child => {
        return cloneElement(child, { reorder_func: reorder, columns: columns });
    });

    return (
        <div ref={gridRef} class={styles.container} style={{ gridTemplateColumns: `repeat(` + columns + `, 1fr)` }}>
            {childrenWithProps}
        </div>
    )
}

Grid.defaultProps = {
    cols: 3
}

Grid.propTypes = {
    cols: PropTypes.number,
    children: PropTypes.array.isRequired
}

export default Grid