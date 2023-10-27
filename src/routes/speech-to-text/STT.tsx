import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Text as T } from './Text';
import './stt.scss';

type Text = {
	id: string;
	endpoint: string;
	apikey: string;
	text: string;
	confidence: number;
	file: {
		name: string;
		type: string;
	};
};

export const STT = () => {
	const [url, setUrl] = useState<string>('');
	const [apikey, setApikey] = useState<string>('');
	const [file, setFile] = useState<File>();
	const [fileName, setFileName] = useState<string>('No file is selected!');

	const [texts, setTexts] = useState<Text[]>([]);

	const [fetching, setFetching] = useState(false);
	const [invalid, setInvalid] = useState<string>('');
	const [error, setError] = useState<string>('');

	const [isLoaded, setIsLoaded] = useState(false);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		let invalidInputs = '';

		if (!url) invalidInputs += '-url';
		if (!apikey) invalidInputs += '-apikey';
		if (!file) invalidInputs += '-file';

		if (invalidInputs) {
			setError('Please fill in all required fields!');
			setInvalid(invalidInputs);
			return;
		}

		if (
			!url.toLowerCase().startsWith('https://api.') ||
			!url.toLowerCase().endsWith('/v1/recognize')
		) {
			setError('URL is not valid!');
			setInvalid('-url');
			return;
		}

		// console.log(url, apikey, file);

		setInvalid('');
		setError('');
		setFetching(true);

		axios
			.request({
				method: 'POST',
				url: url,
				auth: {
					username: 'apikey',
					password: apikey,
				},
				headers: {
					'Content-Type': file?.type,
				},
				data: file,
			})
			.then((res) => {
				// console.log(res.data);

				setTexts((texts) => [
					{
						id: Date.now().toString(),
						endpoint: url,
						apikey,
						text: res.data.results[0].alternatives[0].transcript,
						confidence: res.data.results[0].alternatives[0].confidence,
						file: {
							name: file?.name || '',
							type: file?.type || '',
						},
					},
					...texts,
				]);

				setFetching(false);
				setInvalid('');
				setError('');
			})
			.catch((err) => {
				// console.log(err);

				if (err.code === 'ERR_NETWORK') {
					setError('Please check your Internet OR URL/Apikey.');
					setInvalid('-url-apikey');
					setFetching(false);
					return;
				}

				setError(err.message);
				setInvalid('');
				setFetching(false);
			});
	}

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const fileToSelect = event.target.files?.[0];

		if (!fileToSelect) {
			setFile(undefined);
			setFileName('No file is selected!');
			return;
		}

		const allowedFileTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg'];
		if (!allowedFileTypes.includes(fileToSelect.type)) {
			setInvalid('-file');
			setError('File type is not supported!');
			setFile(undefined);
			setFileName('No file is selected!');
			return;
		}

		removeError();
		setFile(fileToSelect);
		setFileName(fileToSelect.name);
	}

	function removeError() {
		setError('');
		setInvalid('');
	}

	function handleDelete(id: string) {
		setTexts((pre) => pre.filter((text) => text.id !== id));
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
				<span>/&nbsp;speech to text</span>
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
				<div className={`apikey input ${/-apikey/g.test(invalid) ? 'invalid' : ''}`}>
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
				<label
					className={`file input ${/-file/g.test(invalid) ? 'invalid' : ''}`}
					htmlFor='file'
				>
					<span className='label'>Upload</span>
					<input
						type='file'
						name='file'
						id='file'
						autoComplete='off'
						placeholder='. . .'
						accept='audio/*'
						onChange={handleFileChange}
						onFocus={removeError}
					/>
					<div className='sudo-input'>
						<span>Choose File</span>
						<span>{fileName}</span>
					</div>
					<p className='types'>Supported types : WAV, MP3, MPEG</p>
				</label>
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
					<button type='submit'>Recognize</button>
				</div>
			</form>
			<div className='text'>
				<h2>Your Texts</h2>
				{!texts.length && <p className='no-texts'>You have no Text yet.</p>}
				{texts.map((text) => (
					<T key={text.id} text={text} handleDelete={handleDelete} />
				))}
			</div>
		</section>
	);
};
