import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export const convertValue = (value) => {

    if(value>1000000) return (value/1000000).toFixed(3) + 'km2'
    if(value>10000) return (value/10000).toFixed(3) + 'ha'

    return value + 'm2'
} 

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
    scales: {
        y: {
            ticks: {
                // Include a dollar sign in the ticks
                callback: function(value, index, ticks) {
                    return convertValue(value);
                }
            }
        }
    }
};


const computeData = (input,labels) => {
    return {
        labels,
        datasets: [
            {
                label: 'Ambrozia Zones',
                data: input,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                
            },
        ],
    }
};


const Chart = ({ data, labels }) => {

    return <Line options={options} data={computeData(data,labels)} />;

}

export default Chart