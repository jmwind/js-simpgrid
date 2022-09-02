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
    const [color, setColor] = useState(randomColor());

    useEffect(() => {
        let timer = setInterval(() => setColor(randomColor()), 500);
        return () => clearInterval(timer);
    }, []);

    return (
        <svg style={{ fill: "red", width: "100%", height: "100%" }} viewBox={[-100, -100, 200, 200].join(" ")} >
            <rect x="-100" y={-100} width="200" height="200" fill="#2b2f30" />
            <circle r="80" cx="-0" cy="-0" fill={color} />
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
    const [sections, setSections] = useState([])

    const createSection = (name, index, component) => {
        return (
            <Section name={name} grid_order={index}>
                {component}
            </Section>
        )
    }

    useEffect(() => {
        let secs = [
            createSection("AWS", 0, <NumberCard />),
            createSection("AWA", 1, <NumberCard />),
            createSection("Graphic 1", 2, <Card />),
            createSection("TWS", 3, <NumberCard />),
            createSection("Graphic 2", 4, <Card />),
            createSection("Graphic 3", 5, <Card />)
        ]
        setSections(secs)
    }, [])

    const handleChange = (event) => {
        setColumns(parseInt(event.target.value));
    }

    const handleNewCardClick = (event) => {
        const nextCard = Math.random() >= 0.5 ? <NumberCard /> : <Card />
        const updateSections = [...sections, createSection(`New Card ${sections.length}`, sections.length, nextCard)]
        setSections(updateSections)
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
                <span style={{ color: "white", padding: 10, fontSize: 14 }}>Show Titles:</span>
                <button style={{ color: "white", backgroundColor: "#161B1C", marginLeft: 15 }} onClick={handleNewCardClick}>New Card</button>
            </div>
            <Grid cols={columns}>
                {sections}
            </Grid>
        </div >
    );
}

export default App
