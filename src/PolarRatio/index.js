import styles from "./style.module.css";
import { useState, useEffect } from "preact/hooks"
import { SkConversions, SkData } from 'sk-jsclient/sk-data'

const PolarRatio = (props) => {
    const [metrics, setMetrics] = useState(props.metrics)
    const [time, setTime] = useState(Date.now())
    const [lowPercent, setLowPercent] = useState(0)
    const [highPercent, setHighPercent] = useState(0)

    const awa = SkConversions.fromMetric(metrics[SkData.AWA]);
    const textColor = "white"

    if (awa < lowPercent) {
        setLowPercent(awa)
    }
    if (awa > highPercent) {
        setHighPercent(awa)
    }
    let percent = awa;
    let step = 5;

    const ticks = (increments, largeTickInterval) => {
        let angles = Array(13).fill().map((x, i) => i)
        let ticks = angles.map(a => {
            return (
                <line
                    y1={40}
                    y2={40}
                    x1={-21}
                    x2={21}
                    stroke={textColor}
                    stroke-width="1"
                    transform={`translate(0 ${a * -step})`}
                />
            )
        });
        return ticks
    }

    const tickText = (increments) => {
        let angles = Array(13).fill().map((x, i) => i)
        let text = angles.map(a => {
            if (a % 2 != 0) return;
            return (
                <text
                    text-anchor="middle"
                    alignment-baseline="middle"
                    x="-27"
                    y="40"
                    fill={textColor}
                    font-size="4"
                    transform={`translate(0 ${a * -step})`}>{a * 10}%</text>
            )
        });
        return text
    }

    useEffect(() => {
        let timer = setInterval(() => setTime(Date.now()), 750);
        return () => clearInterval(timer);
    }, []);

    let color = 'green'
    if (awa < 40) {
        color = 'red'
    } else if (awa >= 40 && awa < 49) {
        color = "yellow"
    }

    return (
        <div class={styles.container}>
            <svg
                style={{ width: "inherit", height: "inherit" }}
                viewBox={[-45, -45, 90, 90].join(" ")}
            >

                <rect x="-20" y={40 - (percent / 12) * (step + 1)} width="40" height={(percent / 12) * (step + 1)} fill={color} />
                {ticks(15, 30)}
                {tickText(30)}
                <text
                    text-anchor="middle"
                    alignment-baseline="middle"
                    x="32"
                    y="10"
                    fill={textColor}
                    font-size="8">{awa.toFixed(0)}%
                </text>
                <circle
                    r="1"
                    x="0"
                    y="40"
                    fill="red"
                    transform={`translate(20 ${40 - (highPercent / 12) * (step + 1)})`}
                />
            </svg>
        </div >
    )
}

export default PolarRatio;