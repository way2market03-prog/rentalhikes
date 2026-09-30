'use client'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

const CITIES = ['Delhi', 'Noida', 'Greater Noida', 'Ghaziabad']
const MAX_BUDGET = 100000

// key, nav label, options (budget is a special slider section)
const SECTIONS = [
	{ key: 'budget', title: 'Monthly Budget' },
	{ key: 'with', title: 'Properties With', options: ['Photos', 'Videos'] },
	{ key: 'bhk', title: 'BHK Configuration', options: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'] },
	{ key: 'bath', title: 'Bathrooms', options: ['1', '2', '3', '4+'] },
	{ key: 'floor', title: 'Floor Level', options: ['Basement', 'Ground', '1-4', '5-8', '9-12', '13-16', '16+'] },
	{ key: 'type', title: 'Property Type', options: ['Builder Floor', 'Flat/Apartment', 'Villa/House', '1RK/Studio', 'Farmhouse', 'Other'] },
	{ key: 'by', title: 'Posted By', options: ['Owner', 'Property Consultant'], checkbox: true },
	{ key: 'pref', title: 'Preferred For', options: ['Family', 'Single Men', 'Single Women', 'Anyone'] },
	{ key: 'furn', title: 'Furnishing', options: ['Fully', 'Semi', 'Unfurnished'] },
	{ key: 'age', title: 'Property Age (in years)', options: ['0-1', 'Less than 5', '5-10', '10+'] },
]
const TABS = [
	{ id: 'residential', label: 'Residential', placeholder: 'Search by Builder' },
	{ id: 'commercial', label: 'Commercial', placeholder: 'Search by Offices' },
	{ id: 'pg', label: 'PG / Flat Share', placeholder: 'Search by Locality or PG' },
]
const EMPTY_SEL = { with: [], bhk: [], bath: [], floor: [], type: [], by: [], pref: [], furn: [], age: [] }
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN')

export default function Others1() {
	const [tab, setTab] = useState('residential')
	const [showAdv, setShowAdv] = useState(false)
	const [section, setSection] = useState('budget')
	const [cityOpen, setCityOpen] = useState(false)
	const [cityQuery, setCityQuery] = useState('')
	const [cities, setCities] = useState([])
	const [query, setQuery] = useState('')
	const [range, setRange] = useState([0, MAX_BUDGET])
	const [sel, setSel] = useState(EMPTY_SEL)
	const [coords, setCoords] = useState(null)
	const [locState, setLocState] = useState('idle') // idle | busy | done | error
	const [locMsg, setLocMsg] = useState('')
	const cityRef = useRef(null)

	useEffect(() => {
		const onDoc = (e) => cityRef.current && !cityRef.current.contains(e.target) && setCityOpen(false)
		document.addEventListener('mousedown', onDoc)
		return () => document.removeEventListener('mousedown', onDoc)
	}, [])

	const useCurrentLocation = () => {
		if (locState === 'busy') return
		if (coords) {
			// second click clears the location
			setCoords(null); setLocState('idle'); setLocMsg('')
			return
		}
		if (!('geolocation' in navigator)) {
			setLocState('error'); setLocMsg('Location is not supported in this browser.')
			return
		}
		setLocState('busy'); setLocMsg('Getting your location…')
		navigator.geolocation.getCurrentPosition(
			async ({ coords: { latitude, longitude } }) => {
				setCoords({ lat: latitude, lng: longitude })
				try {
					const res = await fetch(
						`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&lat=${latitude}&lon=${longitude}`
					)
					const data = await res.json()
					const a = data.address || {}
					const locality = a.suburb || a.neighbourhood || a.city_district || a.village || a.town || a.city || ''
					const text = Object.values(a).join(' ').toLowerCase()
					// longest names first so "Greater Noida West" wins over "Greater Noida"/"Noida"
					const match = [...CITIES].sort((x, y) => y.length - x.length).find((c) => text.includes(c.toLowerCase()))
					if (match) setCities([match])
					if (locality) setQuery(locality)
					setLocMsg(locality ? `Near ${locality}${match ? `, ${match}` : ''}` : 'Using your current location')
				} catch {
					setLocMsg('Using your current location')
				}
				setLocState('done')
			},
			(err) => {
				setLocState('error')
				setLocMsg(
					err.code === 1
						? 'Location permission denied. Allow location access in your browser settings and try again.'
						: err.code === 3
							? 'Location request timed out. Please try again.'
							: 'Could not get your location.'
				)
			},
			{ enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
		)
	}

	const allSelected = cities.length === CITIES.length
	const cityLabel = !cities.length || allSelected ? 'Cities' : cities.length === 1 ? cities[0] : `${cities.length} Cities`
	const shownCities = CITIES.filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase()))
	const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

	const params = new URLSearchParams({ category: tab })
	if (cities.length && !allSelected) params.set('cities', cities.join(','))
	if (query) params.set('q', query)
	if (coords) { params.set('lat', coords.lat.toFixed(5)); params.set('lng', coords.lng.toFixed(5)) }
	if (range[0] > 0) params.set('minBudget', range[0])
	if (range[1] < MAX_BUDGET) params.set('maxBudget', range[1])
	Object.entries(sel).forEach(([k, v]) => v.length && params.set(k, v.join(',')))
	const href = `/search-result?${params.toString()}`

	const active = TABS.find((t) => t.id === tab)
	const current = SECTIONS.find((s) => s.key === section)
	const pct = (n) => (n / MAX_BUDGET) * 100
	const badge = (s) => (s.key === 'budget' ? (range[0] > 0 || range[1] < MAX_BUDGET ? '•' : 0) : sel[s.key].length)

	return (
		<div className="others-section-area">
			<div className="container">
				<div className="row">
					<div className="col-lg-12">
						<div className="theme-btn1 open-search-filter-form">
							<p className="open-text">Open Search Form
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path></svg>
							</p>
							<p className="close-text">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>
								Close
							</p>
						</div>

						<div className="property-tab-section search-filter-form">
							<div className="rs">
								<div className="rs-tabs" role="tablist">
									{TABS.map((t) => (
										<button key={t.id} type="button" role="tab" aria-selected={tab === t.id}
											className={`rs-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
											{t.label}
										</button>
									))}
								</div>

								<div className="rs-panel">
									<div className="rs-row">
										<div className="rs-field city" ref={cityRef}>
											<span className="rs-sr">City</span>
											<button type="button" className="rs-btn-field" onClick={() => setCityOpen(!cityOpen)}>
												{cityLabel} <span>{cityOpen ? '▴' : '▾'}</span>
											</button>
											{cityOpen && (
												<div className="rs-menu">
													<input type="text" placeholder="Search city..." value={cityQuery} onChange={(e) => setCityQuery(e.target.value)} />
													<label className="rs-check">
														<input type="checkbox" checked={allSelected} onChange={() => setCities(allSelected ? [] : [...CITIES])} /> All Cities
													</label>
													{shownCities.map((c) => (
														<label className="rs-check" key={c}>
															<input type="checkbox" checked={cities.includes(c)} onChange={() => setCities(toggle(cities, c))} /> {c}
														</label>
													))}
												</div>
											)}
										</div>

										<div className="rs-field grow">
											<label htmlFor="rs-q" className="rs-sr">Search</label>
											<input id="rs-q" className="rs-input" type="text" placeholder={active.placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
										</div>

										<button type="button" onClick={useCurrentLocation}
											className={`rs-loc${locState === 'busy' ? ' busy' : ''}${coords ? ' on' : ''}`}
											title={coords ? 'Clear current location' : 'Use current location'}
											aria-label={coords ? 'Clear current location' : 'Use current location'}>
											<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
												<circle cx="12" cy="12" r="3.5" /><circle cx="12" cy="12" r="8" />
												<path d="M12 1v3M12 20v3M1 12h3M20 12h3" />
											</svg>
										</button>

										{tab === 'residential' && (
											<div className="rs-field adv">
												<button type="button" className={`rs-btn-field adv-btn${showAdv ? ' open' : ''}`} onClick={() => setShowAdv(!showAdv)} aria-expanded={showAdv}>
													<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.17071 18C6.58254 16.8348 7.69378 16 9 16C10.3062 16 11.4175 16.8348 11.8293 18H22V20H11.8293C11.4175 21.1652 10.3062 22 9 22C7.69378 22 6.58254 21.1652 6.17071 20H2V18H6.17071ZM12.1707 11C12.5825 9.83481 13.6938 9 15 9C16.3062 9 17.4175 9.83481 17.8293 11H22V13H17.8293C17.4175 14.1652 16.3062 15 15 15C13.6938 15 12.5825 14.1652 12.1707 13H2V11H12.1707ZM6.17071 4C6.58254 2.83481 7.69378 2 9 2C10.3062 2 11.4175 2.83481 11.8293 4H22V6H11.8293C11.4175 7.16519 10.3062 8 9 8C7.69378 8 6.58254 7.16519 6.17071 6H2V4H6.17071Z"/></svg> Advance
												</button>
											</div>
										)}

										<Link href={href} className="rs-go">Search</Link>
									</div>

									{locMsg && <div className={`rs-note${locState === 'error' ? ' err' : ''}`} role="status">{locMsg}</div>}

									{tab === 'residential' && showAdv && (
										<div className="rs-adv">
											<div className="rs-body">
												<div className="rs-title">
													{current.title}
													{current.key === 'budget' && `: ${inr(range[0])} - ${inr(range[1])}${range[1] >= MAX_BUDGET ? '+' : ''}`}
												</div>

												{current.key === 'budget' ? (
													<div className="rs-slider">
														<div className="rs-track" />
														<div className="rs-fill" style={{ left: `${pct(range[0])}%`, right: `${100 - pct(range[1])}%` }} />
														<input type="range" min={0} max={MAX_BUDGET} step={1000} value={range[0]}
															onChange={(e) => setRange([Math.min(+e.target.value, range[1]), range[1]])} />
														<input type="range" min={0} max={MAX_BUDGET} step={1000} value={range[1]}
															onChange={(e) => setRange([range[0], Math.max(+e.target.value, range[0])])} />
													</div>
												) : current.checkbox ? (
													<div className="rs-boxes">
														{current.options.map((o) => {
															const on = sel[current.key].includes(o)
															return (
																<button type="button" key={o} className={`rs-box${on ? ' on' : ''}`}
																	style={{ border: 0, background: 'none', padding: 0 }} aria-pressed={on}
																	onClick={() => setSel({ ...sel, [current.key]: toggle(sel[current.key], o) })}>
																	<i>{on ? '✓' : ''}</i> {o}
																</button>
															)
														})}
													</div>
												) : (
													<div className="rs-chips">
														{current.options.map((o) => (
															<button type="button" key={o}
																className={`rs-chip${sel[current.key].includes(o) ? ' on' : ''}`}
																aria-pressed={sel[current.key].includes(o)}
																onClick={() => setSel({ ...sel, [current.key]: toggle(sel[current.key], o) })}>
																{o}
															</button>
														))}
													</div>
												)}
											</div>

											<nav className="rs-nav" aria-label="Filter sections">
												{SECTIONS.map((s) => (
													<button type="button" key={s.key} className={section === s.key ? 'active' : ''} onClick={() => setSection(s.key)}>
														{s.title}
														{badge(s) ? <span className="rs-count">{badge(s)}</span> : null}
													</button>
												))}
											</nav>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}