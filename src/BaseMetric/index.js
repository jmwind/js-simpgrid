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
            <span class={style.number_middle}>{m_val}</span>
            <span class={style.number_unit}>{m.nameUnit}</span>
        </div>
    );
}

export default BaseMetric;
