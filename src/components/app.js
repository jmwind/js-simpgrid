import style from './index.css';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { cloneElement } from 'preact';
import ResizeIcon from '../assets/icons/move.svg'
import MinimizeIcon from '../assets/icons/minimize.svg'
import MoveLeftIcon from '../assets/icons/left.svg'
import MoveRightIcon from '../assets/icons/right.svg'

const colors = ['red', 'blue', 'orange', 'purple', 'green', 'black', 'pink', 'grey'];

const randomColor = () => {
	const index = Math.round(Math.random() * colors.length);
	return colors[index];
}

const randomCard = () => {
	if (Math.random() >= 0.5) {
		return (<Card />)
	} else {
		return (<NumberCard />)
	}
}

const Card = () => {
	const [color, setColor] = useState(colors[0]);

	useEffect(() => {
		setColor(randomColor());
	}, []);

	return (
		<svg style={{ fill: "red", width: "100%", height: "100%" }} viewBox={[-100, -100, 200, 200].join(" ")} >
			<rect x="-100" y={-100} width="200" height="200" fill="#2b2f30" />
			<circle r="40" cx="-0" cy="-0" fill={color} />
		</svg >
	)
}

const NumberCard = () => {
	const [val, setVal] = useState("0.0");

	useEffect(() => {
		let timer = setInterval(() => setVal((Math.random() * 100).toFixed(1)), 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div class={style.number_card}>
			<span style={{ flex: "1", color: "white", textAlign: "center", fontSize: "10vw" }}>{val}</span>
		</div>
	)
}

const Section = ({ name, grid_order, children, show_title, reorder_func }) => {
	const [order, setOrder] = useState(grid_order)
	const [span, setSpan] = useState(1)
	const [dragOver, setDragOver] = useState(false)
	const [dragged, setDragged] = useState(null)

	useEffect(() => { setOrder(grid_order) }, [grid_order])

	const resize = () => {
		if (span == 1) {
			setSpan(span + 1);
		} else {
			setSpan(span - 1);
		}
	}

	const moveFwd = () => {
		reorder_func(order, order + 1)
	}

	const moveBack = () => {
		reorder_func(order, order - 1)
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

	const displayDrop = dragOver ? "block" : "none"

	return (
		<div draggable onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragExit} class={style.box} style={{ order: `${order}`, gridArea: `auto / auto / span ${span} / span ${span}` }} >
			<div style={{ position: "relative" }}>
				<div class={style.box_dropzone} style={{ display: displayDrop }}>
				</div>
			</div>
			{show_title && <div class={style.box_header}>
				<div class={style.box_header_title}>{name}</div>
				<img onClick={moveBack} class={style.box_header_icons} src={MoveLeftIcon} />
				<img onClick={moveFwd} class={style.box_header_icons} src={MoveRightIcon} />
				<img onClick={resize} class={style.box_header_icons} src={span == 1 ? ResizeIcon : MinimizeIcon} />
			</div>
			}
			{children}
		</div>
	)
}

const Grid = ({ cols, children }) => {
	const [columns, setColumns] = useState(cols)
	const [orders, setOrders] = useState(0)

	useEffect(() => { setColumns(cols) }, [cols])

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
		return cloneElement(child, { reorder_func: reorder });
	});

	return (
		<div class={style.container} style={{ gridTemplateColumns: `repeat(` + columns + `, 1fr)` }} id="app">
			{childrenWithProps}
		</div>
	)
}

const App = () => {
	const [columns, setColumns] = useState(3)
	const [cardNum, setCardNum] = useState(10)
	const [showTitle, setShowTitle] = useState(true)

	const handleChange = (event) => {
		setColumns(event.target.value);
	};

	const handleCardNumChange = (event) => {
		setCardNum(parseInt(event.target.value));
	};

	const generateSections = (num, showTitle) => {
		let nums = Array(num).fill().map((x, i) => i)
		let s = nums.map(a => {
			return (
				<Section name={`Widget ${a}`} grid_order={a} show_title={showTitle}>
					{randomCard()}
				</Section>
			)
		});
		return s
	}

	return (
		<div>
			<div style={{ padding: 10, backgroundColor: "#161B1C" }}>
				<span style={{ color: "white", padding: 10, fontSize: 14 }}>Columns:</span>
				<select style={{ color: "white", backgroundColor: "#161B1C" }} value={columns} onChange={handleChange}>
					<option value="1" >1</option>
					<option value="2" >2</option>
					<option value="3" >3</option>
					<option value="4" >4</option>
					<option value="5" >5</option>
				</select>
				<span style={{ padding: 10, fontSize: 14 }}>Cards:</span>
				<select value={cardNum} onChange={handleCardNumChange}>
					<option value="1" >1</option>
					<option value="5" >5</option>
					<option value="10" >10</option>
					<option value="25" >25</option>
					<option value="40" >40</option>
				</select>
				<span style={{ padding: 10, fontSize: 14 }}>Show Titles:</span>
				<select value={showTitle} onChange={(event) => setShowTitle(event.target.value == "true")}>
					<option value={true} >Yes</option>
					<option value={false} >No</option>
				</select>
			</div>
			<Grid cols={columns}>
				{generateSections(cardNum, showTitle)}
			</Grid>
		</div >
	);
}

export default App;
