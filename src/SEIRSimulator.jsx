import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  Tooltip,
  Filler,
  LineController,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip, Filler, LineController);

function SEIRSimulator() {
  const defaultInputs = { S: 990, E: 5, beta: 0.3 };
  const [inputs, setInputs] = useState(defaultInputs);
  const [data, setData] = useState(null);
  const [plateauDay, setPlateauDay] = useState(null);
  const [plateauValue, setPlateauValue] = useState(null);
  const [simulated, setSimulated] = useState(false);
  const [showPlateauTip, setShowPlateauTip] = useState(false);
  const [showBetaTip, setShowBetaTip] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.body.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) });
  };

  const simulateSEIR = () => {
    const { S, E, beta } = inputs;
    const I = 5;
    const R = 0;
    const gamma = 0.1;
    const sigma = 0.2;
    const days = 100;
    const dt = 1;
    const time = [...Array(days).keys()];
    let s = S, e = E, i = I, r = R;
    let S_arr = [], E_arr = [], I_arr = [], R_arr = [];
    let plateauReached = null;

    for (let t = 0; t < days; t++) {
      S_arr.push(s);
      E_arr.push(e);
      I_arr.push(i);
      R_arr.push(r);

      const N = s + e + i + r;
      const newS = s - beta * s * i / N * dt;
      const newE = e + (beta * s * i / N - sigma * e) * dt;
      const newI = i + (sigma * e - gamma * i) * dt;
      const newR = r + gamma * i * dt;

      if (!plateauReached && t > 5 && Math.abs(I_arr[t] - I_arr[t - 1]) < 0.01) {
        plateauReached = t;
      }

      s = newS;
      e = newE;
      i = newI;
      r = newR;
    }

    setPlateauDay(plateauReached);
    setPlateauValue(plateauReached !== null ? I_arr[plateauReached] : null);
    setSimulated(true);

    const infectiousColor = isDark ? 'rgb(255, 181, 158)' : '#C65D3B';
    const recoveredColor = isDark ? 'rgb(224, 113, 77)' : '#1E1E1E';
    const plateauColor = isDark ? 'rgb(250, 183, 162)' : '#EDE6DA';

    setData({
      labels: time,
      datasets: [
        {
          label: 'Infectious I(t)',
          data: I_arr,
          borderColor: infectiousColor,
          backgroundColor: isDark ? 'rgba(255, 181, 158, 0.1)' : 'rgba(198, 93, 59, 0.1)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Recovered R(t)',
          data: R_arr,
          borderColor: recoveredColor,
          backgroundColor: isDark ? 'rgba(224, 113, 77, 0.1)' : 'rgba(30, 30, 30, 0.05)',
          fill: true,
          tension: 0.3,
        },
        plateauReached !== null
          ? {
              label: 'Plateau',
              data: time.map((_, idx) => (idx === plateauReached ? I_arr[idx] : null)),
              borderColor: plateauColor,
              backgroundColor: plateauColor,
              pointRadius: 5,
              showLine: false,
            }
          : null,
      ].filter(Boolean),
    });
  };

  const formatPlateauTime = (days) => {
    const y = Math.floor(days / 365);
    const m = Math.floor((days % 365) / 30);
    const d = days % 30;
    return `${y} year${y !== 1 ? 's' : ''}, ${m} month${m !== 1 ? 's' : ''}, and ${d} day${d !== 1 ? 's' : ''}`;
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SEIR Simulator</h1>

      <div className="text-lg text-center italic mb-6 bg-white dark:bg-zinc-900 p-4 rounded shadow">
        A
        <select
          className="mx-2 px-2 py-1 border rounded"
          value={inputs.beta > 0.5 ? 'high' : inputs.beta < 0.2 ? 'low' : 'medium'}
          onChange={(e) => {
            const preset = e.target.value;
            const newBeta = preset === 'high' ? 0.7 : preset === 'low' ? 0.1 : 0.3;
            setInputs({ ...inputs, beta: newBeta });
          }}
        >
          <option value="high">highly contagious virus</option>
          <option value="medium">moderately contagious virus</option>
          <option value="low">slow-spreading virus</option>
        </select>
        in an initial population of
        <input
          type="number"
          name="S"
          value={inputs.S}
          onChange={handleChange}
          className="mx-2 w-24 px-2 py-1 border rounded"
        />
        susceptible individuals, which already has
        <input
          type="number"
          name="E"
          value={inputs.E}
          onChange={handleChange}
          className="mx-2 w-24 px-2 py-1 border rounded"
        />
        exposed individuals,
        and the disease's transmissibility is
        <span className="relative inline-block">
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            name="beta"
            value={inputs.beta}
            onChange={handleChange}
            className="mx-2 w-20 px-2 py-1 border rounded"
          />
          <span
            className="text-blue-600 cursor-pointer"
            onMouseEnter={() => setShowBetaTip(true)}
            onMouseLeave={() => setShowBetaTip(false)}
          >
            ❓
          </span>
          {showBetaTip && (
            <div className="absolute left-0 mt-2 w-64 bg-white text-sm text-gray-800 border border-gray-300 rounded shadow p-2 z-10">
              Transmission rate (β): how quickly the disease spreads (typically ranges from 0.1 to 1.0)
            </div>
          )}
        </span>
        .
        {simulated && (
          <span className="ml-2">
            It will take
            <span className="font-semibold mx-1">
              {plateauDay !== null ? formatPlateauTime(plateauDay) : 'more than 100 days'}
            </span>
            to plateau
            <span
              className="text-blue-600 cursor-pointer ml-1"
              onMouseEnter={() => setShowPlateauTip(true)}
              onMouseLeave={() => setShowPlateauTip(false)}
            >
              ❓
            </span>
            {showPlateauTip && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white text-sm text-gray-800 border border-gray-300 rounded shadow p-2 z-10">
                Plateauing refers to the point in a disease outbreak where the number of infectious individuals stabilizes — meaning the rate of new infections balances with the rate of recoveries.
              </div>
            )}
            .
          </span>
        )}
      </div>

      <div className="text-center mb-6">
        <button
          onClick={simulateSEIR}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Simulate
        </button>
      </div>

      {data && (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded shadow transition-all duration-700 ease-in-out">
          <Line
            data={data}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    font: {
                      family: 'Georgia',
                      size: 14,
                      style: 'italic',
                    },
                  },
                },
                tooltip: {
                  bodyFont: {
                    family: 'Georgia',
                    size: 12,
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Time (days)',
                    font: {
                      family: 'Times New Roman',
                      size: 14,
                      style: 'italic',
                    },
                  },
                  ticks: {
                    font: {
                      family: 'Times New Roman',
                      size: 12,
                    },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Population count',
                    font: {
                      family: 'Times New Roman',
                      size: 14,
                      style: 'italic',
                    },
                  },
                  ticks: {
                    font: {
                      family: 'Times New Roman',
                      size: 12,
                    },
                  },
                },
              },
              animation: {
                duration: 800,
                easing: 'easeOutQuart',
              },
              layout: {
                padding: 16,
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default SEIRSimulator;
