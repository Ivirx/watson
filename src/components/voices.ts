export type Voice = {
	value: string;
	name: string;
	language: string;
	accent: string;
	gender: string;
	description: string;
	selected: boolean;
};

export const voice = [
	{
		value: 'en-US_AllisonV3Voice',
		name: 'Allison',
		language: 'english',
		accent: 'american',
		gender: 'female',
		description: 'Allison: American English female voice. Dnn technology.',
	},
	{
		value: 'en-GB_CharlotteV3Voice',
		name: 'Charlotte',
		language: 'english',
		accent: 'british',
		gender: 'female',
		description: 'Charlotte: British English female voice. Dnn technology.',
	},
	{
		value: 'en-GB_JamesV3Voice',
		name: 'James',
		language: 'english',
		accent: 'british',
		gender: 'male',
		description: 'James: British English male voice. Dnn technology.',
	},
	{
		value: 'en-US_OliviaV3Voice',
		name: 'Olivia',
		language: 'english',
		accent: 'american',
		gender: 'female',
		description: 'Olivia: American English female voice. Dnn technology.',
	},
	{
		value: 'en-US_EmilyV3Voice',
		name: 'Emily',
		language: 'english',
		accent: 'american',
		gender: 'female',
		description: 'Emily: American English female voice. Dnn technology.',
	},
	{
		value: 'en-GB_KateV3Voice',
		name: 'Kate',
		language: 'english',
		accent: 'british',
		gender: 'female',
		description: 'Kate: British English female voice. Dnn technology.',
	},
	{
		value: 'en-US_MichaelV3Voice',
		name: 'Michael',
		language: 'english',
		accent: 'american',
		gender: 'male',
		description: 'Michael: American English male voice. Dnn technology.',
	},
	{
		value: 'en-US_HenryV3Voice',
		name: 'Henry',
		language: 'english',
		accent: 'american',
		gender: 'male',
		description: 'Henry: American English male voice. Dnn technology.',
	},
	{
		value: 'en-US_KevinV3Voice',
		name: 'Kevin',
		language: 'english',
		accent: 'american',
		gender: 'male',
		description: 'Kevin: American English male voice. Dnn technology.',
	},
	{
		value: 'en-US_LisaV3Voice',
		name: 'Lisa',
		language: 'english',
		accent: 'american',
		gender: 'female',
		description: 'Lisa: American English female voice. Dnn technology.',
	},
];

export const allVoices = voice.map((v, i) => {
	if (i === 0) return { ...v, selected: true };

	return { ...v, selected: false };
});
