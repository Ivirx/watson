import React, { useEffect, useState } from 'react';

import { Voice } from '../../components/voices';

export const Select = ({
	selected,
	setSelected,
	allVoices,
	setIsOpen,
}: {
	selected: Voice;
	setSelected: React.Dispatch<React.SetStateAction<Voice>>;
	allVoices: Voice[];
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [voices, setVoices] = useState(allVoices);

	function handleOpen(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		event.stopPropagation();

		setIsOpen((pre) => !pre);
	}

	function hadleSelect(value: string) {
		return () => {
			setVoices((pre) => {
				const newVoices = pre.map((v) => {
					if (v.value === value) {
						return { ...v, selected: true };
					}
					return { ...v, selected: false };
				});
				return newVoices;
			});
			const newVoice = voices.find((v) => v.value === value) || voices[0];
			setSelected(newVoice);
		};
	}

	useEffect(() => {
		setSelected({ ...voices[0], selected: true });

		function handleClick(event: MouseEvent) {
			event.stopPropagation();
			setIsOpen(false);
		}

		document.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, []);

	return (
		<div className='select' onClick={handleOpen}>
			<div className='value'>
				<span>{selected?.name}</span>
				<span>/ {selected?.gender}</span>
				<span>/ {selected?.accent}</span>
			</div>
			<div className='options' tabIndex={-1}>
				{voices.map((v) => (
					<div
						key={v.name}
						className={`option ${v.selected ? 'selected' : ''}`}
						onClick={hadleSelect(v.value)}
					>
						<span>{v.name}</span>
						<span>/ {v.gender}</span>
						<span>/ {v.accent}</span>
					</div>
				))}
			</div>
		</div>
	);
};
