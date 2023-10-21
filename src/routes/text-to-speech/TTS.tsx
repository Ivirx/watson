import { useState } from 'react';

import { allVoices, Voice } from '../../components/voices';
import { Select } from './Select';
import './tts.scss';

export const TTS = () => {
	const [url, setUrl] = useState<string>('');
	const [apikey, setApikey] = useState<string>('');
	const [voice, setVoice] = useState<Voice>(allVoices[0]);
	const [text, setText] = useState<string>('');
	const [isOpen, setisOpen] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [error, setError] = useState<string>('');
	const [invalid, setInvalid] = useState<string>('');

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

		if (text.length > 200) {
			setError('Text is too long!');
			setInvalid('-text');
			return;
		}

		console.log({ url, apikey, voice, text });

		setError('');
		setInvalid('');
		setFetching(true);
		setTimeout(() => {
			setFetching(false);
			setError('Something went wrong!');
		}, 4000);
	}

	function removerError() {
		setError('');
		setInvalid('');
	}

	return (
		<section className={`page`}>
			<h2 className='heading'>
				<span>WAtson</span>
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
						onFocus={removerError}
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
							onFocus={removerError}
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
						onFocus={removerError}
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
		</section>
	);
};
