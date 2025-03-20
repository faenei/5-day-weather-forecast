import { useState } from 'react'
import axios from 'axios'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

function App() {
	// State variables for city input, weather data, forecast, error handling, and loading state
	const [city, setCity] = useState('')
	const [weather, setWeather] = useState(null)
	const [forecast, setForecast] = useState([])
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	// Replace with your OpenWeatherMap API key
	const apiKey = '9e94da372597a207dc5c8110b8b6c3b8'

	// Fetches weather data and forecast for the entered city
	const fetchWeather = async () => {
		setLoading(true)
		try {
			// Fetch current weather data from OpenWeatherMap API
			const weatherResponse = await axios.get(
				`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
			)
			setWeather(weatherResponse.data)

			// Fetch 5-day forecast data from OpenWeatherMap API
			const forecastResponse = await axios.get(
				`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
			)

			// Filter forecast data to get only one entry per day (around 12:00 PM)
			const dailyForecast = forecastResponse.data.list.filter(item =>
				item.dt_txt.includes('12:00:00')
			)
			setForecast(dailyForecast)

			setError('') // Clear any previous errors
		} catch {
			// Handle errors (e.g., city not found)
			setError('City not found')
			setWeather(null)
			setForecast([])
		}
		setLoading(false) // Reset loading state
	}

	// Handles form submission to fetch weather data
	const handleSubmit = e => {
		e.preventDefault()
		if (city.trim()) fetchWeather() // Fetch weather only if the city input is not empty
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-white/20 backdrop-blur-lg rounded-lg shadow-lg p-6 w-full max-w-lg border border-white/30'
			>
				{/* App title */}
				<h1 className='text-2xl font-bold text-center text-white mb-4'>
					Weather
				</h1>

				{/* Search form */}
				<form onSubmit={handleSubmit} className='flex gap-2 mb-4'>
					<input
						type='text'
						value={city}
						onChange={e => setCity(e.target.value)}
						placeholder='Enter a city'
						className='flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 text-gray-800 placeholder-gray-500'
					/>
					<button
						type='submit'
						className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition'
					>
						Search
					</button>
				</form>

				{/* Loading state */}
				{loading && (
					<p className='text-center text-white animate-pulse'>Loading...</p>
				)}

				{/* Error message */}
				{error && <p className='text-red-300 text-center'>{error}</p>}

				{/* Display current weather data */}
				{weather && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className='text-center text-white'
					>
						<h2 className='text-xl font-semibold'>
							{weather.name}, {weather.sys.country}
						</h2>
						<div className='flex justify-center items-center my-4'>
							<img
								src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
								alt='weather icon'
								className='w-16 h-16'
							/>
							<p className='text-4xl font-bold'>
								{Math.round(weather.main.temp)}°C
							</p>
						</div>
						<p className='text-gray-200 capitalize'>
							{weather.weather[0].description}
						</p>
						<div className='mt-4 grid grid-cols-2 gap-4'>
							<p>Humidity: {weather.main.humidity}%</p>
							<p>Wind: {weather.wind.speed} m/s</p>
						</div>
					</motion.div>
				)}

				{/* Display 5-day forecast */}
				{forecast.length > 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className='mt-6'
					>
						<h3 className='text-lg font-semibold text-white text-center mb-4'>
							5-Day Forecast
						</h3>
						<div className='grid grid-cols-2 sm:grid-cols-5 gap-4'>
							{forecast.map((day, index) => (
								<div
									key={index}
									className='bg-white/10 p-3 rounded-lg text-center text-white'
								>
									<p className='text-sm'>
										{new Date(day.dt * 1000).toLocaleDateString('en', {
											weekday: 'short',
										})}
									</p>
									<img
										src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
										alt='forecast icon'
										className='w-10 h-10 mx-auto'
									/>
									<p className='text-lg font-bold'>
										{Math.round(day.main.temp)}°C
									</p>
									<p className='text-xs capitalize'>
										{day.weather[0].description}
									</p>
								</div>
							))}
						</div>
					</motion.div>
				)}
			</motion.div>
		</div>
	)
}

export default App
