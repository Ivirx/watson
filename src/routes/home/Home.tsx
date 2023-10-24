import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import './home.scss';

export const Home = () => {
	const homeRef = useRef<HTMLDivElement>(null);
	const [onHome, setOnHome] = useState(sessionStorage.getItem('onHome') === 'true');
	const [number, setNumber] = useState(0);

	useEffect(() => {
		if (onHome) {
			homeRef.current?.classList.remove('load');
			homeRef.current?.classList.remove('no-delay');

			setTimeout(() => {
				homeRef.current?.classList.add('no-delay');
			}, 50);

			return () => {
				sessionStorage.setItem('onHome', 'true');
			};
		}

		let timeIntervalID: number;
		let timeoutID = setTimeout(() => {
			timeIntervalID = setInterval(() => {
				setNumber((pre) => {
					if (pre > 99) {
						clearTimeout(timeoutID);
						clearInterval(timeIntervalID);
						setOnHome(true);
						return pre;
					}
					return pre + 2;
				});
			}, 15);
		}, 500);

		return () => {
			clearTimeout(timeoutID);
			clearInterval(timeIntervalID);
			setOnHome(false);

			sessionStorage.setItem('onHome', 'true');
		};
	}, []);

	return (
		<>
			<div className={`loading ${onHome ? 'fade' : ''}`}>
				<div>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						strokeWidth='2'
						stroke='white'
						fill='none'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
						<path d='M12 5l0 14'></path>
						<path d='M5 12l14 0'></path>
					</svg>
					<span>{number}</span>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						strokeWidth='2'
						stroke='white'
						fill='none'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
						<path d='M12 5l0 14'></path>
						<path d='M5 12l14 0'></path>
					</svg>
				</div>
			</div>
			<section ref={homeRef} className={`home ${onHome ? 'load' : ''}`}>
				<div className='home__grid'>
					<div className='first'>
						<div>
							<p>
								<span>i</span>bM
							</p>
							<p>
								W<span>A</span>tson
							</p>
						</div>
					</div>
					<div className='second'></div>
					<div className='third'></div>
					<div className='fourth'>
						<div>
							<Link to='tts'>
								<span>/</span>
								<span>/</span>
								<p>text to speecH</p>
							</Link>
							<Link to='stt'>
								<span>/</span>
								<span>/</span>
								<p>speecH to text</p>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};
