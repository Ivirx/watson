import { Link } from 'react-router-dom';

export const Error = () => {
	return (
		<section className='not-found'>
			<div>
				<h2>
					<span>404</span>
					<span>Not Found</span>
				</h2>
				<p>
					<Link to='/'>Go to Home</Link>
				</p>
			</div>
		</section>
	);
};
