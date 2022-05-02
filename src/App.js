import React, {Component} from 'react';
import Particles from "react-tsparticles";
import Clarifai from 'clarifai';
import Signin from './components/signin/signin.js';
import Register from './components/register/register.js';
import FaceRecognition from './components/facerecognition/facerecognition.js';
import Navigation from './components/navigation/navigation.js';
import Logo from './components/logo/logo.js';
import Rank from './components/rank/rank.js';
import ImageLinkForm from './components/imagelinkform/imagelinkform.js';
import './App.css';
import 'tachyons';


const particleOptions = {
	        fpsLimit: 120,
	        interactivity: {
	          events: {
	            onClick: {
	              enable: false,
	              mode: "push",
	            },
	            onHover: {
	              enable: true,
	              mode: "repulse",
	            },
	            resize: true,
	          },
	          modes: {
	            bubble: {
	              distance: 400,
	              duration: 2,
	              opacity: 0.8,
	              size: 40,
	            },
	            push: {
	              quantity: 4,
	            },
	            repulse: {
	              distance: 100,
	              duration: 0.4,
	            },
	          },
	        },
	        particles: {
	          color: {
	            value: "#ffffff",
	          },
	          links: {
	            color: "#ffffff",
	            distance: 150,
	            enable: true,
	            opacity: 0.5,
	            width: 1,
	          },
	          collisions: {
	            enable: true,
	          },
	          move: {
	            direction: "none",
	            enable: true,
	            outMode: "bounce",
	            random: false,
	            speed: 1,
	            straight: false,
	          },
	          number: {
	            density: {
	              enable: true,
	              area: 800,
	            },
	            value: 150,
	          },
	          opacity: {
	            value: 0.5,
	          },
	          shape: {
	            type: "circle",
	          },
	          size: {
	            random: true,
	            value: 5,
	          },
	        },
	        detectRetina: true,
}

const initialState = {
		input: '',
		imageUrl:'',
		box: {},
		route: 'signin',
		isSignedIn: false,
		user: {
			id: '',
			name: '',
			email: '',
			entries: 0,
			joined: ''
		}
	}
class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	loadUser = (data) => {
		this.setState({user: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined

		}})
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row *  height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	}

	displayFaceBox = (box) => {
		this.setState({box: box})
	}
	
	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		fetch('http://localhost:3000/imageurl',{
					method:'post',
					headers: {'Content-Type' : 'application/json'},
					body : JSON.stringify({
						input: this.state.input
					})
		})
		.then(response => response.json())
		.then(response => {
			if(response){
				fetch('http://localhost:3000/image',{
					method:'put',
					headers: {'Content-Type' : 'application/json'},
					body : JSON.stringify({
						id: this.state.user.id
					})
				})
					.then(response => response.json())
					.then(count => {
						this.setState(Object.assign(this.state.user, {entries: count}))
					})
					.catch(console.log)
			}
			this.displayFaceBox(this.calculateFaceLocation(response))
		})
		.catch(err => console.log(err));
	}

	onRouteChange = (route) => {
		if (route === 'signout') {
			this.setState(initialState)
		} else if (route === 'home') {
			this.setState({isSignedIn: true})
		}
		this.setState({route: route});
	}

	render() {
		const { isSignedIn, imageUrl, route, box } = this.state;
		return (
			<div className="App">
				<Particles
			      id="tsparticles"
			      options={particleOptions}
			    />
			  <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
			  {route === 'home'
					?   <div>
						  <Logo/>
						  <Rank 
						  name={this.state.user.name} 
						  entries={this.state.user.entries}
						  />

						  <ImageLinkForm 
						  onInputChange={this.onInputChange} 
						  onButtonSubmit={this.onButtonSubmit}
						  />

						  <FaceRecognition box={box} imageUrl={imageUrl}/>
						 </div> 
					:   (
						route === 'signin'
						? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
						: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
						)
					  	
				  
			  }
			</div>
		);
	}
}

export default App;
