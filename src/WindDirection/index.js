import styles from "./style.module.css";
import { arc } from "d3-shape"
import { useState, useEffect } from "preact/hooks"
import { SkConversions, SkData } from 'sk-jsclient/sk-data'

const getCoordsOnArc = (angle, r = 10) => [
    Math.cos(toRadians(angle) - Math.PI / 2) * r,
    Math.sin(toRadians(angle) - Math.PI / 2) * r,
]

const toRadians = (degree) => {
    return degree * (Math.PI / 180)
}

const tickAngles = (increments, startAngle, stopAngle) => {
    let angles = []
    let angle = startAngle;
    while (angle <= stopAngle) {
        angles.push(angle);
        angle = angle + increments;
    }
    return angles
}

const WindDirection = (props) => {
    const [metrics, setMetrics] = useState(props.metrics)
    const [time, setTime] = useState(Date.now())
    const [lowAngle, setLowAngle] = useState(0)
    const [highAngle, setHighAngle] = useState(0)

    const sog = SkConversions.fromMetric(props.metrics[SkData.AWS]).toFixed(1);
    const awa = SkConversions.fromMetric(metrics[SkData.AWA]);
    const textColor = "white"

    if (awa < lowAngle || lowAngle == 0) {
        setLowAngle(awa)
    }
    if (awa > highAngle) {
        setHighAngle(awa)
    }
    const lowCoords = getCoordsOnArc(lowAngle, 39)
    const highCoords = getCoordsOnArc(highAngle, 39)

    var arcGenerator = arc();

    var pathData = arcGenerator({
        startAngle: toRadians(30),
        endAngle: toRadians(330),
        innerRadius: 35,
        outerRadius: 40
    });

    var portData = arcGenerator({
        startAngle: toRadians(300),
        endAngle: toRadians(345),
        innerRadius: 37,
        outerRadius: 40
    });

    var stbData = arcGenerator({
        startAngle: toRadians(15),
        endAngle: toRadians(60),
        innerRadius: 37,
        outerRadius: 40
    });

    var outsideRing = arcGenerator({
        startAngle: toRadians(15),
        endAngle: toRadians(345),
        innerRadius: 41,
        outerRadius: 40
    });

    const ticks = (increments, largeTickInterval) => {
        let angles = tickAngles(increments, 30, 330);
        let ticks = angles.map(a => {
            let l = a % largeTickInterval == 0 ? -33 : -38;
            return (
                <line
                    y1="-40"
                    y2={l}
                    stroke={textColor}
                    stroke-width="1"
                    transform={`rotate(${a})`}
                />
            )
        });
        return ticks
    }

    const tickText = (increments) => {
        let angles = tickAngles(increments, 30, 330);
        let text = angles.map(a => {
            const coords = getCoordsOnArc(a, 28);
            return (
                <text
                    text-anchor="middle"
                    alignment-baseline="middle"
                    x="0"
                    y="0"
                    fill={textColor}
                    font-size="6"
                    transform={`translate(${coords[0]},${coords[1]})`}>{a <= 180 ? a : 360 - a}</text>
            )
        });
        return text
    }

    useEffect(() => {
        let timer = setInterval(() => setTime(Date.now()), 250);
        return () => clearInterval(timer);
    }, []);

    return (
        <div class={styles.container}>
            <svg
                style={{ width: "inherit", height: "inherit" }}
                viewBox={[-50, -50, 100, 100].join(" ")}
            >
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7"
                        refX="0" refY="3.5" orient="auto" viewBox="0 0 50 50">
                        <polygon fill={textColor} points="0 0, 10 3.5, 0 7" />
                    </marker>
                </defs>
                <path d={pathData} fill="lightgrey" />
                <path d={portData} fill="red" />
                <path d={stbData} fill="green" />
                <path d={outsideRing} fill={textColor} />
                {ticks(15, 30)}
                {tickText(30)}
                <text
                    text-anchor="middle"
                    alignment-baseline="middle"
                    x="0"
                    y="10"
                    fill={textColor}
                    font-size="10">{sog}
                </text>
                <text
                    text-anchor="middle"
                    alignment-baseline="middle"
                    fill={textColor}
                    x="0"
                    y="17"
                    font-size="4">Kts
                </text>
                <line
                    y1="-0"
                    y2="-29"
                    stroke={textColor}
                    stroke-width="3"
                    marker-end="url(#arrowhead)"
                    transform={`rotate(${awa})`}
                />
                <line
                    y1="-0"
                    y2="-29"
                    stroke="orange"
                    stroke-width="2"
                    marker-end="url(#arrowhead)"
                    transform={`rotate(${awa})`}
                />
                <circle
                    r="2"
                    stroke="black"
                    stroke-width="0"
                    fill="grey"
                />
                <circle
                    r="2"
                    stroke="black"
                    stroke-width="1"
                    fill="white"
                    transform={`translate(${lowCoords[0]},${lowCoords[1]})`}
                />
                <circle
                    r="2"
                    stroke="black"
                    stroke-width="1"
                    fill="red"
                    transform={`translate(${highCoords[0]},${highCoords[1]})`}
                />
            </svg>
            <button onClick={
                () => {
                    setHighAngle(0); setLowAngle(0);
                }}>Reset</button>
        </div >
    )
}

export default WindDirection