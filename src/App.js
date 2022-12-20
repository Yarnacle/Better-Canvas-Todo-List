import './App.css';
import { useState,useRef,useEffect,useCallback } from 'react';
import Error from './Error.js';
import CourseTodo from './CourseTodo.js';

function App(props) {
	const [collapsedTodoForm,setCollapsedTodoForm] = useState(false);

	const [todo,setTodo] = useState();
	const [loading,setLoading] = useState(false);
	const [courseList,setCourseList] = useState();

	const [canvasInstance,setCanvasInstance] = useState('');
	const [authToken,setAuthToken] = useState('');
	const submittedInstance = useRef('');
	const submittedToken = useRef('');

	const [errorMessage,setErrorMessage] = useState('');

	const lastUpdated = useRef();
	const [minuteCount,setMinuteCount] = useState(0);

	const refresh = useCallback(() => {
		setLoading(true);
		fetch(`https://api.allorigins.win/get?url=https://${submittedInstance.current}.instructure.com/api/v1/users/self/todo?access_token=${submittedToken.current}&t=${new Date().getTime()}`)
		.then(response => response.json())
		.then(response => {
			setLoading(false);
			const contents = JSON.parse(response.contents);
			update(contents);
		})
		.catch((e) => {
			setLoading(false);
			setErrorMessage(['An unexpected error occured:',e.toString()]);
		});
	},[]);

	const update = contents => {
		lastUpdated.current = new Date();
		const todoObj = {};
		for (let i = 0; i < contents.length; i++) {
			if (!todoObj[contents[i].context_name]) {
				todoObj[contents[i].context_name] = [];
			}
			todoObj[contents[i].context_name].push(contents[i].assignment);
		}
		setCourseList(Object.keys(todoObj).sort((a,b) => todoObj[b].length - todoObj[a].length));

		setTodo(todoObj);
	};

	const handleResponse = response => {
		setLoading(false);
		
		// error handling
		if (response.contents == null) {
			setErrorMessage(['Invalid form submission']);
			return;
		}
		const contents = JSON.parse(response.contents);
		if (contents.message) {
			setErrorMessage([contents.message]);
			return;
		}
		if (contents.errors) {
			setErrorMessage(contents.errors.map(error => error.message));
			return;
		}

		// save valid form data so auto refresh
		// can continue working even if form is
		// modified after submission
		submittedInstance.current = canvasInstance;
		submittedToken.current = authToken;

		setCollapsedTodoForm(true);
		update(contents);
	};
	const getTodoInfo = event => {
		event.preventDefault();
		setTodo();
		setErrorMessage();
		setLoading(true);

		fetch(`https://api.allorigins.win/get?url=https://${canvasInstance}.instructure.com/api/v1/users/self/todo?access_token=${authToken}&t=${new Date().getTime()}`)
		.then(response => response.json())
		.then(handleResponse)
		.catch((e) => {
			setLoading(false);
			setErrorMessage(['An unexpected error occured:',e.toString()]);
		});
	};

	useEffect(() => {
		const autoUpdate = setInterval(() => {
			if (!lastUpdated.current) {
				return;
			}
			const minDiff = Math.floor((new Date() - lastUpdated.current) / 60000);
			setMinuteCount(minDiff);
			if (minDiff >= 10) {
				refresh();
			}
		},500);
		return () => {
			clearInterval(autoUpdate);
		}
	},[refresh]);

	return (
		<div className="App">
			<div className="box notification header">
				{!collapsedTodoForm &&
					<div className="block">
						<form onSubmit={getTodoInfo}>
							<div className="field">
								<label className="label">Canvas Instance</label>
								<div className="control has-icons-left">
									<input className="input" id="instance-field" value={canvasInstance} onChange={(e) => setCanvasInstance(e.target.value)} type="text" size="35" placeholder="e.g school" />
									<span className="icon is-small is-left">
										<i className="fa-solid fa-school"></i>
									</span>
								</div>
								<p className="help">For "school.instructure.com", the instance name would be "school".</p>
							</div>
							<div className="field">
								<label className="label">Account API Token</label>
								<div className="control has-icons-left">
									<input className="input" id="token-field" value={authToken} onChange={ (e) => setAuthToken(e.target.value) } type="password" size="70" placeholder="e.g 12345~abcd" />
									<span className="icon is-small is-left">
										<i className="fa-solid fa-key" />
									</span>
								</div>
								<a className="help" target="_blank" href="https://community.canvaslms.com/t5/Student-Guide/How-do-I-manage-API-access-tokens-as-a-student/ta-p/273" rel="noreferrer">Need an API Token?</a>
							</div>
							<div className="field">
								<div className="control">
									<button className={"button is-link" + (loading ? ' is-loading' : '')} type="submit" >Get Todo</button>
								</div>
							</div>
						</form>
					</div>
				}
				<div className="block">
					<button className="button toggle-collapse-button is-light" onClick={ () => {setCollapsedTodoForm(!collapsedTodoForm)} }>
						<i className={'fa-solid ' + (collapsedTodoForm ? 'fa-chevron-down' : 'fa-chevron-up')}></i>
					</button>
				</div>
			</div>
			<div className="content">
				{
					errorMessage ? <Error message={errorMessage} />
						: todo ? courseList.map(course => <CourseTodo key={course} courseName={course} todoList={todo[course]} />)
						: ''
				}
			</div>
			{lastUpdated.current &&
				<div className="notificatoin is-light refresh-status px-4 py-2">
					<p>
						{ loading ? <span className="bulma-loader-mixin"></span>
							:<span onClick={ refresh } className="refresh-button icon is-small">
								<i className="fa-solid fa-rotate-right"></i>
							</span>
						}
						<span className="last-updated ml-2">{`Last updated ${minuteCount ? minuteCount + ' ' + (minuteCount > 1 ? ' minutes':'minute') + ' ago':'now'}` }</span>
					</p>
				</div>
			}
		</div>
	);
}

export default App;