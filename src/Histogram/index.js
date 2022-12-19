import styles from "./style.module.css";
import { useState, useEffect } from "preact/hooks"
import { SkConversions, SkData } from 'sk-jsclient/sk-data'

const Histogram = (props) => {
    const [metrics, setMetrics] = useState(props.metrics)
    const [time, setTime] = useState(Date.now())
    const [high, setHigh] = useState(0)
    const [low, setLow] = useState(0)
    const [data, setData] = useState([])

    // most recent is at index 0
    //const data = [4.4, 21.9, 22.2, 11.1, 19.4, 12.9, 12.9, 11.1, 2.1, 1.4, 2.2, 4.1, 2.4, 2.9, 2.9, 1.1, 2.1, 4.4, 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, , 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, , 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, , 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, , 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, , 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, , 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, 4.1, 9.4, 2.9, 2.9, 1.1, 2.1, 4.4, 2.9, 2.2, 4.1, 6.4, 2.2, 4.1, 6.4, 2.9, 2.2, 4.1, 6.4, 2.2, 4.1, 2.4, 2.9, 2.2, 4.1, 6.4, 2.2, 4.1, 6.4, 2.9, 2.2, 4.1, 6.4]
    //const data = []
    const timeframe_secs = 60
    const sample_rate = 30
    const type = "kts"
    const width = 82
    const data_points = width / 2 - 2
    const grid_ticks = 5

    useEffect(() => {
        let timer = setInterval(() => setTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        let m = metrics[props.metric_name];
        let m_val = SkConversions.fromMetric(m).toFixed(m.rounding);
        let newData = [m_val, ...data.slice(0, data_points - 1)]
        setData(newData)
        let _low = data[0]
        let _high = data[0]
        for (let i = 0; i < data.length; i++) {
            if (data[i] < _low) {
                _low = data[i]
            }
            if (data[i] > _high) {
                _high = data[i]
            }
        }
        setHigh(_high)
        setLow(_low)
    }, [time])

    const drawBars = () => {
        let startx = data_points + 2
        const in_range = data
        let tick_size = width / high
        let bars = in_range.map(a => {
            startx = startx - 2
            return (
                <line
                    y1={39}
                    y2={39 - (a * tick_size)}
                    x1={startx}
                    x2={startx}
                    stroke="yellow"
                    stroke-width="1"
                />
            )
        });
        return bars
    }

    const drawTicks = () => {
        let ticks = []
        const space = width / grid_ticks
        for (let i = 1; i < grid_ticks; i++) {
            const y = 39 - (i * space)
            ticks.push(
                <line
                    y1={y}
                    y2={y}
                    x1={-41}
                    x2={-40}
                    stroke="white"
                    stroke-width="1"
                />
            )
        }
        return ticks
    }

    const drawTickLabels = () => {
        let ticks = []
        if (data.length > 1) {
            const space = width / grid_ticks
            for (let i = 1; i < grid_ticks; i++) {
                const y = 39 - (i * space)
                ticks.push(
                    <text
                        text-anchor="middle"
                        alignment-baseline="middle"
                        x="-44"
                        y={y}
                        fill="lightgrey"
                        font-size="3">{Math.round(i * (high / grid_ticks))}
                    </text>
                )
            }
        }
        return ticks
    }

    return (
        <div class={styles.container}>
            <svg
                style={{ width: "inherit", height: "inherit" }}
                viewBox={[-50, -50, 100, 100].join(" ")}>
                <line y1="-40" y2="40" x1="-40" x2="-40" strokeWidth={1} stroke="white" />
                <line y1="40" y2="40" x1="-40" x2="40" strokeWidth={1} stroke="white" />
                <text
                    text-anchor="middle"
                    alignment-baseline="middle"
                    x="0"
                    y="45"
                    fill="white"
                    font-size="5">1 hr
                </text>
                <text
                    text-anchor="middle"
                    alignment-baseline="middle"
                    x="-45"
                    y="0"
                    fill="white"
                    font-size="5">{type}
                </text>
                {drawBars()}
                {drawTicks()}
                {drawTickLabels()}
            </svg>
        </div >
    )
}

export default Histogram