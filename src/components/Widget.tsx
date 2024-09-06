import React, { useState, useEffect } from 'react'
import Logo from './Logo';
import Loader from './Loader';


interface BtcPriceResponse {
    bitcoin: {
        usd: number;
    };
}
const Widget = () => {
    //states stored in the widget
    const [btcPrice, setBtcPrice] = useState<number | null>(null);
    const [usdAmount, setUsdAmount] = useState<string>('');
    const [btcAmount, setBtcAmount] = useState<string>(' -- ');
    const [lastUpdated, setLastUpdated] = useState<string>(' -- ');
    const [loading, setLoading] = useState(false)

    //API url to get btc price from env file
    const API = process.env.REACT_APP_API_URL;
    //fetch prices after the component mounts
    useEffect(() => {
        fetchBtcPrice();
    }, []);


    // Format the number as currency with commas
    const FormatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const LastUpdatedDate = () => {
        const date = new Date();

        // Get the day, month, year, and time details
        const day = date.getUTCDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getUTCFullYear();

        // Get the hour and minute, and format them to 12-hour format
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format

        // Format the time with leading zeros for minutes
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

        // Construct the final string
        return `${day}, ${month} ${year} | ${hours}:${formattedMinutes} ${ampm}`;
    }

    //Fetching current bitcoin prices
    const fetchBtcPrice = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API}`);
            const data: BtcPriceResponse = await response.json();
            const price = data.bitcoin.usd;
            setBtcPrice(price);
            setLastUpdated(LastUpdatedDate());
            setLoading(false)
        } catch (error) {
            console.log(`Error fetching Bitcoin price(${error})`);
        }
    };

    //handle  price changes on input change
    const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsdAmount(value);
        //check to sanitize input and set maximum allowed usd price
        if (value && !isNaN(Number(value)) && Number(value) <= 100000000 && Number(value) >= 0) {
            const convertedBtc = (Number(value) / (btcPrice || 1)).toFixed(8);
            setBtcAmount(convertedBtc);
        } else {
            setBtcAmount('--');
        }
    };

    return (

        <div className="flex items-center justify-center min-h-screen  w-full lg:w-[450px] mx-auto">
            {loading ? <Loader /> :
                <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xs">
                    <div className='flex items-center justify-between mb-4'>
                        <Logo size='sm' />
                        {/* <h1 className="text-xl font-bold text-gray-800 mr-2">Bitcoin Converter</h1>
                    <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8bWV0YWRhdGE+IFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIDwvbWV0YWRhdGE+DQo8Zz48Zz48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNODIuNCwxOTMuMmMtMS4xLTAuNi0yLjctMS4yLTQuOS0xLjhjMi0wLjcsMy42LTEuNSw0LjgtMi42YzEuMi0xLjEsMi4xLTIuMywyLjgtMy42YzAuNy0xLjMsMS0yLjgsMS00LjNjMC0yLjEtMC42LTQtMS44LTUuN2MtMS4yLTEuOC0zLTMuMS01LjItNGMtMC45LTAuNC0xLjktMC42LTMuMS0wLjl2LThoLTcuN3Y3LjVoLTV2LTcuNWgtNy43djcuNUg0My43djYuM2gxLjhjMS4yLDAsMiwwLjEsMi40LDAuM3MwLjcsMC41LDAuOSwwLjljMC4yLDAuMywwLjMsMS4yLDAuMywyLjZ2MjUuNGMwLDEuMy0wLjEsMi4yLTAuMywyLjZjLTAuMiwwLjQtMC41LDAuNy0wLjksMC45cy0xLjIsMC4zLTIuNCwwLjNoLTEuOHY2LjNoMTEuOHY3LjVoNy43di03LjVoNC40YzAuMiwwLDAuNCwwLDAuNiwwdjcuNWg3Ljd2LTguMWMxLjMtMC4yLDIuNC0wLjYsMy40LTAuOWMyLjctMSw0LjctMi42LDYuMi00LjdjMS41LTIsMi4yLTQuMywyLjItNi43YzAtMi0wLjUtMy45LTEuNC01LjVDODUuMywxOTUuNCw4NCwxOTQuMSw4Mi40LDE5My4yeiBNNjAuNCwxNzcuMmg1YzIuOSwwLDUsMC4yLDYuMSwwLjVjMS4xLDAuNCwyLDEsMi42LDEuOGMwLjYsMC45LDAuOSwxLjksMC45LDMuMWMwLDEuMi0wLjMsMi4yLTAuOSwzLjFjLTAuNiwwLjktMS42LDEuNS0yLjgsMmMtMS4yLDAuNC0zLjIsMC43LTUuOCwwLjdoLTVWMTc3LjJMNjAuNCwxNzcuMnogTTc0LjUsMjA1LjRjLTAuOSwxLjEtMiwxLjktMy4yLDIuM2MtMS4zLDAuMy0yLjksMC41LTQuOCwwLjVoLTMuM2MtMS4xLDAtMS44LTAuMS0yLTAuMmMtMC4yLTAuMS0wLjQtMC4zLTAuNS0wLjZjLTAuMS0wLjItMC4xLTEuMS0wLjEtMi41VjE5NWg1LjljMi42LDAsNC41LDAuMiw1LjgsMC43YzEuMiwwLjUsMi4yLDEuMiwyLjgsMi4xYzAuNiwwLjksMSwyLjEsMSwzLjRDNzUuOSwyMDIuOSw3NS40LDIwNC4yLDc0LjUsMjA1LjR6IE0yMjMuNSwxMzMuN2MtMS45LTMtNS45LTQtOS0yLjFsLTMxLDE5LjRjLTMuMSwxLjktNCw1LjktMi4xLDljMS45LDMuMSw1LjksNCw5LDIuMWwxNy43LTExLjFjLTkuNCwzMi4zLTM3LjYsNTYuMS03MS44LDU5LjJjLTUuMSwwLjQtMTAuMiwwLjMtMTUuMi0wLjFjMC41LTEuNiwxLTMuMiwxLjQtNC45YzMuNS0xNC44LDEtMzAuMS03LTQzLjFjLTgtMTMtMjAuNi0yMi0zNS40LTI1LjVjLTQuMy0xLTguNy0xLjUtMTMuMS0xLjVjLTI2LjUsMC00OS4zLDE4LjEtNTUuNSw0NGMtMy41LDE0LjgtMSwzMC4xLDcsNDMuMXMyMC42LDIyLDM1LjQsMjUuNWM0LjMsMSw4LjcsMS41LDEzLjEsMS41YzIwLjEsMCwzOC0xMC4zLDQ4LjItMjYuNmM0LjUsMC42LDksMSwxMy41LDFjMi45LDAsNS44LTAuMiw4LjgtMC40YzM5LjgtMy43LDcyLjYtMzEuNSw4My4zLTY5LjJsMTEsMTcuNmMxLjIsMiwzLjQsMyw1LjUsM2MxLjIsMCwyLjQtMC4zLDMuNC0xYzMtMS45LDQtNS45LDIuMS05TDIyMy41LDEzMy43eiBNNjcuMSwyMzYuMmMtMy40LDAtNi44LTAuNC0xMC4xLTEuMmMtMTEuNC0yLjctMjEuMS05LjctMjcuMy0xOS43Yy02LjItMTAtOC4xLTIxLjgtNS40LTMzLjJjNC43LTIwLDIyLjMtMzMuOSw0Mi44LTMzLjljMy40LDAsNi44LDAuNCwxMC4xLDEuMmMxMS40LDIuNywyMS4xLDkuNiwyNy4zLDE5LjdjNi4yLDEwLDguMSwyMS44LDUuNCwzMy4yQzEwNS4xLDIyMi4yLDg3LjYsMjM2LjIsNjcuMSwyMzYuMnogTTIwMiw4LjNjLTQuMy0xLTguNy0xLjUtMTMuMS0xLjVDMTY5LDYuOCwxNTEuMiwxNywxNDEsMzNjLTYuOS0wLjktMTMuOC0xLjEtMjAuOS0wLjVDODAuNSwzNi4xLDQ3LjgsNjMuNywzNywxMDEuMkwyNi42LDgzLjVjLTEuOC0zLjEtNS44LTQuMi04LjktMi4zYy0zLjEsMS44LTQuMSw1LjgtMi4zLDguOWwxOC41LDMxLjVjMS4yLDIuMSwzLjQsMy4yLDUuNiwzLjJjMS4xLDAsMi4zLTAuMywzLjMtMC45bDMxLjUtMTguNWMzLjEtMS44LDQuMS01LjgsMi4zLTguOWMtMS44LTMuMS01LjgtNC4yLTguOS0yLjNsLTE4LjIsMTAuN2M5LjQtMzIuNCwzNy42LTU2LjMsNzEuOC01OS40YzQuNi0wLjQsOS4yLTAuMywxMy43LDBjLTAuNiwxLjctMS4xLDMuNS0xLjUsNS4zYy0zLjUsMTQuOC0xLDMwLjEsNyw0My4xYzgsMTMsMjAuNiwyMiwzNS40LDI1LjVjNC4zLDEsOC43LDEuNSwxMy4xLDEuNWMyNi42LDAsNDkuNC0xOC4xLDU1LjUtNDRDMjUxLjcsNDYuMywyMzIuNywxNS41LDIwMiw4LjN6IE0yMzEuOCw3My45Yy00LjcsMjAtMjIuMywzMy45LTQyLjgsMzMuOWMtMy40LDAtNi44LTAuNC0xMC4xLTEuMmMtMTEuNC0yLjctMjEuMS05LjctMjcuMy0xOS43Yy02LjItMTAtOC4xLTIxLjgtNS40LTMzLjJjNC43LTIwLDIyLjMtMzMuOSw0Mi44LTMzLjljMy40LDAsNi44LDAuNCwxMC4xLDEuMkMyMjIuNywyNi42LDIzNy40LDUwLjMsMjMxLjgsNzMuOXogTTIwNi4yLDc0LjRjMCw2LjktNC45LDEyLjktMTMuOSwxNC40djhoLTcuNnYtNy40Yy01LjItMC4yLTEwLjMtMS42LTEzLjMtMy40bDIuMy05LjFjMy4zLDEuOCw3LjksMy40LDEzLDMuNGM0LjUsMCw3LjUtMS43LDcuNS00LjhjMC0zLTIuNS00LjgtOC4zLTYuOGMtOC40LTIuOC0xNC02LjctMTQtMTQuM2MwLTYuOSw0LjgtMTIuMiwxMy4yLTEzLjl2LTcuNGg3LjZWNDBjNS4yLDAuMiw4LjcsMS4zLDExLjMsMi42bC0yLjMsOC44Yy0yLTAuOC01LjYtMi42LTExLjMtMi42Yy01LjEsMC02LjcsMi4yLTYuNyw0LjRjMCwyLjYsMi43LDQuMiw5LjMsNi43QzIwMi40LDYzLjEsMjA2LjIsNjcuNCwyMDYuMiw3NC40eiIvPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48L2c+PC9nPg0KPC9zdmc+" width="32" height="32" />
                </div> */}
                    </div>
                    <div className="mb-4">
                        <p className="text-[#575D5E] text-[12px] lg:text-[14px] font-[400]">Current Bitcoin Price (USD)</p>
                        <p className="text-[#575D5E] text-[14px]  lg:text-[16px] font-[600]">
                            {btcPrice ? `${FormatCurrency(btcPrice)}` : '--'}
                        </p>
                    </div>

                    <div className="mb-4 flex items-center text-[#A5ABA7] text-[13px] font-[400]">
                        <p className="">Last Updated:</p>
                        <p className="ml-2">{lastUpdated}</p>
                    </div>

                    <div className="mb-4">
                        <label className="text-[#575D5E] text-[12px] lg:text-[14px] font-[400]">Enter amount</label>
                        <input
                            type="number"
                            value={usdAmount}
                            onChange={handleUsdChange}
                            max="100000000"
                            min="0"
                            className="w-full p-2 border border-[#E8EDEE] rounded-xl outline-none text-[15px] "
                            placeholder="Enter amount in USD"
                        />
                    </div>

                    <div>
                        <p className="text-[#575D5E] text-[12px] lg:text-[14px] font-[400]">Equivalent BTC</p>
                        <p className="text-[#575D5E] text-[14px] font-[600]">{btcAmount}</p>
                    </div>
                </div>}
        </div>

    );
}

export default Widget
