import './App.css';
import { useState } from 'react';
import Message from './Message.js';
import Error from './Error.js';
import CourseTodo from './CourseTodo.js';

function App(props) {
	const [message,setMessage] = useState('...');

	const [todo,setTodo] = useState();
	const [loading,setLoading] = useState(false);

	const [canvasInstance,setCanvasInstance] = useState();
	const [authToken,setAuthToken] = useState();

	const [errorMessage,setErrorMessage] = useState('');

	const handleResponse = response => {
		setLoading(false);
		if (response.contents == null) {
			setErrorMessage('Invalid form submission');
			return;
		}
		const contents = JSON.parse(response.contents);
		if (contents.message) {
			setErrorMessage(contents.message);
			return;
		}
		if (contents.errors) {
			setErrorMessage(contents.errors.map(error => error.message).join('\n'));
			return;
		}

		const todoObj = {};
		for (let i = 0; i < contents.length; i++) {
			if (!todoObj[contents[i].context_name]) {
				todoObj[contents[i].context_name] = [];
			}
			todoObj[contents[i].context_name].push(contents[i].assignment);
		}
		setTodo(todoObj);
	}
	const getTodoInfo = event => {
		event.preventDefault();
		setTodo();
		setErrorMessage();
		setLoading(true);

		fetch(`https://api.allorigins.win/get?url=https://${canvasInstance}.instructure.com/api/v1/users/self/todo?access_token=${authToken}&t=${new Date().getTime()}`)
		.then(response => response.json())
		.then(handleResponse)
		.catch((e) => setErrorMessage('An unexpected error occured: ' + e));
	}

	return (
	<>
		{/* <Message id="message" message={ message } /> */}
		<div className="App">
			<div className="form-container">
				<form id="load-data-form" onSubmit={ getTodoInfo }>
					<input id="instance-field" onChange={ (e) => setCanvasInstance(e.target.value) } type="text" size="35" placeholder="Canvas Instance (x.instructure.com)" />
					<input id="token-field" onChange={ (e) => setAuthToken(e.target.value) } type="password" size="70" placeholder="Account API Token" />
					<input type="submit" value="Get Todo" />
				</form>
				<a id="api-token-help" target="_blank" href="https://community.canvaslms.com/t5/Student-Guide/How-do-I-manage-API-access-tokens-as-a-student/ta-p/273">Need an API Token?</a>
			</div>
			<div className="response-container">
				{
					errorMessage ? <Error message={ errorMessage } />
					:loading ? 'loading'
					:todo ? 
					<ul className="course-list">
						{ Object.keys(todo).map(course => <li class="course-list-item"><CourseTodo key={ course } courseName={ course } todoList={ todo[course] } /></li>) }
					</ul>
					:''
				}
			</div>
		</div>
	</>
  );
}

export default App;