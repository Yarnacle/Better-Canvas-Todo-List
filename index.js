var form = document.getElementById('load-data-form');
form.addEventListener('submit',loadTodo);

function loadTodo(e) {
	e.preventDefault();
	
	for (let i = 0; i < form.elements.length; i++) {
		form.elements[i].disabled = true;
	}
	
	var apiTokenHelpElement = document.getElementById('api-token-help');
	if (apiTokenHelpElement) {
		document.body.removeChild(apiTokenHelpElement);
	}

	var courseListElement = document.getElementById('course-list');

	const error = (field,messages) => {
		if (courseListElement) {
			document.body.removeChild(courseListElement);
		}
		field.style.borderColor = 'red';
		errorElement = document.createElement('div');
		errorElement.setAttribute('id','error');
		errorElement.innerHTML = '<ul id="error-list"></ul>';
		document.body.appendChild(errorElement);

		let errorListElement = document.getElementById('error-list');
		for (let i = 0; i < messages.length; i++) {
			errorListElement.innerHTML += `<li>${messages[i]}</li>`;
		}
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

	if (tokenField.style.borderColor == 'red') {
		tokenField.style.removeProperty('border');
	}
	if (instanceField.style.borderColor == 'red') {
		instanceField.style.removeProperty('border');
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
		document.body.appendChild(courseListElement);
	}

	var loadingElement = document.getElementById('loading');

	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			loadingElement.style.display = 'none';
			
			for (let i = 0; i < form.elements.length; i++) {
				form.elements[i].disabled = false;
			}

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
				error(tokenField,[todoObj.message]);
			}

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
				const courseTodoList = simplifiedTodoObj[courses[i]];

				courseListElement.innerHTML += `<li>${courses[i]}</li>`;

				let courseTodoListElement = document.createElement('ul');
				for (let j = 0; j < courseTodoList.length; j++) {
					let dueDate = new Date(courseTodoList[j].due_at);

					courseTodoListElement.innerHTML += `
						<li>
							<a href="${courseTodoList[j].html_url}" target="_blank">${courseTodoList[j].name}</a>
							due ${months[dueDate.getMonth()]} ${dueDate.getDay()} at ${dueDate.getHours()}:${dueDate.getMinutes()}
						</li>`;
				}

				courseListElement.appendChild(courseTodoListElement);
				courseListElement.innerHTML += '<br />';
			}
		}
	};
	xhttp.open('get',`https://api.allorigins.win/get?url=${encodeURIComponent('https://' + instance + '.instructure.com/api/v1/users/self/todo')}?access_token=${token}&t=${new Date().getTime()}`);
	xhttp.send();
	loadingElement.style.display = 'inline';
}
