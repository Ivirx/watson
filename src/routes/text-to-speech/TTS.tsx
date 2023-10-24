import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { allVoices, Voice } from '../../components/voices';
import { Select } from './Select';
import { Audio } from './Audio';
import './tts.scss';

type Audio = {
	id: string;
	audioUrl: string;
	endpoint: string;
	title: string;
	text: string;
	voice: Voice;
	apikey: string;
};

export const TTS = () => {
	const [url, setUrl] = useState<string>('');
	const [apikey, setApikey] = useState<string>('');
	const [voice, setVoice] = useState<Voice>(allVoices[0]);
	const [text, setText] = useState<string>('');
	const [isOpen, setisOpen] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [error, setError] = useState<string>('');
	const [invalid, setInvalid] = useState<string>('');

	const [audios, setAudios] = useState<Audio[]>([]);

	const [isLoaded, setIsLoaded] = useState(false);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		let invalidInputs = '';

		if (!url) invalidInputs += '-url';
		if (!apikey) invalidInputs += '-apikey';
		if (!voice) invalidInputs += '-voice';
		if (!text) invalidInputs += '-text';

		if (invalidInputs) {
			setError('Please fill in all required fields!');
			setInvalid(invalidInputs);
			return;
		}

		if (
			!url.toLowerCase().startsWith('https://api.') ||
			!url.toLowerCase().endsWith('/v1/synthesize')
		) {
			console.log('not valid : ', url);
			setError('URL is not valid!');
			setInvalid('-url');
			return;
		}

		if (text.length > 400) {
			setError('Text is too long!');
			setInvalid('-text');
			return;
		}

		// console.log({ url, apikey, voice, text });

		setError('');
		setInvalid('');
		setFetching(true);

		axios
			.request({
				url: `${url}?voice=${voice?.value}`,
				method: 'POST',
				data: {
					text,
				},
				auth: {
					username: 'apikey',
					password: apikey,
				},
				headers: {
					'Content-Type': 'application/json',
					Accept: 'audio/mp3',
				},
				responseType: 'blob',
			})
			.then((response) => {
				// console.log('response', response);

				const blob = new Blob([response.data], { type: 'audio/mpeg' });
				const objectURL = URL.createObjectURL(blob);

				const newAudio: Audio = {
					id: Date.now().toString(),
					title: text.length > 100 ? text.slice(0, 100) + ' . . .' : text,
					audioUrl: objectURL,
					endpoint: url,
					apikey: apikey,
					text: text,
					voice: voice,
				};

				setAudios((pre) => [newAudio, ...pre]);
				setFetching(false);
			})
			.catch((error) => {
				// console.log('error', error);

				if (error.code === 'ERR_NETWORK') {
					setError('Please check your Internet OR URL/Apikey.');
					setInvalid('-url-apikey');
					setFetching(false);
					return;
				}

				setError(error.message);
				setInvalid('');
				setFetching(false);
			});
	}

	function removeError() {
		setError('');
		setInvalid('');
	}

	function handleDelete(id: string) {
		setAudios((pre) => pre.filter((audio) => audio.id !== id));
	}

	useEffect(() => {
		const id = setTimeout(() => {
			setIsLoaded(true);
		}, 200);

		return () => {
			clearTimeout(id);
			setIsLoaded(false);
		};
	}, []);

	return (
		<section className={`page ${isLoaded ? 'load' : ''}`}>
			<h2 className='heading'>
				<Link to={'/'}>WAtson</Link>
				<span>/&nbsp;text to speech</span>
			</h2>
			<form onSubmit={handleSubmit}>
				<div className={`url input ${/-url/g.test(invalid) ? 'invalid' : ''}`}>
					<label className='label' htmlFor='url'>
						URL
					</label>
					<input
						type='text'
						name='url'
						id='url'
						autoComplete='off'
						placeholder='. . .'
						value={url}
						onChange={(event) => setUrl(event.target.value)}
						onFocus={removeError}
					/>
				</div>
				<div className='row'>
					<div
						className={`apikey input ${/-apikey/g.test(invalid) ? 'invalid' : ''}`}
					>
						<label className='label' htmlFor='apikey'>
							Apikey
						</label>
						<input
							type='text'
							name='apikey'
							id='apikey'
							autoComplete='off'
							placeholder='. . .'
							value={apikey}
							onChange={(event) => setApikey(event.target.value)}
							onFocus={removeError}
						/>
					</div>
					<div
						className={`voice input ${isOpen ? 'opened' : 'closed'} ${
							/-voice/g.test(invalid) ? 'invalid' : ''
						}`}
					>
						<span className='label'>Voice</span>
						<Select
							selected={voice}
							setSelected={setVoice}
							allVoices={allVoices}
							setIsOpen={setisOpen}
						/>
					</div>
				</div>
				<div className={`text input ${/-text/g.test(invalid) ? 'invalid' : ''}`}>
					<label className='label' htmlFor='text'>
						Speech Text
					</label>
					<textarea
						name='text'
						id='text'
						rows={5}
						placeholder='Enter your text here . . .'
						value={text}
						onChange={(event) => setText(event.target.value)}
						onFocus={removeError}
					></textarea>
				</div>
				<div className='status'>
					{fetching && (
						<span className='fetching'>
							Fetching<span>.</span>
							<span>.</span>
							<span>.</span>
						</span>
					)}
					{error && <span className='error'>{error}</span>}
					&nbsp;
				</div>
				<div className='button'>
					<button type='submit'>Synthesize</button>
				</div>
			</form>
			<div className='audio'>
				<h2>Your Audios</h2>
				{!audios.length && <p className='no-audio'>You have no audios yet.</p>}
				{audios.map((audio) => (
					<Audio key={audio.id} audio={audio} handleDelete={handleDelete} />
				))}
			</div>
		</section>
	);
};
