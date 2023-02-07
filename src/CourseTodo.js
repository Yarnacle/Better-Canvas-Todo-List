import './CourseTodo.css';

function CourseTodo(props) {

	const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nove','Dec'];

	return (
    <div className="CourseTodo">
		<div className="panel is-info">
			<p className="panel-heading">{ props.courseName }</p>
			{ props.todoList.map(assignment => {
				const dueDate = new Date(assignment.due_at);
				return (
					<a className="panel-block" href={ assignment.html_url } target="_blank" rel="noreferrer" key="{ assignment.id }">
						<span className={'tag is-info ml-0 ' + (props.darkMode ? 'is-dark':'is-light')}>{ months[dueDate.getMonth()] } { dueDate.getDate() }</span>
						<span className={'tag is-info ml-2 mr-2 ' + (props.darkMode ? 'is-dark':'is-light')}>{ dueDate.getHours() }:{ dueDate.getMinutes().toString().padStart(2,'0') }</span>
						<span>{ assignment.name }</span>
					</a>
				)
			}) }
		</div>
    </div>
  );
}

export default CourseTodo;