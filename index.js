var form = document.getElementById('load-data-form');
form.addEventListener('submit',loadTodo);

function enableForm() {
	for (let i = 0; i < form.elements.length; i++) {
		form.elements[i].disabled = false;
	}
}

function loadTodo(e) {
	e.preventDefault();
	
	for (let i = 0; i < form.elements.length; i++) {
		form.elements[i].disabled = true;
	}
	
	var apiTokenHelpElement = document.getElementById('api-token-help');
	if (apiTokenHelpElement) {
		document.body.removeChild(apiTokenHelpElement);
	}

	var content = document.getElementById('content');
	var courseListElement = document.getElementById('course-list');

	const error = (field,messages) => {
		content.style.display = 'none';
		if (courseListElement) {
			content.removeChild(courseListElement);
		}
		field.setAttribute('class','error');
		errorElement = document.createElement('div');
		errorElement.setAttribute('id','error');
		errorElement.innerHTML = '<ul id="error-list"></ul>';
		document.body.insertBefore(errorElement,content);

		let errorListElement = document.getElementById('error-list');
		for (let i = 0; i < messages.length; i++) {
			errorListElement.innerHTML += `<li>${messages[i]}</li>`;
		}
		enableForm();
		throw new Error('Invalid form input');
	}


	var errorElement = document.getElementById('error');
	if (errorElement) {
		document.body.removeChild(errorElement);
	}


	var tokenField = document.getElementById('token-field');
	const token = tokenField.value;

	var instanceField = document.getElementById('instance-field');
	const instance = instanceField.value;

	if (tokenField.classList.contains('error')) {
		tokenField.classList.remove('error');
	}
	if (instanceField.classList.contains('error')) {
		instanceField.classList.remove('error');
	}

	if (!instance) {
		error(instanceField,['invalid instance'])
	}


	if (courseListElement) {
		courseListElement.innerHTML = null;
	}
	else {
		courseListElement = document.createElement('ul');
		courseListElement.setAttribute('id','course-list');
		content.appendChild(courseListElement);
	}

	var loadingElement = document.getElementById('loading');

	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			loadingElement.style.display = 'none';

			const todoObj = JSON.parse(JSON.parse(this.responseText).contents);

			if (todoObj == null) {
				error(instanceField,['invalid instance'])
			}

			if (todoObj.errors) {
				let messages = [];
				for (let i = 0; i < todoObj.errors.length; i++) {
					messages.push(todoObj.errors[i].message);
				}
				error(tokenField,messages);
			}
			if (todoObj.message) {
				error(instanceField,[todoObj.message]);
			}
			
			enableForm();
			content.style.display = 'block';
			
			const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

			let simplifiedTodoObj = {};
			for (let i = 0; i < todoObj.length; i++) {
				let courseName = todoObj[i].context_name;
				if (!simplifiedTodoObj[courseName]) {
					simplifiedTodoObj[courseName] = [];
				}
				simplifiedTodoObj[courseName].push(todoObj[i].assignment);
			}

			const courses = Object.keys(simplifiedTodoObj);
			for (let i = 0; i < courses.length; i++) {
				let courseContainerElement = document.createElement('li');
				courseContainerElement.setAttribute('class','course-container-li');
				let courseBoxElement = document.createElement('div');
				courseBoxElement.setAttribute('class','course-box');
			
				const courseTodoList = simplifiedTodoObj[courses[i]];

				courseBoxElement.innerHTML += `<p class="course-name">${courses[i]}</p><hr />`;

				let courseTodoListElement = document.createElement('ul');
				for (let j = 0; j < courseTodoList.length; j++) {
					let dueDate = new Date(courseTodoList[j].due_at);

					courseTodoListElement.innerHTML += `
						<li>
							<a href="${courseTodoList[j].html_url}" target="_blank">${courseTodoList[j].name}</a>
							due ${months[dueDate.getMonth()]} ${dueDate.getDate()} at ${dueDate.getHours()}:${dueDate.getMinutes()}
						</li>`;
				}
				courseBoxElement.appendChild(courseTodoListElement);
				courseContainerElement.appendChild(courseBoxElement);
				courseListElement.appendChild(courseContainerElement);
				courseListElement.innerHTML += '<br />';
			}
		}
	};
	xhttp.open('get',`https://api.allorigins.win/get?url=${encodeURIComponent('https://' + instance + '.instructure.com/api/v1/users/self/todo')}?access_token=${token}&t=${new Date().getTime()}`);
	xhttp.send();
	content.style.display = 'none';
	loadingElement.style.display = 'inline';
}
