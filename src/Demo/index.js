import style from './style.module.css'
import { useEffect, useState, useRef } from 'preact/hooks'
import Grid from '../Grid'
import Section from '../Section'
import SkClient from 'sk-jsclient/sk-client';
import { SkData, SkPolars, CATALINA_36_POLARS } from 'sk-jsclient/sk-data';
import WindDirection from '../WindDirection';
import PolarRatio from '../PolarRatio';
import BaseMetric from '../BaseMetric';

const colors = ['red', 'blue', 'orange', 'purple', 'green', 'black', 'pink', 'grey'];

const randomColor = () => {
    const index = Math.round(Math.random() * colors.length);
    return colors[index];
}

const Card = () => {
    const [color, setColor] = useState(randomColor());

    useEffect(() => {
        let timer = setInterval(() => setColor(randomColor()), 500);
        return () => {
            clearInterval(timer);
        }
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
        <div class={style.number_card}>
            <span style={{ color: "white", textAlign: "center", fontSize: "10vw" }}>{val}</span>
            <span style={{ color: "white", paddingRight: 20, textAlign: "right", fontSize: "1.5vw" }}>Kts</span>
        </div>
    )
}

const App = () => {
    const [columns, setColumns] = useState(3)
    const [sections, setSections] = useState([])
    const [metrics, setMetrics] = useState(SkData.newMetrics());
    const sectionsRef = useRef()

    sectionsRef.current = sections

    const deleteSection = (id) => {
        console.log("delete me: " + id)
        const updateSections = [...sectionsRef.current]
        updateSections.splice(id, 1)
        for (let i = 0; i < updateSections.length; i++) {
            updateSections[i].props.grid_order = i
        }
        setSections(updateSections)
    }

    const addSection = (array, name, component) => {
        array.push(
            <Section name={name} grid_order={array.length} delete_func={deleteSection}>
                {component}
            </Section>
        )
    }

    const createWebsocket = (url) => {
        return new WebSocket(url);
    }

    const initDefaultCards = () => {
        let secs = []
        addSection(secs, "Rando", <NumberCard />)
        addSection(secs, "Rando", <NumberCard />)
        addSection(secs, "Rando", <NumberCard />)
        addSection(secs, "Rando", <Card />)
        addSection(secs, "Rando", <NumberCard />)
        addSection(secs, "AWA", <WindDirection metrics={metrics} />)
        addSection(secs, "Polar %", <PolarRatio metrics={metrics} />)
        addSection(secs, "SOG", <BaseMetric metrics={metrics} metric_name={SkData.SOG} />)
        setSections(secs)
    }

    useEffect(() => {
        let client = new SkClient(createWebsocket);
        client.setState(metrics);
        client.setPolars(SkPolars.readFromFileContents(CATALINA_36_POLARS));
        client.connect();
        initDefaultCards()
        return () => {
            client.off('delta');
            client.disconnect();
        }
    }, [])

    const handleChange = (event) => {
        setColumns(parseInt(event.target.value));
    }

    const handleNewCardClick = (event) => {
        const nextCard = Math.random() >= 0.5 ? <NumberCard /> : <Card />
        const updateSections = [...sections]
        addSection(updateSections, nextCard)
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
