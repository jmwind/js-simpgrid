import style from './index.css';
import { useEffect, useState } from 'preact/hooks';

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
			<rect x="-100" y={-100} width="200" height="200" fill="white" />
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
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", backgroundColor: "white" }}>
			<span style={{ flex: "1", backgroundColor: "white", textAlign: "center", fontSize: "10vw" }}>{val}</span>
		</div>
	)
}

const Section = ({ name, number, children, max_columns, expanded }) => {
	const [order, setOrder] = useState(number);
	const [span, setSpan] = useState(expanded);

	const reorder = (units) => {
		if (order == 0) {
			units++;
		}
		setOrder(order + units);
	}

	const resize = () => {
		if (span == 1) {
			setSpan(span + 1);
		} else {
			setSpan(span - 1);
		}
	}

	return (
		<div class={style.box} style={{ padding: 5, order: `${order}`, gridArea: `auto / auto / span ${span} / span ${span}` }} >
			<div class={style.box_header} style={{ padding: "10px", color: "white", backgroundColor: "grey" }}>
				<div style={{ flex: "1 1 auto" }}>
					<button onClick={() => reorder(-1)}>{"<"}</button>
					<button onClick={() => reorder(1)}>{">"}</button>
				</div>
				<div style={{ color: "white" }}>Widget {name}</div>
				<div style={{ marginLeft: 6 }}><button onClick={resize}>{span == 1 ? "+" : "-"}</button></div>
			</div>
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

	useEffect(() => {
	}, []);

	const handleChange = (event) => {
		setColumns(event.target.value);
	};

	const handleCardNumChange = (event) => {
		setCardNum(parseInt(event.target.value));
	};

	const generateSections = (num) => {
		let nums = Array(num).fill().map((x, i) => i)
		let sections = nums.map(a => {
			return (
				<Section name={a} max_columns={colums} number={a}>
					{randomCard()}
				</Section>
			)
		});
		return sections
	}

	return (
		<div>
			<div style={{ padding: 10 }}>
				<span style={{ padding: 10, fontSize: 14 }}>Columns:</span>
				<select value={colums} onChange={handleChange}>
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
			</div>
			<div class={style.container} style={{ gridTemplateColumns: `repeat(` + colums + `, 1fr)` }} id="app">
				{generateSections(cardNum)}
			</div>
		</div>
	);
}

export default App;
