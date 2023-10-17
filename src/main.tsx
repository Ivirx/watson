import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Error } from './components/Error';
import { Home } from './routes/home/Home';
import { TTS } from './routes/text-to-speech/TTS';
import { STT } from './routes/speech-to-text/STT';
import './index.scss';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
		errorElement: <Error />,
	},
	{
		path: '/tts',
		element: <TTS />,
	},
	{
		path: '/stt',
		element: <STT />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
