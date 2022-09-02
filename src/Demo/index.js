import style from './style.module.css'
import { useEffect, useState } from 'preact/hooks'
import Grid from '../Grid'
import Section from '../Section'

const colors = ['red', 'blue', 'orange', 'purple', 'green', 'black', 'pink', 'grey'];

const randomColor = () => {
    const index = Math.round(Math.random() * colors.length);
    return colors[index];
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
        <div class={style.number_card} style={{ flexDirection: 'column' }}>
            <span style={{ color: "white", textAlign: "center", fontSize: "10vw" }}>{val}</span>
            <span style={{ color: "white", paddingRight: 20, textAlign: "right", fontSize: "1.5vw" }}>Kts</span>
        </div>
    )
}

const App = () => {
    const [columns, setColumns] = useState(3)
    const [cardNum, setCardNum] = useState(10)
    const [showTitle, setShowTitle] = useState(true)

    const createSection = (name, index, component) => {
        return (
            <Section name={name} grid_order={index} show_title={showTitle}>
                {component}
            </Section>
        )
    }

    const sections = [
        createSection("AWS", 0, <NumberCard />),
        createSection("AWA", 1, <NumberCard />),
        createSection("Graphic 1", 2, <Card />),
        createSection("TWS", 3, <NumberCard />),
        createSection("TWA", 4, <NumberCard />),
        createSection("SOG", 5, <NumberCard />),
        createSection("Graphic 2", 6, <Card />),
        createSection("Graphic 3", 7, <Card />)
    ]

    const handleChange = (event) => {
        setColumns(parseInt(event.target.value));
    };

    const handleCardNumChange = (event) => {
        setCardNum(parseInt(event.target.value));
    };

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
                {sections}
            </Grid>
        </div >
    );
}

export default App
