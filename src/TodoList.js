import './App.css';
import { useState } from 'react';
import Message from './Message.js';

function TodoList(props) {
	const [message,setMessage] = useState('...');
	const onClickHandler = param1 => {
		setMessage(previousState => previousState + '.');
	}

	return (
	<>
		<Message id="message" message={ message } />
		<div className="App">
			<form id="load-data-form">
				<input id="instance-field" type="text" size="35" placeholder="Canvas Instance (x.instructure.com)" />
				<input id="token-field" type="password" size="70" placeholder="Account API Token" />
				<input type="submit" value="Get Todo" />
			</form>
			<a id="api-token-help" target="_blank" href="https://community.canvaslms.com/t5/Student-Guide/How-do-I-manage-API-access-tokens-as-a-student/ta-p/273">Need an API Token?</a>
			<hr />
		</div>
	</>
  );
}

export default TodoList;
