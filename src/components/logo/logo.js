import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './logo.css';

const Logo = () => {
	return(
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2"  style={{ height: 150, width: 150}}>
		      <div style={{ height: '300px' }}>
		        <div className="pa3"><img style={{paddingTop: '20px'}} alt='logo' src={brain}/></div>
		      </div>
		    </Tilt>
		</div>
	);
}

export default Logo;