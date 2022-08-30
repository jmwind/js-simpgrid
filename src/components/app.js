import style from './index.css';
import { useEffect, useState } from 'preact/hooks';
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

const Card = (props) => {
	const [color, setColor] = useState(colors[0]);

	useEffect(() => {
		setColor(randomColor());
	}, []);

	return (
		<svg
			style={{ fill: "red", width: "100%", height: "100%" }}
			viewBox={[-100, -100, 200, 200].join(" ")} >
			<rect x="-100" y={-100} width="200" height="200" fill="#2b2f30" />
			<circle r="40" cx="-0" cy="-0" fill={color} />
		</svg >
	)
}

const NumberCard = (props) => {
	const [val, setVal] = useState("11.9");

	useEffect(() => {
		let timer = setInterval(() => setVal((Math.random() * 100).toFixed(1)), 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", backgroundColor: "#2b2f30" }}>
			<span style={{ flex: "1", color: "white", textAlign: "center", fontSize: "10vw" }}>{val}</span>
		</div>
	)
}

const Section = ({ name, number, children, max_columns, expanded, showTitle }) => {
	const [order, setOrder] = useState(number);
	const [span, setSpan] = useState(expanded);
	const [movedBack, setMovedBack] = useState(false)
	const [movedFoward, setMovedForward] = useState(false)

	const reorder = (units) => {
		let current = order;
		if (units < 0 && !movedBack) {
			units--
			setMovedBack(true)
		} else if (units >= 0 && !movedBack) {
			units++
			setMovedBack(false)
		}
		setOrder(order + units);
		console.log(`Moving item ${number} from ${current} to ${order + units}`)
	}

	const resize = () => {
		if (span == 1) {
			setSpan(span + 1);
		} else {
			setSpan(span - 1);
		}
	}

	return (
		<div class={style.box} style={{ order: `${order}`, gridArea: `auto / auto / span ${span} / span ${span}` }} >
			{showTitle && <div class={style.box_header}>
				<div style={{ flex: "1 1 auto", color: "white" }}>Widget {name}</div>
				<img onClick={resize} class={style.box_header_icons} src={MoveLeftIcon} />
				<img onClick={resize} class={style.box_header_icons} src={MoveRightIcon} />
				<img onClick={resize} class={style.box_header_icons} src={span == 1 ? ResizeIcon : MinimizeIcon} />
			</div>
			}
			{children}
		</div>
	)
}

Section.defaultProps = {
	expanded: 1
};

const App = () => {
	const [colums, setColumns] = useState(3)
	const [cardNum, setCardNum] = useState(10)
	const [showTitle, setShowTitle] = useState(true)

	useEffect(() => {
	}, []);

	const handleChange = (event) => {
		setColumns(event.target.value);
	};

	const handleCardNumChange = (event) => {
		setCardNum(parseInt(event.target.value));
	};

	const generateSections = (num, showTitle) => {
		let nums = Array(num).fill().map((x, i) => i)
		let sections = nums.map(a => {
			return (
				<Section name={a} max_columns={colums} number={a} showTitle={showTitle}>
					{randomCard()}
				</Section>
			)
		});
		return sections
	}

	return (
		<div>
			<div style={{ padding: 10, backgroundColor: "#161B1C" }}>
				<span style={{ color: "white", padding: 10, fontSize: 14 }}>Columns:</span>
				<select style={{ color: "white", backgroundColor: "#161B1C" }} value={colums} onChange={handleChange}>
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
			<div class={style.container} style={{ gridTemplateColumns: `repeat(` + colums + `, 1fr)` }} id="app">
				{generateSections(cardNum, showTitle)}
			</div>
		</div >
	);
}

export default App;
