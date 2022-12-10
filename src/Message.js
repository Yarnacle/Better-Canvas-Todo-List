import './Message.css';

function Message(props) {
	return (
    <div className="Message">
		<p>{ props.message }</p>
    </div>
  );
}

export default Message;