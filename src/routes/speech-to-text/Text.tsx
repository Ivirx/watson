import { useState } from 'react';

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

export const Text = ({
	text,
	handleDelete,
}: {
	text: Text;
	handleDelete(id: string): void;
}) => {
	const [copySuccess, setCopySuccess] = useState(false);

	const handleCopyClick = (text: Text) => {
		const textToCopy = `curl -X POST -u "apikey:${text.apikey}" --header "Content-Type: ${text.file.type}" --data-binary "@<path/to/file>" "${text.endpoint}"`;

		navigator.clipboard.writeText(textToCopy).then(() => {
			setCopySuccess(true);

			setTimeout(() => {
				setCopySuccess(false);
			}, 2000);
		});
	};

	return (
		<div className='text-card'>
			<div className='top'>
				<p className='title'>{text.file.name}</p>
				<div className='actions'>
					<button
						className={`${copySuccess ? 'copied' : ''}`}
						onClick={() => handleCopyClick(text)}
					>
						<span className='material-symbols-rounded'>content_copy</span>
					</button>
					<button onClick={() => handleDelete(text.id)}>
						<span className='material-symbols-rounded'>close</span>
					</button>
				</div>
			</div>
			<div className='speech'>
				<span>Speech</span>
				<p>{text.text}</p>
				<span>Confidence : {text.confidence}</span>
			</div>
		</div>
	);
};
