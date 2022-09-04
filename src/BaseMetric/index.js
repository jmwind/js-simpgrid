import { useEffect, useState, useRef } from "preact/hooks"
import style from './style.module.css'
import { SkConversions } from 'sk-jsclient/sk-data'

const BaseMetric = (props) => {
    const [time, setTime] = useState(Date.now());
    const [metrics, setMetrics] = useState(props.metrics);

    // update metrics every 1s
    useEffect(() => {
        let timer = setInterval(() => setTime(Date.now()), Math.random() * 1000);
        return () => clearInterval(timer);
    }, []);

    let m = metrics[props.metric_name];
    let m_val = SkConversions.fromMetric(m).toFixed(m.rounding);

    return (
        <div class={style.number_card}>
            <span style={{ color: "white", textAlign: "center", fontSize: "10vw" }}>{m_val}</span>
            <span style={{ color: "white", paddingRight: 20, textAlign: "right", fontSize: "1.5vw" }}>{m.nameUnit}</span>
        </div>
    );
}

export default BaseMetric;
