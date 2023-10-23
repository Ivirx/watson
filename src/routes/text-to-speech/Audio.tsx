import { useState } from 'react';

import { Voice } from '../../components/voices';

type Audio = {
	id: string;
	audioUrl: string;
	endpoint: string;
	title: string;
	text: string;
	voice: Voice;
	apikey: string;
};

export const Audio = ({
	audio,
	handleDelete,
}: {
	audio: Audio;
	handleDelete(id: string): void;
}) => {
	const [copySuccess, setCopySuccess] = useState(false);

	const handleCopyClick = (audio: Audio) => {
		const textToCopy = `curl -X POST -u "apikey:${audio.apikey}" --header "Content-Type: application/json" --header "Accept: audio/mp3" --data "{\\"text\\":\\"${audio.text}\\"}" --output ${audio.id}.mp3 "${audio.endpoint}?voice=${audio.voice.value}"`;

		navigator.clipboard.writeText(textToCopy).then(() => {
			setCopySuccess(true);

			setTimeout(() => {
				setCopySuccess(false);
			}, 2000);
		});
	};

	return (
		<div className='audio-card' key={audio.id}>
			<div className='actions'>
				<audio controls src={audio.audioUrl}></audio>
				<div>
					<button
						className={`${copySuccess ? 'copied' : ''}`}
						onClick={() => handleCopyClick(audio)}
						title='Copy CURL code to clipboard'
					>
						<span className='material-symbols-rounded'>content_copy</span>
					</button>
					<button onClick={() => handleDelete(audio.id)}>
						<span className='material-symbols-rounded'>close</span>
					</button>
				</div>
			</div>
			<p className='title'>{audio.title}</p>
			<p className='voice'>
				<span>Voice :</span>
				<span>{audio.voice.name} /</span>
				<span>{audio.voice.gender} /</span>
				<span>{audio.voice.accent}</span>
			</p>
		</div>
	);
};
