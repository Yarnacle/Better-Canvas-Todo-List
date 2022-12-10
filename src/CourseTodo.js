import './CourseTodo.css';

function CourseTodo(props) {
	return (
    <div className="CourseTodo">
		<p className="course-name">{ props.courseName }</p>
		<hr />
		<ul>
			{ props.todoList.map(assignment => {
				const dueDate = new Date(assignment.due_at);
				return (
					<li>
						<a href={ assignment.html_url } target="_blank">{ assignment.name }</a> due at { dueDate.getDate() } at { dueDate.getHours() }:{ dueDate.getMinutes().toString().padStart(2,'0') }
					</li>
				)
			}) }
		</ul>
    </div>
  );
}

export default CourseTodo;