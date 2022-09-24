import styles from "./style.module.css";
import { arc } from "d3-shape"
import { useState, useEffect } from "preact/hooks"
import { SkConversions, SkData } from 'sk-jsclient/sk-data'

const Histogram = (props) => {
    const [metrics, setMetrics] = useState(props.metrics)
    const [time, setTime] = useState(Date.now())
    const [lowAngle, setLowAngle] = useState(0)
    const [highAngle, setHighAngle] = useState(0)

    const data = [7, 5, 7, 6, 9, 22, 9, 8, 7, 6, 9, 5, 11, 14, 15, 18, 8, 9, 6, 5, 4, 3, 2]

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
                <line y1="-40" y2="40" x1="-40" x2="-40" strokeWidth={1} stroke="white" />
                <line y1="40" y2="40" x1="-40" x2="40" strokeWidth={1} stroke="white" />
                <text
                    text-anchor="middle"
                    alignment-baseline="middle"
                    x="0"
                    y="45"
                    fill="white"
                    font-size="5">Kts
                </text>
            </svg>
        </div >
    )
}

export default Histogram