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
            <span style={{ color: "white", textAlign: "center", fontSize: "18vw" }}>{val}</span>
            <span style={{ color: "white", paddingRight: 20, textAlign: "right", fontSize: "1.5vw" }}>Kts</span>
        </div>
    )
}

const App = () => {
    const [columns, setColumns] = useState(3)
    const [sections, setSections] = useState([])
    const [metrics, setMetrics] = useState(SkData.newMetrics());
    const [newSectionType, setNewSectionType] = useState(SkData.AWA)
    const sectionsRef = useRef()

    sectionsRef.current = sections

    const WIND_DIRECTION = "100"
    const POLAR_RATIO = "200"
    const DEMO_METRIC = "300"
    const DEMO_SVG = "400"

    useEffect(() => {
        console.log("New Sections:")
        for (let i = 0; i < sections.length; i++) {
            const s = sections[i]
            console.log(`Section: ${s.props.children.type.name} ${s.props.grid_order} ${s.props.name}`)
        }
    }, [sections])

    const deleteSection = (id) => {
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
        /*
        addSection(secs, "Rando", <NumberCard />)
        addSection(secs, "Rando", <NumberCard />)
        addSection(secs, "Rando", <NumberCard />)
        addSection(secs, "Rando", <Card />)
        addSection(secs, "Rando", <NumberCard />)
        addSection(secs, "AWA", <WindDirection metrics={metrics} />)
        addSection(secs, "Polar %", <PolarRatio metrics={metrics} />)
        addSection(secs, "SOG", <BaseMetric metrics={metrics} metric_name={SkData.SOG} />)
        setSections(secs)
        */
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

    const handleNewSectionChange = (event) => {
        setNewSectionType(event.target.value)
    }

    const generateSectionType = () => {
        switch (newSectionType) {
            case WIND_DIRECTION: return { name: "Wind Direction", item: <WindDirection metrics={metrics} /> }
            case POLAR_RATIO: return { name: "Polar Ratio", item: <PolarRatio metrics={metrics} /> }
            case DEMO_METRIC: return { name: "Demo Metric", item: <NumberCard /> }
            case DEMO_SVG: return { name: "SVG", item: <Card /> }
            default:
                return { name: metrics[newSectionType].nameMetric, item: <BaseMetric metrics={metrics} metric_name={newSectionType} /> }
        }
    }

    const handleNewCardClick = (event) => {
        const updateSections = [...sections]
        const newSection = generateSectionType()
        addSection(updateSections, newSection.name, newSection.item)
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
                <button style={{ color: "white", backgroundColor: "#161B1C", marginLeft: 15 }} onClick={handleNewCardClick}>New Card</button>
                <select style={{ color: "white", backgroundColor: "#161B1C" }} value={newSectionType} onChange={handleNewSectionChange}>
                    <option value={DEMO_METRIC}>Demo Metric</option>
                    <option value={DEMO_SVG} >Demo SVG</option>
                    <option value={WIND_DIRECTION} >Wind Direction</option>
                    <option value={POLAR_RATIO} >Polar Ratio</option>
                    <option value={SkData.AWA} >AWA</option>
                    <option value={SkData.AWS}>AWS</option>
                    <option value={SkData.SOG} >SOG</option>
                    <option value={SkData.TWA} >TWA</option>
                    <option value={SkData.TWS} >TWS</option>
                </select>
            </div>
            <Grid cols={columns}>
                {sections}
            </Grid>
        </div >
    );
}

export default App
